const { db } = require('../../config/firebase');
const UserActivity = require('./user.model');

const getUserProfile = async (req, res, next) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: 'Profil tidak ditemukan' });
    }

    res.json({ profile: userSnap.data() });
  } catch (error) {
    next(error);
  }
};

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

    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update(updates);

    res.json({ message: 'Profil berhasil diupdate', updates });
  } catch (error) {
    next(error);
  }
};

const getUserActivity = async (req, res, next) => {
  try {
    const activities = await UserActivity
      .find({ uid: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ activities });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateUserProfile, getUserActivity };