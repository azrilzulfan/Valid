const mongoose = require('mongoose');

const verifierProfileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true
  },
  vocationFields: {
    type: [String], 
    required: true
  },
  currentJob: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  },
  certifications: [{
    name:       String,
    issuedBy:   String,
    year:       Number
  }],
  linkedinUrl: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String,
    default: ''
  },
  reviewFee: {
    type: Number,
    required: true,
    default: 25000 
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: null
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  }
});

const VerifierProfile = mongoose.model('VerifierProfile', verifierProfileSchema);
module.exports = VerifierProfile;