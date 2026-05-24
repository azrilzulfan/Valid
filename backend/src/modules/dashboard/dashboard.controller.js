const { db } = require('../../config/firebase');
const InterviewSession = require('../interview/interview.model');
const Portfolio = require('../portfolio/portfolio.model');
const Badge = require('../badge/badge.model');

// Dashboard kandidat
const getCandidateDashboard = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // Ambil semua data secara paralel
    const [sessions, portfolios, badges, userSnap] = await Promise.all([
      InterviewSession.find({ uid })
        .select('sessionId vocationField status aiScores.overall startedAt completedAt')
        .sort({ startedAt: -1 })
        .limit(5),
      Portfolio.find({ uid })
        .select('portfolioId title vocationField status averageScore submittedAt')
        .sort({ submittedAt: -1 })
        .limit(5),
      Badge.find({ uid, isRevoked: false })
        .select('badgeId level vocationField criteria.combinedScore issuedAt'),
      db.collection('users').doc(uid).get()
    ]);

    const userData = userSnap.exists ? userSnap.data() : {};

    // Hitung statistik ringkas
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const avgBehavioralScore = completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce((sum, s) => sum + (s.aiScores?.overall || 0), 0) /
          completedSessions.length
        )
      : null;

    const approvedPortfolios = portfolios.filter(p => p.status === 'approved');
    const avgTechnicalScore = approvedPortfolios.length > 0
      ? Math.round(
          approvedPortfolios.reduce((sum, p) => sum + (p.averageScore || 0), 0) /
          approvedPortfolios.length
        )
      : null;

    res.json({
      profile: {
        displayName: userData.displayName,
        vocationField: userData.vocationField,
        reputationPoints: userData.reputationPoints,
        badgeLevel: userData.badgeLevel
      },
      summary: {
        totalInterviews: sessions.length,
        completedInterviews: completedSessions.length,
        avgBehavioralScore,
        totalPortfolios: portfolios.length,
        approvedPortfolios: approvedPortfolios.length,
        avgTechnicalScore,
        totalBadges: badges.length
      },
      recentInterviews: sessions,
      recentPortfolios: portfolios,
      badges
    });
  } catch (error) {
    next(error);
  }
};

// Dashboard reviewer
const getReviewerDashboard = async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // Cari portofolio yang pernah direview oleh user ini
    const reviewedPortfolios = await Portfolio.find({
      'peerReviews.reviewerId': uid
    }).select('portfolioId title vocationField status averageScore peerReviews');

    const myReviews = reviewedPortfolios.map(p => {
      const myReview = p.peerReviews.find(r => r.reviewerId === uid);
      return {
        portfolioId: p.portfolioId,
        title: p.title,
        vocationField: p.vocationField,
        portfolioStatus: p.status,
        myScore: myReview?.scores?.overall,
        reviewedAt: myReview?.reviewedAt
      };
    });

    // Portofolio pending yang belum direview user ini
    const pendingCount = await Portfolio.countDocuments({
      status: 'pending',
      uid: { $ne: uid },
      'peerReviews.reviewerId': { $ne: uid }
    });

    const userSnap = await db.collection('users').doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};

    res.json({
      profile: {
        displayName: userData.displayName,
        reputationPoints: userData.reputationPoints
      },
      summary: {
        totalReviewsGiven: myReviews.length,
        pendingReviewsAvailable: pendingCount,
        reputationPoints: userData.reputationPoints || 0
      },
      recentReviews: myReviews.slice(0, 10)
    });
  } catch (error) {
    next(error);
  }
};

// Statistik platform (publik)
const getPlatformStats = async (req, res, next) => {
  try {
    const [totalUsers, totalSessions, totalPortfolios, totalBadges] = await Promise.all([
      db.collection('users').count().get(),
      InterviewSession.countDocuments({ status: 'completed' }),
      Portfolio.countDocuments({ status: 'approved' }),
      Badge.countDocuments({ isRevoked: false })
    ]);

    res.json({
      stats: {
        totalCandidates: totalUsers.data().count,
        completedInterviews: totalSessions,
        approvedPortfolios: totalPortfolios,
        badgesIssued: totalBadges
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCandidateDashboard, getReviewerDashboard, getPlatformStats };