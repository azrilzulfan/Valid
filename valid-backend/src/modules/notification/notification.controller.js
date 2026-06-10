// src/modules/notification/notification.controller.js

const { db } = require('../../config/firebase');

// Ambil semua notifikasi milik user
const getMyNotifications = async (req, res, next) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('uid', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const notifications = snapshot.docs.map(doc => doc.data());

    res.json({ notifications });
  } catch (error) {
    next(error);
  }
};

// Tandai satu notifikasi sebagai sudah dibaca
const markAsRead = async (req, res, next) => {
  try {
    const { notifId } = req.params;

    const notifRef = db.collection('notifications').doc(notifId);
    const notifSnap = await notifRef.get();

    if (!notifSnap.exists || notifSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Notifikasi tidak ditemukan' });
    }

    await notifRef.update({ isRead: true });

    res.json({ message: 'Notifikasi ditandai sudah dibaca' });
  } catch (error) {
    next(error);
  }
};

// Tandai semua notifikasi sebagai sudah dibaca
const markAllAsRead = async (req, res, next) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('uid', '==', req.user.uid)
      .where('isRead', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    await batch.commit();

    res.json({ message: `${snapshot.size} notifikasi ditandai sudah dibaca` });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead };