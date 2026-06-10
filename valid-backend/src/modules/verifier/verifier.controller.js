// src/modules/verifier/verifier.controller.js

const { v4: uuidv4 } = require('uuid');
const { db } = require('../../config/firebase');
const { createNotification } = require('../notification/notification.service');

// Helper cek apakah user adalah admin
const requireAdmin = async (uid) => {
  const userSnap = await db.collection('users').doc(uid).get();
  if (!userSnap.exists || userSnap.data().role !== 'admin') {
    const err = new Error('Akses ditolak. Hanya admin yang dapat melakukan aksi ini.');
    err.statusCode = 403;
    throw err;
  }
};

// 1. Daftar sebagai verifikator
const applyAsVerifier = async (req, res, next) => {
  try {
    const {
      fullName, vocationFields, currentJob,
      institution, experienceYears, certifications,
      linkedinUrl, portfolioUrl, reviewFee
    } = req.body;

    if (!fullName || !vocationFields || !currentJob || !institution || !experienceYears || !reviewFee) {
      return res.status(400).json({ error: 'Field wajib tidak lengkap' });
    }

    // Cek apakah sudah pernah daftar
    const existingSnap = await db.collection('verifierProfiles').doc(req.user.uid).get();
    if (existingSnap.exists) {
      return res.status(409).json({
        error:  'Kamu sudah pernah mendaftar sebagai verifikator',
        status: existingSnap.data().status
      });
    }

    const profileData = {
      uid:             req.user.uid,
      fullName,
      vocationFields,
      currentJob,
      institution,
      experienceYears,
      certifications:  certifications || [],
      linkedinUrl:     linkedinUrl || '',
      portfolioUrl:    portfolioUrl || '',
      reviewFee,
      status:          'pending',
      adminNote:       '',
      totalReviews:    0,
      averageRating:   null,
      submittedAt:     new Date().toISOString(),
      approvedAt:      null,
    };

    await db.collection('verifierProfiles').doc(req.user.uid).set(profileData);

    await db.collection('users').doc(req.user.uid).update({
      verifierStatus: 'pending',
      updatedAt:      new Date().toISOString()
    });

    res.status(201).json({ message: 'Pendaftaran verifikator berhasil dikirim. Menunggu persetujuan admin.' });
  } catch (error) {
    next(error);
  }
};

// 2. Profil verifikator tertentu (publik, hanya yang approved)
const getVerifierProfile = async (req, res, next) => {
  try {
    const profileSnap = await db.collection('verifierProfiles').doc(req.params.uid).get();

    if (!profileSnap.exists || profileSnap.data().status !== 'approved') {
      return res.status(404).json({ error: 'Verifikator tidak ditemukan' });
    }

    // Sembunyikan adminNote dari publik
    const profile = profileSnap.data();
    delete profile.adminNote;

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

// 3. Daftar verifikator approved (bisa difilter bidang)
const listApprovedVerifiers = async (req, res, next) => {
  try {
    const { vocationField } = req.query;

    let query = db.collection('verifierProfiles').where('status', '==', 'approved');

    // Catatan: filter array di Firestore menggunakan array-contains
    if (vocationField) {
      query = query.where('vocationFields', 'array-contains', vocationField);
    }

    const snapshot = await query.orderBy('averageRating', 'desc').get();

    const verifiers = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        uid:             d.uid,
        fullName:        d.fullName,
        vocationFields:  d.vocationFields,
        currentJob:      d.currentJob,
        institution:     d.institution,
        experienceYears: d.experienceYears,
        reviewFee:       d.reviewFee,
        totalReviews:    d.totalReviews,
        averageRating:   d.averageRating,
      };
    });

    res.json({ verifiers });
  } catch (error) {
    next(error);
  }
};

// 4. Daftar pendaftaran pending (admin only)
const getPendingApplications = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);

    const snapshot = await db.collection('verifierProfiles')
      .where('status', '==', 'pending')
      .orderBy('submittedAt', 'asc')
      .get();

    const applications = snapshot.docs.map(doc => doc.data());

    res.json({ applications });
  } catch (error) {
    next(error);
  }
};

// 5. Setujui verifikator (admin only)
const approveVerifier = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);

    const { uid } = req.params;

    await db.collection('verifierProfiles').doc(uid).update({
      status:     'approved',
      approvedAt: new Date().toISOString()
    });

    await db.collection('users').doc(uid).update({
      role:           'verifier',
      verifierStatus: 'approved',
      updatedAt:      new Date().toISOString()
    });

    await createNotification(uid, 'verifier_approved', null, '');

    res.json({ message: 'Verifikator berhasil disetujui' });
  } catch (error) {
    next(error);
  }
};

// 6. Tolak verifikator (admin only)
const rejectVerifier = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);

    const { uid } = req.params;
    const { reason } = req.body;

    await db.collection('verifierProfiles').doc(uid).update({
      status:    'rejected',
      adminNote: reason || ''
    });

    await db.collection('users').doc(uid).update({
      verifierStatus: 'rejected',
      updatedAt:      new Date().toISOString()
    });

    await createNotification(uid, 'verifier_rejected', null, reason || '');

    res.json({ message: 'Pendaftaran verifikator ditolak' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyAsVerifier,
  getVerifierProfile,
  listApprovedVerifiers,
  getPendingApplications,
  approveVerifier,
  rejectVerifier
};