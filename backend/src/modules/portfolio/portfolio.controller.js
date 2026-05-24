const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db } = require('../../config/firebase');
const cloudinary = require('../../config/cloudinary');
const Portfolio = require('./portfolio.model');
const { createNotification } = require('../notification/notification.service');

// Fungsi hash file untuk cek duplikasi
const generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Fungsi upload file ke Cloudinary dari buffer
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    uploadStream.end(buffer);
  });
};

// 1. Upload portofolio + file ke Cloudinary
const uploadPortfolio = async (req, res, next) => {
  try {
    const { title, description, vocationField, repositoryUrl } = req.body;
    const files = req.files;

    if (!title || !description || !vocationField) {
      return res.status(400).json({ error: 'title, description, dan vocationField wajib diisi' });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'Minimal 1 file wajib diunggah' });
    }

    const portfolioId = uuidv4();
    const fileUrls = [];
    const hashes = [];

    for (const file of files) {
      const fileHash = generateFileHash(file.buffer);
      hashes.push(fileHash);

      // Cek duplikasi berdasarkan hash
      const existingPortfolio = await Portfolio.findOne({ checksumHash: fileHash });
      if (existingPortfolio) {
        return res.status(409).json({
          error: 'File ini terdeteksi sudah pernah diunggah sebelumnya.',
          duplicateOf: existingPortfolio.portfolioId
        });
      }

      // Tentukan resource_type berdasarkan mimetype
      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

      // Upload ke Cloudinary
      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder:        `veriskill/portfolios/${req.user.uid}/${portfolioId}`,
        public_id:     `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
        resource_type: resourceType,
      });

      fileUrls.push({
        fileName:   file.originalname,
        fileUrl:    uploadResult.secure_url,
        fileType:   file.mimetype,
        publicId:   uploadResult.public_id, // disimpan untuk keperluan delete nanti
        uploadedAt: new Date()
      });
    }

    const combinedHash = crypto
      .createHash('sha256')
      .update(hashes.join(''))
      .digest('hex');

    await Portfolio.create({
      portfolioId,
      uid:           req.user.uid,
      title,
      description,
      vocationField,
      fileUrls,
      repositoryUrl: repositoryUrl || '',
      checksumHash:  combinedHash,
      status:        'pending'
    });

    await db.collection('portfolios').doc(portfolioId).set({
      portfolioId,
      uid:         req.user.uid,
      title,
      vocationField,
      status:      'pending',
      submittedAt: new Date().toISOString()
    });

    res.status(201).json({
      message:   'Portofolio berhasil diunggah dan menunggu peer review',
      portfolioId,
      fileCount: fileUrls.length
    });
  } catch (error) {
    next(error);
  }
};

// 2. Semua portofolio milik user
const getMyPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio
      .find({ uid: req.user.uid })
      .select('portfolioId title vocationField status averageScore submittedAt')
      .sort({ submittedAt: -1 });

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

// 3. Detail portofolio tertentu
const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      portfolioId: req.params.portfolioId,
      uid:         req.user.uid
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

// 4. Daftar portofolio pending untuk reviewer
const getPendingReviews = async (req, res, next) => {
  try {
    const portfolios = await Portfolio
      .find({
        status: 'pending',
        uid: { $ne: req.user.uid },
        'peerReviews.reviewerId': { $ne: req.user.uid }
      })
      .select('portfolioId title vocationField description submittedAt')
      .sort({ submittedAt: 1 })
      .limit(10);

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

// 5. Submit peer review
const submitPeerReview = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { technicalAccuracy, processDocumentation, originality, feedback } = req.body;

    if (
      technicalAccuracy === undefined ||
      processDocumentation === undefined ||
      originality === undefined ||
      !feedback
    ) {
      return res.status(400).json({ error: 'Semua field penilaian wajib diisi' });
    }

    const portfolio = await Portfolio.findOne({ portfolioId });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    if (portfolio.uid === req.user.uid) {
      return res.status(403).json({ error: 'Tidak dapat mereview portofolio sendiri' });
    }

    const alreadyReviewed = portfolio.peerReviews.some(r => r.reviewerId === req.user.uid);
    if (alreadyReviewed) {
      return res.status(409).json({ error: 'Kamu sudah pernah mereview portofolio ini' });
    }

    const overallScore = Math.round((technicalAccuracy + processDocumentation + originality) / 3);

    await Portfolio.updateOne(
      { portfolioId },
      {
        $push: {
          peerReviews: {
            reviewerId: req.user.uid,
            scores:     { technicalAccuracy, processDocumentation, originality, overall: overallScore },
            feedback,
            reviewedAt: new Date()
          }
        }
      }
    );

    await createNotification(portfolio.uid, 'review_completed', portfolioId, req.user.uid);

    const updatedPortfolio = await Portfolio.findOne({ portfolioId });
    if (updatedPortfolio.peerReviews.length >= 2) {
      const avgScore = Math.round(
        updatedPortfolio.peerReviews.reduce((sum, r) => sum + r.scores.overall, 0) /
        updatedPortfolio.peerReviews.length
      );

      await Portfolio.updateOne({ portfolioId }, { averageScore: avgScore, status: 'approved' });

      await db.collection('portfolios').doc(portfolioId).update({
        status: 'approved',
        averageScore: avgScore
      });

      await createNotification(portfolio.uid, 'portfolio_approved', portfolioId, portfolio.title);
    }

    const { admin } = require('../../config/firebase');
    await db.collection('users').doc(req.user.uid).update({
      reputationPoints: admin.firestore.FieldValue.increment(10),
      updatedAt:        new Date().toISOString()
    });

    res.json({
      message:      'Review berhasil disimpan, poin reputasi +10',
      overallScore
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getPendingReviews,
  submitPeerReview
};