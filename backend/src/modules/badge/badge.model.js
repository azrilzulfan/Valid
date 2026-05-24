const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  uid: {
    type: String,
    required: true,
    index: true
  },
  level: {
    type: String,
    enum: ['bronze', 'silver', 'gold'],
    required: true
  },
  criteria: {
    behavioralScore: { type: Number },
    technicalScore: { type: Number },
    combinedScore: { type: Number }
  },
  vocationField: {
    type: String,
    required: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true
  }
});

const Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;