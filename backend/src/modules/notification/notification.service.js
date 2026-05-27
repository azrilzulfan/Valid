const { v4: uuidv4 } = require('uuid');
const Notification = require('./notification.model');

const NOTIFICATION_TEMPLATES = {
  review_assigned: (portfolioTitle) => ({
    title: 'Portofolio Baru Menunggu Review',
    message: `Portofolio "${portfolioTitle}" telah ditugaskan untuk kamu review.`
  }),
  review_completed: (reviewerName) => ({
    title: 'Portofoliomu Telah Direview',
    message: `${reviewerName} baru saja menyelesaikan review portofoliomu.`
  }),
  badge_issued: (level) => ({
    title: `Badge ${level.toUpperCase()} Diterbitkan!`,
    message: `Selamat! Kamu mendapatkan badge ${level} atas pencapaian verifikasimu.`
  }),
  portfolio_approved: (portfolioTitle) => ({
    title: 'Portofolio Disetujui',
    message: `Portofolio "${portfolioTitle}" telah mendapatkan cukup review dan disetujui.`
  }),
  portfolio_rejected: (portfolioTitle) => ({
    title: 'Portofolio Ditolak',
    message: `Portofolio "${portfolioTitle}" ditolak. Silakan periksa feedback reviewer.`
  }),
  interview_reminder: () => ({
    title: 'Lengkapi Proses Verifikasimu',
    message: 'Kamu belum menyelesaikan sesi wawancara AI. Selesaikan untuk mendapatkan badge.'
  }),
  verifier_approved: () => ({
    title:   'Pendaftaran Verifikator Disetujui!',
    message: 'Selamat! Kamu resmi menjadi verifikator di VeriSkill AI. Mulai terima request review.'
  }),
  verifier_rejected: (reason) => ({
    title:   'Pendaftaran Verifikator Ditolak',
    message: `Pendaftaran verifikatormu ditolak. ${reason ? 'Alasan: ' + reason : 'Hubungi admin untuk info lebih lanjut.'}`
  }),
  payment_confirmed: () => ({
    title:   'Pembayaran Dikonfirmasi',
    message: 'Pembayaran berhasil! Verifikator sudah ditugaskan dan akan segera mereview portofoliomu.'
  }),
};

const createNotification = async (uid, type, relatedId = null, extraParam = '') => {
  try {
    const template = NOTIFICATION_TEMPLATES[type](extraParam);

    await Notification.create({
      notificationId: uuidv4(),
      uid,
      type,
      title: template.title,
      message: template.message,
      relatedId
    });
  } catch (error) {
    console.error(`[Notification Error] ${error.message}`);
  }
};

module.exports = { createNotification };