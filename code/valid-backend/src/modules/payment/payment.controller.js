// src/modules/payment/payment.controller.js

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db } = require('../../config/firebase');
const { snap } = require('../../config/midtrans');
const { createNotification } = require('../notification/notification.service');

// 1. Buat transaksi pembayaran
const createPayment = async (req, res, next) => {
  try {
    const { verifierUid, portfolioId } = req.body;

    if (!verifierUid || !portfolioId) {
      return res.status(400).json({ error: 'verifierUid dan portfolioId wajib diisi' });
    }

    // Validasi verifikator sudah approved
    const verifierSnap = await db.collection('verifierProfiles').doc(verifierUid).get();
    if (!verifierSnap.exists || verifierSnap.data().status !== 'approved') {
      return res.status(404).json({ error: 'Verifikator tidak ditemukan atau belum disetujui' });
    }

    // Validasi portofolio milik user
    const portfolioSnap = await db.collection('portfolios').doc(portfolioId).get();
    if (!portfolioSnap.exists || portfolioSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    // Cek apakah sudah ada pembayaran aktif untuk portofolio ini
    const existingSnap = await db.collection('payments')
      .where('candidateUid', '==', req.user.uid)
      .where('portfolioId', '==', portfolioId)
      .where('status', 'in', ['pending', 'paid'])
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      const existing = existingSnap.docs[0].data();
      return res.status(409).json({
        error:   'Sudah ada pembayaran aktif untuk portofolio ini',
        orderId: existing.orderId,
        status:  existing.status
      });
    }

    const verifier = verifierSnap.data();

    // Ambil data user untuk Midtrans
    const userSnap = await db.collection('users').doc(req.user.uid).get();
    const userData = userSnap.data();

    const orderId = `VALID-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

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

    // Simpan ke Firestore
    await db.collection('payments').doc(orderId).set({
      orderId,
      candidateUid:         req.user.uid,
      verifierUid,
      portfolioId,
      amount:               verifier.reviewFee,
      snapToken:            snapResponse.token,
      status:               'pending',
      midtransTransactionId: null,
      midtransStatus:       null,
      paidAt:               null,
      createdAt:            new Date().toISOString(),
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
    const paymentSnap = await db.collection('payments').doc(req.params.orderId).get();

    if (!paymentSnap.exists || paymentSnap.data().candidateUid !== req.user.uid) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    res.json({ payment: paymentSnap.data() });
  } catch (error) {
    next(error);
  }
};

// 3. Riwayat pembayaran user
const getMyPayments = async (req, res, next) => {
  try {
    const snapshot = await db.collection('payments')
      .where('candidateUid', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const payments = snapshot.docs.map(doc => doc.data());

    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

// 4. Webhook Midtrans — dipanggil otomatis oleh server Midtrans
const handleMidtransWebhook = async (req, res, next) => {
  try {
    const notification = req.body;
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      transaction_id
    } = notification;

    // Verifikasi signature key dari Midtrans
    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (signature_key !== expectedSignature) {
      return res.status(403).json({ error: 'Signature tidak valid' });
    }

    const paymentRef = db.collection('payments').doc(order_id);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    const payment = paymentSnap.data();

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

    const updates = {
      status:                newStatus,
      midtransTransactionId: transaction_id,
      midtransStatus:        transaction_status,
    };
    if (newStatus === 'paid') {
      updates.paidAt = new Date().toISOString();
    }

    await paymentRef.update(updates);

    // Jika pembayaran berhasil, tugaskan verifikator ke portofolio
    if (newStatus === 'paid') {
      await db.collection('portfolios').doc(payment.portfolioId).update({
        status:           'under_review',
        assignedVerifier: payment.verifierUid,
        assignedAt:       new Date().toISOString()
      });

      await createNotification(payment.verifierUid, 'review_assigned', payment.portfolioId, '');
      await createNotification(payment.candidateUid, 'payment_confirmed', payment.portfolioId, '');
    }

    // Selalu kembalikan 200 ke Midtrans agar tidak retry
    res.status(200).json({ message: 'Webhook diterima' });
  } catch (error) {
    console.error('[Webhook Error]', error.message);
    res.status(200).json({ message: 'Webhook diterima dengan error internal' });
  }
};

module.exports = { createPayment, getPaymentStatus, getMyPayments, handleMidtransWebhook };