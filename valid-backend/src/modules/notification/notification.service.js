// src/modules/notification/notification.service.js

const { db } = require('../../config/firebase');
const { v4: uuidv4 } = require('uuid');

// Pesan notifikasi berdasarkan tipe
const NOTIFICATION_MESSAGES = {
  badge_issued:       (extra) => `Selamat! Kamu mendapatkan badge ${extra.toUpperCase()}.`,
  review_completed:   ()      => 'Portofolio kamu baru saja menerima peer review baru.',
  portfolio_approved: (extra) => `Portofolio "${extra}" kamu telah disetujui!`,
  payment_confirmed:  ()      => 'Pembayaran kamu dikonfirmasi. Verifikator akan segera menghubungi.',
  review_assigned:    ()      => 'Kamu mendapat penugasan review portofolio baru.',
  verifier_approved:  ()      => 'Pendaftaran verifikator kamu telah disetujui oleh admin.',
  verifier_rejected:  (extra) => `Pendaftaran verifikator kamu ditolak. Alasan: ${extra}`,
};

const createNotification = async (uid, type, referenceId, extra) => {
  try {
    const notifId = uuidv4();
    const message = NOTIFICATION_MESSAGES[type]
      ? NOTIFICATION_MESSAGES[type](extra)
      : 'Kamu memiliki notifikasi baru.';

    await db.collection('notifications').doc(notifId).set({
      notifId,
      uid,
      type,
      message,
      referenceId: referenceId || null,
      isRead:      false,
      createdAt:   new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Notification Error]', error.message);
  }
};

module.exports = { createNotification };