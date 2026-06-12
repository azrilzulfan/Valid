// src/modules/users/user.controller.js

const { db, admin } = require('../../config/firebase');

// Ambil profil user secara publik berdasarkan username slug (tanpa auth)
const getPublicUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    // Konversi slug kembali ke bentuk nama (rizky-pratama -> rizky pratama)
    const decodedName = decodeURIComponent(username).replace(/-/g, ' ').toLowerCase();

    // Cari user berdasarkan displayName (case-insensitive)
    const snapshot = await db.collection('users')
      .orderBy('displayName')
      .get();

    let found = null;
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const nameLower = (data.displayName || '').toLowerCase().trim();
      if (nameLower === decodedName) {
        found = data;
        break;
      }
    }

    if (!found) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    // Hanya kembalikan data yang aman untuk publik
    res.json({
      profile: {
        uid: found.uid,
        displayName: found.displayName,
        email: found.email || '',
        vocationField: found.vocationField || '',
        bio: found.bio || '',
        location: found.location || '',
        badgeLevel: found.badgeLevel || null,
        reputationPoints: found.reputationPoints || 0,
        behavioralScore: found.behavioralScore || null,
      }
    });
  } catch (error) {
    next(error);
  }
};

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

module.exports = { getUserProfile, updateUserProfile, getUserActivity, getPublicUserProfile };