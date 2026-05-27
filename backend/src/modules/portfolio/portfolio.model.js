const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  portfolioId: {
    type: String, required: true, unique: true, index: true
  },
  uid: {
    type: String, required: true, index: true
  },
  title:       { type: String, required: true },
  description: { type: String, required: true },
  vocationField: { type: String, required: true },
  fileUrls: [{
    fileName: String, fileUrl: String,
    fileType: String, publicId: String, uploadedAt: Date
  }],
  repositoryUrl: { type: String, default: '' },

  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected'],
    default: 'draft'
  },

  assignedVerifier: { type: String, default: null },
  assignedAt:       { type: Date, default: null },
  verifierReview: {
    reviewerId: String,
    scores: {
      technicalAccuracy:    { type: Number, min: 0, max: 100 },
      processDocumentation: { type: Number, min: 0, max: 100 },
      originality:          { type: Number, min: 0, max: 100 },
      overall:              { type: Number, min: 0, max: 100 }
    },
    feedback:   String,
    reviewedAt: Date
  },

  // Komentar sesama user (sosial, TIDAK pengaruhi badge)
  userComments: [{
    commentId:  String,
    uid:        String,
    displayName: String,
    comment:    String,
    createdAt:  Date
  }],

  verifiedScore: { type: Number, default: null }, // skor resmi dari verifikator
  checksumHash:  { type: String },
  submittedAt:   { type: Date, default: Date.now }
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);
module.exports = Portfolio;