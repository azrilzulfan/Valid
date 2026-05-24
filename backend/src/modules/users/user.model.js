const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    index: true
  },
  activityType: {
    type: String,
    enum: ['login', 'interview_start', 'interview_complete', 'portfolio_upload', 'review_given', 'badge_earned'],
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);
module.exports = UserActivity;