const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  sessionId: {
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
  vocationField: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  questions: [{
    questionId: String,
    questionText: String,
    askedAt: Date
  }],
  answers: [{
    questionId: String,
    answerText: String,
    answeredAt: Date,
    durationSeconds: Number
  }],
  faceAnalysisLog: [{
    timestamp: Date,
    dominantExpression: String,
    eyeContactScore: Number,
    headPostureScore: Number
  }],
  voiceAnalysisLog: [{
    timestamp: Date,
    wordsPerMinute: Number,
    pauseDuration: Number,
    volumeVariation: Number
  }],
  aiScores: {
    communication: { type: Number, min: 0, max: 100 },
    relevance: { type: Number, min: 0, max: 100 },
    confidence: { type: Number, min: 0, max: 100 },
    professionalism: { type: Number, min: 0, max: 100 },
    overall: { type: Number, min: 0, max: 100 }
  },
  aiFeedback: {
    type: String,
    default: ''
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
module.exports = InterviewSession;