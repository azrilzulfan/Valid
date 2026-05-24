const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  portfolioId: {
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
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  vocationField: {
    type: String,
    required: true
  },
  fileUrls: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    publicId: String,
    uploadedAt: Date
  }],
  repositoryUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  checksumHash: {
    type: String
  },
  isDuplicate: {
    type: Boolean,
    default: false
  },
  peerReviews: [{
    reviewerId: String,
    scores: {
      technicalAccuracy: { type: Number, min: 0, max: 100 },
      processDocumentation: { type: Number, min: 0, max: 100 },
      originality: { type: Number, min: 0, max: 100 },
      overall: { type: Number, min: 0, max: 100 }
    },
    feedback: String,
    reviewedAt: Date
  }],
  averageScore: {
    type: Number,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;