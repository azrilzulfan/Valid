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

    if (!title || !description || !vocationField || !repositoryUrl) {
      return res.status(400).json({ error: 'title, description, vocationField, dan repositoryUrl wajib diisi' });
    }

    const portfolioId = uuidv4();
    const fileUrls = [];
    const hashes = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const fileHash = generateFileHash(file.buffer);
        hashes.push(fileHash);

        const dupSnap = await db.collection('portfolios').where('checksumHash', '==', fileHash).limit(1).get();

        if (!dupSnap.empty) {
          return res.status(409).json({
            error: 'File ini terdeteksi sudah pernah diunggah.',
            duplicateOf: dupSnap.docs[0].data().portfolioId,
          });
        }

        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';

        const uploadResult = await uploadToCloudinary(file.buffer, {
          folder: `valid/portfolios/${req.user.uid}/${portfolioId}`,
          public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
          resource_type: resourceType,
        });

        fileUrls.push({
          fileName: file.originalname,
          fileUrl: uploadResult.secure_url,
          fileType: file.mimetype,
          publicId: uploadResult.public_id,
          uploadedAt: new Date().toISOString(),
        });
      }
    }

    const combinedHash = hashes.length > 0 ? crypto.createHash('sha256').update(hashes.join('')).digest('hex') : '';

    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        tags = req.body.tags;
      }
    }

    const portfolioData = {
      portfolioId,
      uid: req.user.uid,
      title,
      description,
      vocationField,
      fileUrls,
      repositoryUrl: repositoryUrl || '',
      checksumHash: combinedHash,
      tags: tags || [],
      skills: tags || [],
      status: 'pending',
      assignedVerifier: null,
      assignedAt: null,
      verifierReview: null,
      peerReviews: [],
      userComments: [],
      verifiedScore: null,
      submittedAt: new Date().toISOString(),
    };

    await db.collection('portfolios').doc(portfolioId).set(portfolioData);

    res.status(201).json({
      message: 'Portofolio berhasil diunggah dan menunggu peer review',
      portfolioId,
      fileCount: fileUrls.length,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Semua portofolio milik user
const getMyPortfolios = async (req, res, next) => {
  try {
    const snapshot = await db.collection('portfolios').where('uid', '==', req.user.uid).orderBy('submittedAt', 'desc').get();

    const portfolios = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        portfolioId: d.portfolioId,
        title: d.title,
        vocationField: d.vocationField,
        description: d.description || '',
        repositoryUrl: d.repositoryUrl || '',
        tags: d.tags || d.skills || [],
        fileUrls: d.fileUrls || [],
        status: d.status,
        verifiedScore: d.verifiedScore,
        submittedAt: d.submittedAt,
        peerReviews: d.peerReviews || [],
      };
    });

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

// 3. Detail portofolio tertentu (Multi-role access control)
const getPortfolioById = async (req, res, next) => {
  try {
    const portfolioSnap = await db.collection('portfolios').doc(req.params.portfolioId).get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    const portfolio = portfolioSnap.data();

    // KUNCI UTAMA PERBAIKAN: Berikan izin akses jika penilik adalah:
    // 1. Pemilik portofolio (Kandidat/Mahasiswa)
    // 2. Verifikator resmi yang ditugaskan (assignedVerifier)
    // 3. Rekan mahasiswa lain yang sedang melakukan fase 'peer review' (status pending)
    const isOwner = portfolio.uid === req.user.uid;
    const isAssignedVerifier = portfolio.assignedVerifier === req.user.uid;
    const isPeerReviewer = portfolio.status === 'pending';

    if (!isOwner && !isAssignedVerifier && !isPeerReviewer) {
      return res.status(403).json({ error: 'Anda tidak memiliki hak akses kekuasaan untuk melihat portofolio ini' });
    }

    res.json({ portfolio });
  } catch (error) {
    next(error);
  }
};

// 4. Daftar portofolio pending untuk peer reviewer
const getPendingReviews = async (req, res, next) => {
  try {
    const snapshot = await db.collection('portfolios').where('status', '==', 'pending').orderBy('submittedAt', 'asc').limit(10).get();

    // Filter: bukan milik sendiri dan belum pernah direview user ini
    const portfolios = snapshot.docs
      .map((doc) => doc.data())
      .filter((p) => {
        const isOwner = p.uid === req.user.uid;
        const alreadyReviewed = p.peerReviews.some((r) => r.reviewerId === req.user.uid);
        return !isOwner && !alreadyReviewed;
      })
      .map((p) => ({
        portfolioId: p.portfolioId,
        title: p.title,
        vocationField: p.vocationField,
        description: p.description,
        submittedAt: p.submittedAt,
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

    if (technicalAccuracy === undefined || processDocumentation === undefined || originality === undefined || !feedback) {
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

    if (portfolio.peerReviews.some((r) => r.reviewerId === req.user.uid)) {
      return res.status(409).json({ error: 'Kamu sudah pernah mereview portofolio ini' });
    }

    const overallScore = Math.round((technicalAccuracy + processDocumentation + originality) / 3);

    const newReview = {
      reviewerId: req.user.uid,
      scores: { technicalAccuracy, processDocumentation, originality, overall: overallScore },
      feedback,
      reviewedAt: new Date().toISOString(),
    };

    const updatedReviews = [...portfolio.peerReviews, newReview];
    const updates = { peerReviews: updatedReviews };

    // Jika sudah 2+ review, hitung rata-rata dan ubah status approved
    if (updatedReviews.length >= 2) {
      const avgScore = Math.round(updatedReviews.reduce((sum, r) => sum + r.scores.overall, 0) / updatedReviews.length);
      updates.verifiedScore = avgScore;
      updates.status = 'approved';

      await createNotification(portfolio.uid, 'portfolio_approved', portfolioId, portfolio.title);
    } else {
      await createNotification(portfolio.uid, 'review_completed', portfolioId, req.user.uid);
    }

    await portfolioRef.update(updates);

    // Tambah poin reputasi untuk reviewer
    await db
      .collection('users')
      .doc(req.user.uid)
      .update({
        reputationPoints: admin.firestore.FieldValue.increment(10),
        updatedAt: new Date().toISOString(),
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
      commentId: uuidv4(),
      uid: req.user.uid,
      displayName,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedComments = portfolio.userComments ? [...portfolio.userComments, newComment] : [newComment];

    await portfolioRef.update({
      userComments: updatedComments,
    });

    res.json({ message: 'Komentar berhasil ditambahkan', comment: newComment, userComments: updatedComments });
  } catch (error) {
    next(error);
  }
};

// 7. Submit review resmi oleh verifikator yang ditugaskan (Terintegrasi Sistem Koin)
const submitVerifierReview = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { technicalAccuracy, processDocumentation, originality, feedback } = req.body;

    if (technicalAccuracy === undefined || processDocumentation === undefined || originality === undefined || !feedback) {
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

    // 1. Kunci status portofolio menjadi approved dan simpan ulasan resmi
    await portfolioRef.update({
      status: 'approved',
      verifiedScore: overallScore,
      verifierReview: {
        reviewerId: req.user.uid,
        scores: { technicalAccuracy, processDocumentation, originality, overall: overallScore },
        feedback,
        reviewedAt: new Date().toISOString(),
      },
    });

    // 2. Ambil data profil verifikator untuk update statistik & cek reviewFee
    const verifierSnap = await db.collection('verifierProfiles').doc(req.user.uid).get();
    let feeEarned = 0;

    if (verifierSnap.exists) {
      const v = verifierSnap.data();
      const newTotal = v.totalReviews + 1;
      const newRating = v.averageRating ? (v.averageRating * v.totalReviews + overallScore) / newTotal : overallScore;

      // 🌟 DYNAMIC FALLBACK RATE CHECK: Prioritaskan fee yang melekat pada order portofolio saat transaksi mahasiswa,
      // jika tidak ada baru gunakan reviewFee standar dari master data profil verifikator.
      feeEarned = portfolio.reviewFee || v.reviewFee || 0;

      // Update akumulasi statistik review di profile verifikator
      await db
        .collection('verifierProfiles')
        .doc(req.user.uid)
        .update({
          totalReviews: newTotal,
          averageRating: Math.round(newRating * 10) / 10,
        });

      // 🌟 ATOMIC WALLET INCREMENT: Tambahkan koin ke dompet utama verifikator di koleksi 'users'
      if (feeEarned > 0) {
        await db
          .collection('users')
          .doc(req.user.uid)
          .update({
            coins: admin.firestore.FieldValue.increment(feeEarned),
            updatedAt: new Date().toISOString(),
          });
      }
    }

    // 3. Picu notifikasi sukses ke akun mahasiswa pemilik portofolio
    await createNotification(portfolio.uid, 'portfolio_approved', portfolioId, portfolio.title);

    res.json({
      message: `Review verifikator berhasil disimpan, saldo koin Anda bertambah +${feeEarned}`,
      overallScore,
      feeEarned,
    });
  } catch (error) {
    next(error);
  }
};

// 8. Portofolio publik yang sudah approved
const getPublicPortfolios = async (req, res, next) => {
  try {
    const { vocationField } = req.query;

    let query = db.collection('portfolios');
    if (vocationField) {
      query = query.where('vocationField', '==', vocationField);
    }

    const snapshot = await query.get();

    // Ambil semua uid unik untuk batch fetch user displayName
    let portfolioDocs = snapshot.docs.map((doc) => doc.data());

    // Urutkan berdasarkan jumlah likes desc (paling banyak di atas), jika sama urutkan berdasarkan submittedAt desc secara in-memory
    portfolioDocs.sort((a, b) => {
      const likesA = a.likes && Array.isArray(a.likes) ? a.likes.length : 0;
      const likesB = b.likes && Array.isArray(b.likes) ? b.likes.length : 0;
      if (likesB !== likesA) {
        return likesB - likesA;
      }
      const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return timeB - timeA;
    });

    // Batasi 12 item
    portfolioDocs = portfolioDocs.slice(0, 12);

    const uniqueUids = [...new Set(portfolioDocs.map((d) => d.uid).filter(Boolean))];

    // Fetch semua user sekaligus
    const userMap = {};
    if (uniqueUids.length > 0) {
      await Promise.all(
        uniqueUids.map(async (uid) => {
          try {
            const userSnap = await db.collection('users').doc(uid).get();
            if (userSnap.exists) {
              userMap[uid] = userSnap.data().displayName || 'Kandidat Valid';
            }
          } catch (_) {}
        })
      );
    }

    const portfolios = portfolioDocs.map((d) => ({
      portfolioId: d.portfolioId,
      uid: d.uid,
      userDisplayName: userMap[d.uid] || 'Kandidat Valid',
      title: d.title,
      description: d.description || '',
      vocationField: d.vocationField,
      tags: d.tags || d.skills || [],
      verifiedScore: d.verifiedScore,
      submittedAt: d.submittedAt,
      likes: d.likes || [],
      userComments: d.userComments || [],
    }));

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

const getAssignedToMe = async (req, res, next) => {
  try {
    const snapshot = await db.collection('portfolios').where('assignedVerifier', '==', req.user.uid).where('status', 'in', ['under_review', 'approved']).orderBy('assignedAt', 'desc').get();

    const portfolios = snapshot.docs.map((doc) => {
      const d = doc.data();
      return {
        portfolioId: d.portfolioId,
        title: d.title,
        vocationField: d.vocationField,
        description: d.description,
        status: d.status,
        assignedAt: d.assignedAt,
        verifiedScore: d.verifiedScore,
        verifierReview: d.verifierReview,
      };
    });

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};
const updatePortfolio = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { title, description, vocationField, repositoryUrl } = req.body;
    const files = req.files;

    if (!title || !description || !vocationField || !repositoryUrl) {
      return res.status(400).json({ error: 'title, description, vocationField, dan repositoryUrl wajib diisi' });
    }

    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    const portfolioSnap = await portfolioRef.get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    const portfolio = portfolioSnap.data();

    // Pastikan user adalah pemilik portofolio
    if (portfolio.uid !== req.user.uid) {
      return res.status(403).json({ error: 'Anda tidak memiliki wewenang untuk memperbarui portofolio ini' });
    }

    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        tags = req.body.tags;
      }
    }

    const updates = {
      title,
      description,
      vocationField,
      repositoryUrl: repositoryUrl || '',
      tags: tags || [],
      skills: tags || [],
      updatedAt: new Date().toISOString(),
    };

    // Jika ada file baru yang diunggah, proses penggantian file
    if (files && files.length > 0) {
      const fileUrls = [];
      const hashes = [];

      for (const file of files) {
        const fileHash = generateFileHash(file.buffer);
        hashes.push(fileHash);

        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'image';
        const uploadResult = await uploadToCloudinary(file.buffer, {
          folder: `valid/portfolios/${req.user.uid}/${portfolioId}`,
          public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`,
          resource_type: resourceType,
        });

        fileUrls.push({
          fileName: file.originalname,
          fileUrl: uploadResult.secure_url,
          fileType: file.mimetype,
          publicId: uploadResult.public_id,
          uploadedAt: new Date().toISOString(),
        });
      }

      // Hapus file lama di Cloudinary jika ada
      if (portfolio.fileUrls && portfolio.fileUrls.length > 0) {
        for (const file of portfolio.fileUrls) {
          if (file.publicId) {
            const resourceType = file.fileType === 'application/pdf' ? 'raw' : 'image';
            try {
              await cloudinary.uploader.destroy(file.publicId, { resource_type: resourceType });
            } catch (cloudinaryError) {
              console.error('Gagal menghapus file lama dari Cloudinary:', cloudinaryError);
            }
          }
        }
      }

      const combinedHash = crypto.createHash('sha256').update(hashes.join('')).digest('hex');
      updates.fileUrls = fileUrls;
      updates.checksumHash = combinedHash;
    }

    await portfolioRef.update(updates);

    res.json({
      message: 'Portofolio berhasil diperbarui',
      portfolio: { ...portfolio, ...updates },
    });
  } catch (error) {
    next(error);
  }
};

const deletePortfolio = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    const portfolioSnap = await portfolioRef.get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    const portfolio = portfolioSnap.data();

    // Pastikan user adalah pemilik portofolio
    if (portfolio.uid !== req.user.uid) {
      return res.status(403).json({ error: 'Anda tidak memiliki wewenang untuk menghapus portofolio ini' });
    }

    // Hapus file di Cloudinary jika ada
    if (portfolio.fileUrls && portfolio.fileUrls.length > 0) {
      for (const file of portfolio.fileUrls) {
        if (file.publicId) {
          const resourceType = file.fileType === 'application/pdf' ? 'raw' : 'image';
          try {
            await cloudinary.uploader.destroy(file.publicId, { resource_type: resourceType });
          } catch (cloudinaryError) {
            console.error('Gagal menghapus file dari Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    await portfolioRef.delete();

    res.json({ message: 'Portofolio berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

// Ambil portofolio publik milik user tertentu berdasarkan UID (tanpa auth)
const getPortfoliosByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const snapshot = await db.collection('portfolios')
      .where('uid', '==', uid)
      .get();

    const portfolioDocs = snapshot.docs.map((doc) => doc.data());

    // Collect all reviewer IDs
    const reviewerUids = new Set();
    portfolioDocs.forEach((d) => {
      if (d.verifierReview && d.verifierReview.reviewerId) {
        reviewerUids.add(d.verifierReview.reviewerId);
      }
      if (d.peerReviews && Array.isArray(d.peerReviews)) {
        d.peerReviews.forEach((r) => {
          if (r.reviewerId) reviewerUids.add(r.reviewerId);
        });
      }
    });

    // Fetch display names for all reviewer IDs
    const reviewerMap = {};
    const uidsArray = [...reviewerUids];
    if (uidsArray.length > 0) {
      await Promise.all(
        uidsArray.map(async (rUid) => {
          try {
            const userSnap = await db.collection('users').doc(rUid).get();
            if (userSnap.exists) {
              reviewerMap[rUid] = userSnap.data().displayName || 'Reviewer';
            } else {
              reviewerMap[rUid] = 'Reviewer';
            }
          } catch (_) {
            reviewerMap[rUid] = 'Reviewer';
          }
        })
      );
    }

    const portfolios = portfolioDocs.map((d) => {
      // Build verifier review with name
      let verifierReview = null;
      if (d.verifierReview) {
        verifierReview = {
          ...d.verifierReview,
          reviewerName: reviewerMap[d.verifierReview.reviewerId] || 'Verifikator Resmi',
        };
      }

      // Build peer reviews with names
      const peerReviews = (d.peerReviews || []).map((r) => ({
        ...r,
        reviewerName: reviewerMap[r.reviewerId] || 'Rekan Reviewer',
      }));

      return {
        portfolioId: d.portfolioId,
        title: d.title,
        vocationField: d.vocationField,
        description: d.description || '',
        repositoryUrl: d.repositoryUrl || '',
        tags: d.tags || d.skills || [],
        fileUrls: d.fileUrls || [],
        verifiedScore: d.verifiedScore,
        submittedAt: d.submittedAt,
        status: d.status || 'pending',
        verifierReview,
        peerReviews,
      };
    });

    // Urutkan berdasarkan submittedAt desc secara in-memory
    portfolios.sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });

    res.json({ portfolios });
  } catch (error) {
    next(error);
  }
};

// Toggle Like
const toggleLikePortfolio = async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const portfolioRef = db.collection('portfolios').doc(portfolioId);
    const portfolioSnap = await portfolioRef.get();

    if (!portfolioSnap.exists) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    const portfolio = portfolioSnap.data();
    const likes = portfolio.likes || [];
    const uid = req.user.uid;

    const userIndex = likes.indexOf(uid);
    let message = '';
    if (userIndex === -1) {
      likes.push(uid);
      message = 'Portofolio disukai';
    } else {
      likes.splice(userIndex, 1);
      message = 'Batal menyukai portofolio';
    }

    await portfolioRef.update({ likes });

    res.json({ message, likes });
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
  getPublicPortfolios,
  getAssignedToMe,
  updatePortfolio,
  deletePortfolio,
  getPortfoliosByUid,
  toggleLikePortfolio,
};
