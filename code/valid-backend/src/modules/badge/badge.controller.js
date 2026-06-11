// src/modules/badge/badge.controller.js

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db } = require('../../config/firebase');
const { createNotification } = require('../notification/notification.service');

// Tentukan level badge berdasarkan skor behavioral dan technical
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

// Terbitkan badge berdasarkan sesi interview + portofolio yang sudah selesai
const issueBadge = async (req, res, next) => {
  try {
    const { sessionId, portfolioId } = req.body;

    // Ambil sesi interview dari Firestore
    const sessionSnap = await db.collection('interviewSessions').doc(sessionId).get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid || sessionSnap.data().status !== 'completed') {
      return res.status(404).json({ error: 'Sesi wawancara selesai tidak ditemukan' });
    }

    // Ambil portofolio dari Firestore
    const portfolioSnap = await db.collection('portfolios').doc(portfolioId).get();

    if (!portfolioSnap.exists || portfolioSnap.data().uid !== req.user.uid || portfolioSnap.data().status !== 'approved') {
      return res.status(404).json({ error: 'Portofolio yang sudah disetujui tidak ditemukan' });
    }

    const session = sessionSnap.data();
    const portfolio = portfolioSnap.data();

    const behavioralScore = session.aiScores.overall;
    const technicalScore  = portfolio.verifiedScore;

    const badgeResult = determineBadgeLevel(behavioralScore, technicalScore);

    if (!badgeResult) {
      return res.status(400).json({
        error: 'Skor belum memenuhi syarat untuk mendapatkan badge',
        behavioralScore,
        technicalScore,
        minimumRequired: 'Behavioral >= 60 ATAU Technical >= 60'
      });
    }

    // Cek apakah badge untuk bidang ini sudah ada
    const existingBadgeSnap = await db.collection('badges')
      .where('uid', '==', req.user.uid)
      .where('vocationField', '==', session.vocationField)
      .where('isRevoked', '==', false)
      .limit(1)
      .get();

    if (!existingBadgeSnap.empty) {
      return res.status(409).json({
        error:           'Badge untuk bidang vokasi ini sudah diterbitkan',
        existingBadgeId: existingBadgeSnap.docs[0].data().badgeId
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
    expiresAt.setFullYear(expiresAt.getFullYear() + 2);

    const badgeData = {
      badgeId,
      uid:          req.user.uid,
      level:        badgeResult.level,
      vocationField: session.vocationField,
      criteria: {
        behavioralScore,
        technicalScore,
        combinedScore: badgeResult.combinedScore
      },
      verificationCode,
      isRevoked:    false,
      issuedAt:     new Date().toISOString(),
      expiresAt:    expiresAt.toISOString(),
    };

    await db.collection('badges').doc(badgeId).set(badgeData);

    // Update profil user
    await db.collection('users').doc(req.user.uid).update({
      badgeLevel:    badgeResult.level,
      latestBadgeId: badgeId,
      updatedAt:     new Date().toISOString()
    });

    res.status(201).json({
      message:       `Badge ${badgeResult.level.toUpperCase()} berhasil diterbitkan`,
      badgeId,
      level:         badgeResult.level,
      verificationCode,
      combinedScore: badgeResult.combinedScore,
      expiresAt
    });

    await createNotification(req.user.uid, 'badge_issued', badgeId, badgeResult.level);
  } catch (error) {
    next(error);
  }
};

// Semua badge aktif milik user
const getMyBadges = async (req, res, next) => {
  try {
    const snapshot = await db.collection('badges')
      .where('uid', '==', req.user.uid)
      .where('isRevoked', '==', false)
      .orderBy('issuedAt', 'desc')
      .get();

    const badges = snapshot.docs.map(doc => doc.data());

    res.json({ badges });
  } catch (error) {
    next(error);
  }
};

// Detail badge tertentu (hanya pemilik)
const getBadgeById = async (req, res, next) => {
  try {
    const badgeSnap = await db.collection('badges').doc(req.params.badgeId).get();

    if (!badgeSnap.exists || badgeSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Badge tidak ditemukan' });
    }

    res.json({ badge: badgeSnap.data() });
  } catch (error) {
    next(error);
  }
};

// Verifikasi badge secara publik menggunakan kode verifikasi
const verifyBadgePublic = async (req, res, next) => {
  try {
    const { verificationCode } = req.params;

    const snapshot = await db.collection('badges')
      .where('verificationCode', '==', verificationCode)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ valid: false, error: 'Kode verifikasi tidak valid' });
    }

    const badge = snapshot.docs[0].data();

    if (badge.isRevoked) {
      return res.status(410).json({ valid: false, error: 'Badge ini telah dicabut' });
    }

    if (new Date() > new Date(badge.expiresAt)) {
      return res.status(410).json({ valid: false, error: 'Badge ini sudah kadaluarsa' });
    }

    const userSnap = await db.collection('users').doc(badge.uid).get();
    const holderName = userSnap.exists ? userSnap.data().displayName : 'Tidak diketahui';

    res.json({
      valid: true,
      badge: {
        level:         badge.level,
        vocationField: badge.vocationField,
        combinedScore: badge.criteria.combinedScore,
        issuedAt:      badge.issuedAt,
        expiresAt:     badge.expiresAt,
        holderName,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { issueBadge, getMyBadges, getBadgeById, verifyBadgePublic };