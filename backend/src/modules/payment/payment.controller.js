const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db } = require('../../config/firebase');
const { snap, coreApi } = require('../../config/midtrans');
const Payment = require('./payment.model');
const VerifierProfile = require('../verifier/verifier.model');
const Portfolio = require('../portfolio/portfolio.model');
const { createNotification } = require('../notification/notification.service');

// 1. Buat transaksi pembayaran
const createPayment = async (req, res, next) => {
  try {
    const { verifierUid, portfolioId } = req.body;

    if (!verifierUid || !portfolioId) {
      return res.status(400).json({ error: 'verifierUid dan portfolioId wajib diisi' });
    }

    // Validasi verifikator
    const verifier = await VerifierProfile.findOne({
      uid:    verifierUid,
      status: 'approved'
    });

    if (!verifier) {
      return res.status(404).json({ error: 'Verifikator tidak ditemukan atau belum disetujui' });
    }

    // Validasi portofolio milik user dan belum ada pembayaran pending
    const portfolio = await Portfolio.findOne({
      portfolioId,
      uid: req.user.uid
    });

    if (!portfolio) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    // Cek apakah sudah ada pembayaran aktif untuk portofolio ini
    const existingPayment = await Payment.findOne({
      candidateUid: req.user.uid,
      portfolioId,
      status:       { $in: ['pending', 'paid'] }
    });

    if (existingPayment) {
      return res.status(409).json({
        error: 'Sudah ada pembayaran aktif untuk portofolio ini',
        orderId: existingPayment.orderId,
        status:  existingPayment.status
      });
    }

    // Ambil data user untuk Midtrans
    const userSnap = await db.collection('users').doc(req.user.uid).get();
    const userData = userSnap.data();

    const orderId = `VRSKL-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Buat transaksi Midtrans Snap
    const midtransParameter = {
      transaction_details: {
        order_id:     orderId,
        gross_amount: verifier.reviewFee
      },
      item_details: [{
        id:       `review-${portfolioId}`,
        price:    verifier.reviewFee,
        quantity: 1,
        name:     `Review Portofolio oleh ${verifier.fullName}`
      }],
      customer_details: {
        first_name: userData.displayName || 'Kandidat',
        email:      userData.email
      },
      callbacks: {
        finish: `${process.env.FRONTEND_URL}/payment/finish`
      }
    };

    const snapResponse = await snap.createTransaction(midtransParameter);

    // Simpan ke MongoDB
    await Payment.create({
      orderId,
      candidateUid: req.user.uid,
      verifierUid,
      portfolioId,
      amount:       verifier.reviewFee,
      snapToken:    snapResponse.token,
      status:       'pending'
    });

    res.status(201).json({
      message:   'Transaksi berhasil dibuat',
      orderId,
      snapToken: snapResponse.token,
      amount:    verifier.reviewFee
    });
  } catch (error) {
    next(error);
  }
};

// 2. Cek status pembayaran
const getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      orderId:      req.params.orderId,
      candidateUid: req.user.uid
    });

    if (!payment) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    res.json({ payment });
  } catch (error) {
    next(error);
  }
};

// 3. Riwayat pembayaran user
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment
      .find({ candidateUid: req.user.uid })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

// 4. Webhook Midtrans — dipanggil otomatis oleh server Midtrans
const handleMidtransWebhook = async (req, res, next) => {
  try {
    const notification = req.body;

    // Verifikasi signature key dari Midtrans
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id
    } = notification;

    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      return res.status(403).json({ error: 'Signature tidak valid' });
    }

    const payment = await Payment.findOne({ orderId: order_id });

    if (!payment) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    // Tentukan status berdasarkan respons Midtrans
    let newStatus = payment.status;

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      if (fraud_status === 'accept' || transaction_status === 'settlement') {
        newStatus = 'paid';
      }
    } else if (['cancel', 'deny', 'failure'].includes(transaction_status)) {
      newStatus = 'failed';
    } else if (transaction_status === 'expire') {
      newStatus = 'expired';
    }

    // Update status payment
    await Payment.updateOne(
      { orderId: order_id },
      {
        status:                 newStatus,
        midtransTransactionId:  transaction_id,
        midtransStatus:         transaction_status,
        ...(newStatus === 'paid' && { paidAt: new Date() })
      }
    );

    // Jika pembayaran berhasil, tugaskan verifikator ke portofolio
    if (newStatus === 'paid') {
      await Portfolio.updateOne(
        { portfolioId: payment.portfolioId },
        {
          status:             'under_review',
          assignedVerifier:   payment.verifierUid,
          assignedAt:         new Date()
        }
      );

      await db.collection('portfolios').doc(payment.portfolioId).update({
        status:           'under_review',
        assignedVerifier: payment.verifierUid
      });

      // Notifikasi ke verifikator
      await createNotification(
        payment.verifierUid,
        'review_assigned',
        payment.portfolioId,
        ''
      );

      // Notifikasi ke kandidat
      await createNotification(
        payment.candidateUid,
        'payment_confirmed',
        payment.portfolioId,
        ''
      );
    }

    // Selalu kembalikan 200 ke Midtrans agar tidak retry
    res.status(200).json({ message: 'Webhook diterima' });
  } catch (error) {
    // Tetap 200 agar Midtrans tidak retry terus
    console.error('[Webhook Error]', error.message);
    res.status(200).json({ message: 'Webhook diterima dengan error internal' });
  }
};

module.exports = { createPayment, getPaymentStatus, getMyPayments, handleMidtransWebhook };