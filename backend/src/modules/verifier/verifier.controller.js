const { db } = require('../../config/firebase');
const VerifierProfile = require('./verifier.model');
const { createNotification } = require('../notification/notification.service');

// Middleware helper cek role admin
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
    const existing = await VerifierProfile.findOne({ uid: req.user.uid });
    if (existing) {
      return res.status(409).json({
        error: 'Kamu sudah pernah mendaftar sebagai verifikator',
        status: existing.status
      });
    }

    await VerifierProfile.create({
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
      status:          'pending'
    });

    // Update role di Firestore jadi pending verifier
    await db.collection('users').doc(req.user.uid).update({
      verifierStatus: 'pending',
      updatedAt:      new Date().toISOString()
    });

    res.status(201).json({
      message: 'Pendaftaran verifikator berhasil dikirim. Menunggu persetujuan admin.'
    });
  } catch (error) {
    next(error);
  }
};

// 2. Profil verifikator tertentu
const getVerifierProfile = async (req, res, next) => {
  try {
    const profile = await VerifierProfile.findOne({
      uid:    req.params.uid,
      status: 'approved'
    }).select('-adminNote');

    if (!profile) {
      return res.status(404).json({ error: 'Verifikator tidak ditemukan' });
    }

    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

// 3. Daftar verifikator approved (bisa difilter bidang)
const listApprovedVerifiers = async (req, res, next) => {
  try {
    const { vocationField } = req.query;

    const filter = { status: 'approved' };
    if (vocationField) {
      filter.vocationFields = { $in: [vocationField] };
    }

    const verifiers = await VerifierProfile
      .find(filter)
      .select('uid fullName vocationFields currentJob institution experienceYears reviewFee totalReviews averageRating')
      .sort({ averageRating: -1 });

    res.json({ verifiers });
  } catch (error) {
    next(error);
  }
};

// 4. Daftar pendaftaran pending (admin only)
const getPendingApplications = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);

    const applications = await VerifierProfile
      .find({ status: 'pending' })
      .sort({ submittedAt: 1 });

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

    await VerifierProfile.updateOne(
      { uid },
      { status: 'approved', approvedAt: new Date() }
    );

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

    await VerifierProfile.updateOne(
      { uid },
      { status: 'rejected', adminNote: reason || '' }
    );

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