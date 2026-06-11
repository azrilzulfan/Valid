// src/modules/dashboard/dashboard.controller.js

const { db } = require('../../config/firebase');

// Dashboard kandidat
const getCandidateDashboard = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // Ambil semua data secara paralel
    const [userSnap, sessionsSnap, portfoliosSnap, badgesSnap] = await Promise.all([
      db.collection('users').doc(uid).get(),
      db.collection('interviewSessions').where('uid', '==', uid).orderBy('startedAt', 'desc').limit(5).get(),
      db.collection('portfolios').where('uid', '==', uid).orderBy('submittedAt', 'desc').limit(5).get(),
      db.collection('badges').where('uid', '==', uid).where('isRevoked', '==', false).get(),
    ]);

    const userData = userSnap.exists ? userSnap.data() : {};

    const sessions = sessionsSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        sessionId: d.sessionId,
        vocationField: d.vocationField,
        status: d.status,
        overall: d.aiScores?.overall || null,
        startedAt: d.startedAt,
        completedAt: d.completedAt,
      };
    });

    const portfolios = portfoliosSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        portfolioId: d.portfolioId,
        title: d.title,
        vocationField: d.vocationField,
        status: d.status,
        verifiedScore: d.verifiedScore,
        submittedAt: d.submittedAt,
      };
    });

    const badges = badgesSnap.docs.map((doc) => {
      const d = doc.data();
      return {
        badgeId: d.badgeId,
        level: d.level,
        vocationField: d.vocationField,
        combinedScore: d.criteria?.combinedScore,
        issuedAt: d.issuedAt,
      };
    });

    // Hitung statistik ringkas
    const completedSessions = sessions.filter((s) => s.status === 'completed');
    const avgBehavioralScore = completedSessions.length > 0 ? Math.round(completedSessions.reduce((sum, s) => sum + (s.overall || 0), 0) / completedSessions.length) : null;

    const approvedPortfolios = portfolios.filter((p) => p.status === 'approved');
    const avgTechnicalScore = approvedPortfolios.length > 0 ? Math.round(approvedPortfolios.reduce((sum, p) => sum + (p.verifiedScore || 0), 0) / approvedPortfolios.length) : null;

    res.json({
      profile: {
        displayName: userData.displayName,
        vocationField: userData.vocationField,
        reputationPoints: userData.reputationPoints,
        badgeLevel: userData.badgeLevel,
        coins: userData.coins || 0,
      },
      summary: {
        totalInterviews: sessions.length,
        completedInterviews: completedSessions.length,
        avgBehavioralScore,
        totalPortfolios: portfolios.length,
        approvedPortfolios: approvedPortfolios.length,
        avgTechnicalScore,
        totalBadges: badges.length,
      },
      recentInterviews: sessions,
      recentPortfolios: portfolios,
      badges,
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard reviewer
const getReviewerDashboard = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // Cari portofolio yang sudah mengandung review dari user ini
    const reviewedSnap = await db.collection('portfolios').where('peerReviews', 'array-contains', { reviewerId: uid }).get();

    // Fallback: query manual karena Firestore tidak support nested array query dengan baik
    const allPortfoliosSnap = await db.collection('portfolios').orderBy('submittedAt', 'desc').limit(100).get();

    const myReviews = [];
    allPortfoliosSnap.docs.forEach((doc) => {
      const p = doc.data();
      const myReview = p.peerReviews?.find((r) => r.reviewerId === uid);
      if (myReview) {
        myReviews.push({
          portfolioId: p.portfolioId,
          title: p.title,
          vocationField: p.vocationField,
          portfolioStatus: p.status,
          myScore: myReview.scores?.overall,
          reviewedAt: myReview.reviewedAt,
        });
      }
    });

    // Hitung pending yang bisa direview (bukan milik sendiri dan belum direview)
    const pendingSnap = await db.collection('portfolios').where('status', '==', 'pending').get();

    const pendingCount = pendingSnap.docs.filter((doc) => {
      const p = doc.data();
      return p.uid !== uid && !p.peerReviews?.some((r) => r.reviewerId === uid);
    }).length;

    const userSnap = await db.collection('users').doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};

    res.json({
      profile: {
        displayName: userData.displayName,
        reputationPoints: userData.reputationPoints,
      },
      summary: {
        totalReviewsGiven: myReviews.length,
        pendingReviewsAvailable: pendingCount,
        reputationPoints: userData.reputationPoints || 0,
      },
      recentReviews: myReviews.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

// Statistik platform (publik, untuk landing page)
const getPlatformStats = async (req, res, next) => {
  try {
    const [usersSnap, sessionsSnap, portfoliosSnap, badgesSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('interviewSessions').where('status', '==', 'completed').count().get(),
      db.collection('portfolios').where('status', '==', 'approved').count().get(),
      db.collection('badges').where('isRevoked', '==', false).count().get(),
    ]);

    res.json({
      stats: {
        totalCandidates: usersSnap.data().count,
        completedInterviews: sessionsSnap.data().count,
        approvedPortfolios: portfoliosSnap.data().count,
        badgesIssued: badgesSnap.data().count,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCandidateDashboard, getReviewerDashboard, getPlatformStats };
