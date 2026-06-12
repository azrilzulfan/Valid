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

    // 1. Ambil data dasar user dari koleksi 'users' untuk mendapatkan saldo coins riil
    const userSnap = await db.collection('users').doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};

    // 2. Ambil data profil profesional verifikator dari koleksi 'verifierProfiles'
    const verifierProfileSnap = await db.collection('verifierProfiles').doc(uid).get();
    const verifierProfileData = verifierProfileSnap.exists ? verifierProfileSnap.data() : {};

    // 3. Ambil semua portofolio yang ditugaskan kepada verifikator ini
    const assignedPortfoliosSnap = await db.collection('portfolios').where('assignedVerifier', '==', uid).get();

    const assignedPortfolios = assignedPortfoliosSnap.docs.map((doc) => doc.data());

    // 4. Filter portofolio yang ulasannya sudah selesai (status approved)
    const completedReviews = assignedPortfolios.filter((p) => p.status === 'approved');

    // Filter portofolio yang statusnya masih dikerjakan (under_review / menunggu)
    const pendingCount = assignedPortfolios.filter((p) => p.status === 'under_review').length;

    // 5. 📊 ALGORITMA TREN AKTIVITAS 7 HARI TERAKHIR
    // Inisialisasi trend dengan default 0 untuk semua hari
    const weeklyTrend = {
      senin: 0,
      selasa: 0,
      rabu: 0,
      kamis: 0,
      jumat: 0,
      sabtu: 0,
      minggu: 0,
    };

    const dayMappingIndo = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    const now = new Date();

    completedReviews.forEach((p) => {
      // Prioritaskan tanggal review dirilis, jika tidak ada gunakan timestamp update terakhir
      const reviewDateStr = p.verifierReview?.reviewedAt || p.updatedAt;
      if (reviewDateStr) {
        const logDate = new Date(reviewDateStr);

        // Jaring Pengaman: Hitung selisih hari untuk memastikan ulasan berada dalam rentang 7 hari terakhir
        const diffTime = Math.abs(now.getTime() - logDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 7) {
          const dayName = dayMappingIndo[logDate.getDay()];
          weeklyTrend[dayName]++;
        }
      }
    });

    // 6. Map data ulasan terbaru untuk konsumsi widget list di frontend
    const recentReviews = completedReviews
      .sort((a, b) => {
        const dateA = new Date(a.verifierReview?.reviewedAt || 0).getTime();
        const dateB = new Date(b.verifierReview?.reviewedAt || 0).getTime();
        return dateB - dateA; // Urutkan dari yang paling baru (descending)
      })
      .map((p) => ({
        portfolioId: p.portfolioId,
        title: p.title || 'No Title',
        vocationField: p.vocationField || 'General',
        portfolioStatus: p.status,
        score: p.verifiedScore || 0,
        reviewedAt: p.verifierReview?.reviewedAt || '-',
      }))
      .slice(0, 5); // Ambil 5 ulasan teratas saja untuk optimalisasi bandwidth

    // 7. Kirimkan JSON response terstruktur yang match dengan kebutuhan state frontend ProDashboard
    res.json({
      profile: {
        displayName: userData.displayName || verifierProfileData.fullName || 'Reviewer Profesional',
        coins: userData.coins || 0, // Saldo koin riil dari koleksi users
        totalReviews: verifierProfileData.totalReviews || completedReviews.length, // Counter atomik dari verifierProfiles
        verifierStatus: userData.verifierStatus || null,
      },
      summary: {
        totalReviewsGiven: verifierProfileData.totalReviews || completedReviews.length,
        pendingReviewsAvailable: pendingCount,
        coins: userData.coins || 0,
      },
      weeklyTrend: weeklyTrend, // Field tren aktivitas dinamis terpasang sempurna!
      recentReviews: recentReviews,
    });
  } catch (error) {
    console.error('Error pada getReviewerDashboard backend:', error);
    next(error);
  }
};

// Statistik platform (publik, untuk landing page)
const getPlatformStats = async (req, res, next) => {
  try {
    const [usersSnap, sessionsSnap, portfoliosSnap, badgesSnap] = await Promise.all([
      db.collection('users').count().get(),
      db.collection('interviewSessions').where('status', '==', 'completed').count().get(),
      db.collection('portfolios').count().get(),
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
