const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true
  },
  uid: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      'review_assigned',
      'review_completed',
      'badge_issued',
      'portfolio_approved',
      'portfolio_rejected',
      'interview_reminder'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedId: { type: String, default: null }, // portfolioId / sessionId / badgeId
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;