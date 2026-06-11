// src/modules/users/user.controller.js

const { db, admin } = require('../../config/firebase');

// Ambil profil user
const getUserProfile = async (req, res, next) => {
  try {
    const userSnap = await db.collection('users').doc(req.user.uid).get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: 'Profil tidak ditemukan' });
    }
    res.json({ profile: userSnap.data() });
  } catch (error) {
    next(error);
  }
};

// Update profil user
const updateUserProfile = async (req, res, next) => {
  try {
    const allowedFields = ['displayName', 'vocationField', 'bio', 'location', 'phoneNumber'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Tidak ada field yang valid untuk diupdate' });
    }

    updates.updatedAt = new Date().toISOString();

    await db.collection('users').doc(req.user.uid).update(updates);

    res.json({ message: 'Profil berhasil diupdate', updates });
  } catch (error) {
    next(error);
  }
};

// Ambil riwayat aktivitas user dari Firestore
const getUserActivity = async (req, res, next) => {
  try {
    const snapshot = await db.collection('userActivities')
      .where('uid', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const activities = snapshot.docs.map(doc => doc.data());

    res.json({ activities });
  } catch (error) {
    next(error);
  }
};

// Helper cek apakah user adalah admin
const requireAdmin = async (uid) => {
  const userSnap = await db.collection('users').doc(uid).get();
  if (!userSnap.exists || userSnap.data().role !== 'admin') {
    const err = new Error('Akses ditolak. Hanya admin yang dapat melakukan aksi ini.');
    err.statusCode = 403;
    throw err;
  }
};

// Ambil daftar user seluruh platform (admin only)
const getAdminUserList = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => doc.data());
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// Suspend user (admin only)
const suspendUser = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    await db.collection('users').doc(uid).update({ 
      status: 'suspended', 
      updatedAt: new Date().toISOString() 
    });
    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    next(error);
  }
};

// Unsuspend user (admin only)
const unsuspendUser = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);
    const { uid } = req.params;
    await db.collection('users').doc(uid).update({ 
      status: 'active', 
      updatedAt: new Date().toISOString() 
    });
    res.json({ message: 'User unsuspended successfully' });
  } catch (error) {
    next(error);
  }
};

// Ambil statistik dan aktivitas detail pengguna (admin only)
const getAdminUserDetail = async (req, res, next) => {
  try {
    await requireAdmin(req.user.uid);
    const { uid } = req.params;

    const [userSnap, interviewsSnap, portfoliosSnap, activitiesSnap] = await Promise.all([
      db.collection('users').doc(uid).get(),
      db.collection('interviewSessions').where('uid', '==', uid).get(),
      db.collection('portfolios').where('uid', '==', uid).get(),
      db.collection('userActivities')
        .where('uid', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get(),
    ]);

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const userData = userSnap.data();
    const interviewsCount = interviewsSnap.size;
    const portfoliosCount = portfoliosSnap.size;
    
    let reviewsCount = 0;
    if (userData.role === 'verifier') {
      const verifierReviewsSnap = await db.collection('portfolios')
        .where('assignedVerifier', '==', uid)
        .get();
      reviewsCount = verifierReviewsSnap.size;
    } else {
      const allPortfoliosSnap = await db.collection('portfolios').get();
      allPortfoliosSnap.docs.forEach(doc => {
        const p = doc.data();
        if (p.peerReviews?.some(r => r.reviewerId === uid)) {
          reviewsCount++;
        }
      });
    }

    const activities = activitiesSnap.docs.map(doc => doc.data());

    res.json({
      stats: {
        interviews: interviewsCount,
        portfolios: portfoliosCount,
        reviews: reviewsCount,
      },
      activities,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getUserProfile, 
  updateUserProfile, 
  getUserActivity, 
  getAdminUserList, 
  suspendUser, 
  unsuspendUser,
  getAdminUserDetail
};