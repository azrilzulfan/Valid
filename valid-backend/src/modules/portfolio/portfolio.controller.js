// src/modules/portfolio/portfolio.controller.js

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db, admin } = require('../../config/firebase');
const cloudinary = require('../../config/cloudinary');
const { createNotification } = require('../notification/notification.service');

// Fungsi hash file untuk cek duplikasi
const generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Upload file ke Cloudinary dari buffer (in-memory)
const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
};

// 1. Upload portofolio beserta file ke Cloudinary
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

      // Cek duplikasi hash di Firestore
      const dupSnap = await db.collection('portfolios')
        .where('checksumHash', '==', fileHash)
        .limit(1)
        .get();

      if (!dupSnap.empty) {
        return res.status(409).json({
          error:       'File ini terdeteksi sudah pernah diunggah.',
          duplicateOf: dupSnap.docs[0].data().portfolioId
        });
      }

      const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

      const uploadResult = await uploadToCloudinary(file.buffer, {
        folder:        `valid/portfolios/${req.user.uid}/${portfolioId}`,
        public_id:     `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
        resource_type: resourceType,
      });

      fileUrls.push({
        fileName:   file.originalname,
        fileUrl:    uploadResult.secure_url,
        fileType:   file.mimetype,
        publicId:   uploadResult.public_id,
        uploadedAt: new Date().toISOString()
      });
    }

    const combinedHash = crypto
      .createHash('sha256')
      .update(hashes.join(''))
      .digest('hex');

    const portfolioData = {
      portfolioId,
      uid:              req.user.uid,
      title,
      description,
      vocationField,
      fileUrls,
      repositoryUrl:    repositoryUrl || '',
      checksumHash:     combinedHash,
      status:           'pending',
      assignedVerifier: null,
      assignedAt:       null,
      verifierReview:   null,
      peerReviews:      [],
      userComments:     [],
      verifiedScore:    null,
      submittedAt:      new Date().toISOString(),
    };

    await db.collection('portfolios').doc(portfolioId).set(portfolioData);

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
    const snapshot = await db.collection('portfolios')
      .where('uid', '==', req.user.uid)
      .orderBy('submittedAt', 'desc')
      .get();

    const portfolios = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        portfolioId:    d.portfolioId,
        title:          d.title,
        vocationField:  d.vocationField,
        status:         d.status,
        verifiedScore:  d.verifiedScore,
        submittedAt:    d.submittedAt,
      };
    });

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

// 3. Detail portofolio tertentu (hanya pemilik)
const getPortfolioById = async (req, res, next) => {
  try {
    const portfolioSnap = await db.collection('portfolios').doc(req.params.portfolioId).get();

    if (!portfolioSnap.exists || portfolioSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    res.json({ portfolio: portfolioSnap.data() });
  } catch (error) {
    next(error);
  }
};

// 4. Daftar portofolio pending untuk peer reviewer
const getPendingReviews = async (req, res, next) => {
  try {
    const snapshot = await db.collection('portfolios')
      .where('status', '==', 'pending')
      .orderBy('submittedAt', 'asc')
      .limit(10)
      .get();

    // Filter: bukan milik sendiri dan belum pernah direview user ini
    const portfolios = snapshot.docs
      .map(doc => doc.data())
      .filter(p => {
        const isOwner = p.uid === req.user.uid;
        const alreadyReviewed = p.peerReviews.some(r => r.reviewerId === req.user.uid);
        return !isOwner && !alreadyReviewed;
      })
      .map(p => ({
        portfolioId:   p.portfolioId,
        title:         p.title,
        vocationField: p.vocationField,
        description:   p.description,
        submittedAt:   p.submittedAt,
      }));

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

    if (technicalAccuracy === undefined || processDocumentation === undefined ||
        originality === undefined || !feedback) {
      return res.status(400).json({ error: 'Semua field penilaian wajib diisi' });
    }

    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    const portfolioSnap = await portfolioRef.get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    const portfolio = portfolioSnap.data();

    if (portfolio.uid === req.user.uid) {
      return res.status(403).json({ error: 'Tidak dapat mereview portofolio sendiri' });
    }

    if (portfolio.peerReviews.some(r => r.reviewerId === req.user.uid)) {
      return res.status(409).json({ error: 'Kamu sudah pernah mereview portofolio ini' });
    }

    const overallScore = Math.round((technicalAccuracy + processDocumentation + originality) / 3);

    const newReview = {
      reviewerId: req.user.uid,
      scores:     { technicalAccuracy, processDocumentation, originality, overall: overallScore },
      feedback,
      reviewedAt: new Date().toISOString()
    };

    const updatedReviews = [...portfolio.peerReviews, newReview];
    const updates = { peerReviews: updatedReviews };

    // Jika sudah 2+ review, hitung rata-rata dan ubah status approved
    if (updatedReviews.length >= 2) {
      const avgScore = Math.round(
        updatedReviews.reduce((sum, r) => sum + r.scores.overall, 0) / updatedReviews.length
      );
      updates.verifiedScore = avgScore;
      updates.status = 'approved';

      await createNotification(portfolio.uid, 'portfolio_approved', portfolioId, portfolio.title);
    } else {
      await createNotification(portfolio.uid, 'review_completed', portfolioId, req.user.uid);
    }

    await portfolioRef.update(updates);

    // Tambah poin reputasi untuk reviewer
    await db.collection('users').doc(req.user.uid).update({
      reputationPoints: admin.firestore.FieldValue.increment(10),
      updatedAt:        new Date().toISOString()
    });

    res.json({ message: 'Review berhasil disimpan, poin reputasi +10', overallScore });
  } catch (error) {
    next(error);
  }
};

// 6. Tambah komentar user (sosial, tidak pengaruhi badge)
const addUserComment = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
      return res.status(400).json({ error: 'Komentar tidak boleh kosong' });
    }

    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    const portfolioSnap = await portfolioRef.get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    // Ambil nama user dari Firestore
    const userSnap = await db.collection('users').doc(req.user.uid).get();
    const displayName = userSnap.exists ? userSnap.data().displayName : 'Pengguna';

    const portfolio = portfolioSnap.data();
    const newComment = {
      commentId:   uuidv4(),
      uid:         req.user.uid,
      displayName,
      comment:     comment.trim(),
      createdAt:   new Date().toISOString()
    };

    await portfolioRef.update({
      userComments: [...portfolio.userComments, newComment]
    });

    res.json({ message: 'Komentar berhasil ditambahkan' });
  } catch (error) {
    next(error);
  }
};

// 7. Submit review resmi oleh verifikator yang ditugaskan
const submitVerifierReview = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { technicalAccuracy, processDocumentation, originality, feedback } = req.body;

    if (technicalAccuracy === undefined || processDocumentation === undefined ||
        originality === undefined || !feedback) {
      return res.status(400).json({ error: 'Semua field penilaian wajib diisi' });
    }

    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    const portfolioSnap = await portfolioRef.get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    const portfolio = portfolioSnap.data();

    if (portfolio.assignedVerifier !== req.user.uid) {
      return res.status(403).json({ error: 'Kamu bukan verifikator yang ditugaskan untuk portofolio ini' });
    }

    const overallScore = Math.round((technicalAccuracy + processDocumentation + originality) / 3);

    await portfolioRef.update({
      status:         'approved',
      verifiedScore:  overallScore,
      verifierReview: {
        reviewerId: req.user.uid,
        scores:     { technicalAccuracy, processDocumentation, originality, overall: overallScore },
        feedback,
        reviewedAt: new Date().toISOString()
      }
    });

    // Update statistik verifikator
    const verifierSnap = await db.collection('verifierProfiles').doc(req.user.uid).get();
    if (verifierSnap.exists) {
      const v = verifierSnap.data();
      const newTotal = v.totalReviews + 1;
      const newRating = v.averageRating
        ? ((v.averageRating * v.totalReviews) + overallScore) / newTotal
        : overallScore;

      await db.collection('verifierProfiles').doc(req.user.uid).update({
        totalReviews:  newTotal,
        averageRating: Math.round(newRating * 10) / 10
      });
    }

    await createNotification(portfolio.uid, 'portfolio_approved', portfolioId, portfolio.title);

    res.json({ message: 'Review verifikator berhasil disimpan', overallScore });
  } catch (error) {
    next(error);
  }
};

// 8. Portofolio publik yang sudah approved
const getPublicPortfolios = async (req, res, next) => {
  try {
    const { vocationField } = req.query;

    let query = db.collection('portfolios').where('status', '==', 'approved');
    if (vocationField) {
      query = query.where('vocationField', '==', vocationField);
    }

    const snapshot = await query.orderBy('verifiedScore', 'desc').limit(12).get();

    const portfolios = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        portfolioId:   d.portfolioId,
        uid:           d.uid,
        title:         d.title,
        vocationField: d.vocationField,
        verifiedScore: d.verifiedScore,
        submittedAt:   d.submittedAt,
      };
    });

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getPendingReviews,
  submitPeerReview,
  addUserComment,
  submitVerifierReview,
  getPublicPortfolios
};