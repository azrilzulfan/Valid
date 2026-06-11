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

module.exports = { getUserProfile, updateUserProfile, getUserActivity };