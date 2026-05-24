const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db } = require('../../config/firebase');
const Badge = require('./badge.model');
const InterviewSession = require('../interview/interview.model');
const Portfolio = require('../portfolio/portfolio.model');
const { createNotification } = require('../notification/notification.service');

// Tentukan level badge berdasarkan skor
const determineBadgeLevel = (behavioralScore, technicalScore) => {
  const combined = (behavioralScore + technicalScore) / 2;

  if (behavioralScore >= 75 && technicalScore >= 75 && combined >= 75) {
    return { level: 'gold', combinedScore: combined };
  } else if (technicalScore >= 60) {
    return { level: 'silver', combinedScore: combined };
  } else if (behavioralScore >= 60) {
    return { level: 'bronze', combinedScore: combined };
  }
  return null;
};

// 1. Terbitkan badge otomatis
const issueBadge = async (req, res, next) => {
  try {
    const { sessionId, portfolioId } = req.body;

    // Ambil skor behavioral dari sesi interview
    const session = await InterviewSession.findOne({
      sessionId,
      uid: req.user.uid,
      status: 'completed'
    });

    if (!session) {
      return res.status(404).json({ error: 'Sesi wawancara selesai tidak ditemukan' });
    }

    // Ambil skor teknis dari portfolio
    const portfolio = await Portfolio.findOne({
      portfolioId,
      uid: req.user.uid,
      status: 'approved'
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portofolio yang sudah disetujui tidak ditemukan' });
    }

    const behavioralScore = session.aiScores.overall;
    const technicalScore = portfolio.averageScore;

    const badgeResult = determineBadgeLevel(behavioralScore, technicalScore);

    if (!badgeResult) {
      return res.status(400).json({
        error: 'Skor belum memenuhi syarat untuk mendapatkan badge',
        behavioralScore,
        technicalScore,
        minimumRequired: 'Behavioral >= 60 ATAU Technical >= 60'
      });
    }

    // Cek apakah badge untuk kombinasi ini sudah ada
    const existingBadge = await Badge.findOne({
      uid: req.user.uid,
      vocationField: session.vocationField,
      isRevoked: false
    });

    if (existingBadge) {
      return res.status(409).json({
        error: 'Badge untuk bidang vokasi ini sudah diterbitkan',
        existingBadgeId: existingBadge.badgeId
      });
    }

    const badgeId = uuidv4();
    const verificationCode = crypto
      .createHash('sha256')
      .update(`${badgeId}-${req.user.uid}-${Date.now()}`)
      .digest('hex')
      .substring(0, 16)
      .toUpperCase();

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 2); // Berlaku 2 tahun

    const badge = await Badge.create({
      badgeId,
      uid: req.user.uid,
      level: badgeResult.level,
      criteria: {
        behavioralScore,
        technicalScore,
        combinedScore: badgeResult.combinedScore
      },
      vocationField: session.vocationField,
      expiresAt,
      verificationCode
    });

    // Simpan ke Firestore untuk akses cepat
    await db.collection('badges').doc(badgeId).set({
      badgeId,
      uid: req.user.uid,
      level: badgeResult.level,
      vocationField: session.vocationField,
      combinedScore: badgeResult.combinedScore,
      verificationCode,
      issuedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    });

    // Update level badge di profil user
    await db.collection('users').doc(req.user.uid).update({
      badgeLevel: badgeResult.level,
      latestBadgeId: badgeId,
      updatedAt: new Date().toISOString()
    });

    res.status(201).json({
      message: `Badge ${badgeResult.level.toUpperCase()} berhasil diterbitkan`,
      badgeId,
      level: badgeResult.level,
      verificationCode,
      combinedScore: badgeResult.combinedScore,
      expiresAt
    });

    await createNotification(
      req.user.uid,
      'badge_issued',
      badgeId,
      badgeResult.level
    );
  } catch (error) {
    next(error);
  }
};

// 2. Semua badge milik user
const getMyBadges = async (req, res, next) => {
  try {
    const badges = await Badge
      .find({ uid: req.user.uid, isRevoked: false })
      .sort({ issuedAt: -1 });

    res.json({ badges });
  } catch (error) {
    next(error);
  }
};

// 3. Detail badge tertentu
const getBadgeById = async (req, res, next) => {
  try {
    const badge = await Badge.findOne({
      badgeId: req.params.badgeId,
      uid: req.user.uid
    });

    if (!badge) {
      return res.status(404).json({ error: 'Badge tidak ditemukan' });
    }

    res.json({ badge });
  } catch (error) {
    next(error);
  }
};

// 4. Verifikasi badge publik via kode (tanpa auth — untuk rekruter)
const verifyBadgePublic = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;

    const badge = await Badge.findOne({ verificationCode });

    if (!badge) {
      return res.status(404).json({ valid: false, error: 'Kode verifikasi tidak valid' });
    }

    if (badge.isRevoked) {
      return res.status(410).json({ valid: false, error: 'Badge ini telah dicabut' });
    }

    if (new Date() > badge.expiresAt) {
      return res.status(410).json({ valid: false, error: 'Badge ini sudah kadaluarsa' });
    }

    // Ambil nama user dari Firestore
    const userSnap = await db.collection('users').doc(badge.uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};

    res.json({
      valid: true,
      badge: {
        level: badge.level,
        vocationField: badge.vocationField,
        combinedScore: badge.criteria.combinedScore,
        issuedAt: badge.issuedAt,
        expiresAt: badge.expiresAt,
        holderName: userData.displayName || 'Tidak diketahui'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { issueBadge, getMyBadges, getBadgeById, verifyBadgePublic };