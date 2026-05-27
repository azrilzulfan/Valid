const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  candidateUid: {
    type: String,
    required: true,
    index: true
  },
  verifierUid: {
    type: String,
    required: true
  },
  portfolioId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'expired', 'refunded'],
    default: 'pending'
  },
  snapToken: {
    type: String,
    default: null
  },
  midtransTransactionId: {
    type: String,
    default: null
  },
  midtransStatus: {
    type: String,
    default: null
  },
  paidAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;