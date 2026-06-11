// src/modules/payment/payment.controller.js

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { db } = require('../../config/firebase');
const { snap } = require('../../config/midtrans');
const { createNotification } = require('../notification/notification.service');

// 1. Buat transaksi pembayaran (Bisa untuk TOPUP KOIN via Midtrans, atau langsung POTONG KOIN internal)
const createPayment = async (req, res, next) => {
  try {
    const { type, verifierUid, portfolioId, amount, koinAmount } = req.body;

    // =========================================================================
    // JALUR 1: TOP UP KOIN (Dipanggil dari Coins.tsx)
    // =========================================================================
    if (type === 'topup') {
      const targetAmount = amount || req.body.grossAmount;
      const targetCoins = koinAmount || req.body.coins;

      if (!targetAmount || !targetCoins) {
        return res.status(400).json({ error: 'amount (Rp) dan koinAmount wajib diisi untuk top up' });
      }

      // Ambil data user pembeli untuk profil Midtrans
      const userSnap = await db.collection('users').doc(req.user.uid).get();
      const userData = userSnap.data() || {};

      const orderId = `TOPUP-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

      const midtransParameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: Number(targetAmount),
        },
        item_details: [
          {
            id: `coins-${targetCoins}`,
            price: Number(targetAmount),
            quantity: 1,
            name: `Top Up ${targetCoins} Koin Valid Platform`,
          },
        ],
        customer_details: {
          first_name: userData.displayName || 'Kandidat',
          email: userData.email || req.user.email,
        },
        callbacks: {
          finish: `${process.env.FRONTEND_URL}/coins`,
        },
      };

      const snapResponse = await snap.createTransaction(midtransParameter);

      // Simpan catatan transaksi pending ke database
      await db
        .collection('payments')
        .doc(orderId)
        .set({
          orderId,
          type: 'topup',
          candidateUid: req.user.uid,
          amount: Number(targetAmount),
          koinAmount: Number(targetCoins),
          snapToken: snapResponse.token,
          status: 'pending',
          midtransTransactionId: null,
          midtransStatus: null,
          paidAt: null,
          createdAt: new Date().toISOString(),
        });

      return res.status(201).json({
        message: 'Transaksi top up berhasil dibuat',
        orderId,
        snapToken: snapResponse.token,
        amount: Number(targetAmount),
      });
    }

    // =========================================================================
    // JALUR 2: POTONG KOIN INTERNAL (Dipanggil dari Professionals.tsx)
    // =========================================================================
    // Jika bukan topup, berarti user ingin memesan review menggunakan Koin internal mereka
    if (!verifierUid || !portfolioId) {
      return res.status(400).json({ error: 'verifierUid dan portfolioId wajib diisi' });
    }

    // Validasi verifikator sudah approved
    const verifierSnap = await db.collection('verifierProfiles').doc(verifierUid).get();
    if (!verifierSnap.exists || verifierSnap.data().status !== 'approved') {
      return res.status(404).json({ error: 'Verifikator tidak ditemukan atau belum disetujui' });
    }
    const verifier = verifierSnap.data();
    const costInCoins = verifier.reviewFee; // Misal tarif review adalah 45 koin

    // Validasi portofolio milik kandidat yang bersangkutan
    const portfolioSnap = await db.collection('portfolios').doc(portfolioId).get();
    if (!portfolioSnap.exists || portfolioSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Portofolio tidak ditemukan' });
    }

    // Ambil data user untuk cek kecukupan saldo koin internal
    const userRef = db.collection('users').doc(req.user.uid);
    const userSnap = await userRef.get();
    const userData = userSnap.data() || {};
    const currentCoins = userData.coins || 0;

    if (currentCoins < costInCoins) {
      return res.status(400).json({ error: `Saldo koin tidak mencukupi. Dibutuhkan ${costInCoins} koin, saldo kamu ${currentCoins} koin.` });
    }

    // Cek apakah sudah ada request review aktif untuk portofolio ini
    const existingSnap = await db.collection('payments').where('candidateUid', '==', req.user.uid).where('portfolioId', '==', portfolioId).where('status', '==', 'paid').limit(1).get();

    if (!existingSnap.empty) {
      return res.status(409).json({ error: 'Portofolio ini sudah dalam antrean review aktif.' });
    }

    const orderId = `REV-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Jalankan operasi pemotongan koin internal secara atomik (Transaction/Batch)
    const batch = db.batch();

    // 1. Potong koin user kandidat
    batch.update(userRef, {
      coins: currentCoins - costInCoins,
    });

    // 2. Buat record transaksi di koleksi payments dengan status langsung 'paid'
    batch.set(db.collection('payments').doc(orderId), {
      orderId,
      type: 'review_fee',
      candidateUid: req.user.uid,
      verifierUid,
      portfolioId,
      koinAmount: costInCoins,
      amount: 0, // Tidak melibatkan uang rupiah langsung
      status: 'paid',
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    // 3. Ubah status portofolio menjadi dalam peninjauan
    batch.update(db.collection('portfolios').doc(portfolioId), {
      status: 'under_review',
      assignedVerifier: verifierUid,
      assignedAt: new Date().toISOString(),
    });

    await batch.commit();

    // Kirim notifikasi real-time
    await createNotification(verifierUid, 'review_assigned', portfolioId, '');
    await createNotification(req.user.uid, 'payment_confirmed', portfolioId, '');

    return res.status(200).json({
      message: 'Pemesanan review berhasil menggunakan koin saldo internal',
      orderId,
      status: 'paid',
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
    const snapshot = await db.collection('payments').where('candidateUid', '==', req.user.uid).orderBy('createdAt', 'desc').limit(20).get();

    const payments = snapshot.docs.map((doc) => doc.data());

    res.json({ payments });
  } catch (error) {
    next(error);
  }
};

// 4. Webhook Midtrans — DIPANGGIL OTOMATIS OLEH SERVER MIDTRANS UNTUK TOP UP
const handleMidtransWebhook = async (req, res, next) => {
  try {
    const notification = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, transaction_id } = notification;

    // Verifikasi keamanan signature key dari Midtrans
    const expectedSignature = crypto.createHash('sha512').update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');

    if (signature_key !== expectedSignature) {
      return res.status(403).json({ error: 'Signature tidak valid' });
    }

    const paymentRef = db.collection('payments').doc(order_id);
    const paymentSnap = await paymentRef.get();

    if (!paymentSnap.exists) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    const payment = paymentSnap.data();

    // Pastikan webhook hanya memproses order jenis topup
    if (payment.type !== 'topup') {
      return res.status(200).json({ message: 'Webhook diabaikan karena bukan tipe topup' });
    }

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

    // Jika status berubah menjadi paid dan sebelumnya belum sukses, tambahkan koin ke user riil
    if (newStatus === 'paid' && payment.status !== 'paid') {
      const userRef = db.collection('users').doc(payment.candidateUid);

      await db.runTransaction(async (transaction) => {
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.data() || {};

        const currentCoins = userData.coins || 0;
        const additionalCoins = payment.koinAmount || 0;

        // Tambah saldo koin user di dokumen users
        transaction.update(userRef, {
          coins: currentCoins + additionalCoins,
        });

        // Update status invoice payment menjadi paid
        transaction.update(paymentRef, {
          status: 'paid',
          midtransTransactionId: transaction_id,
          midtransStatus: transaction_status,
          paidAt: new Date().toISOString(),
        });
      });

      // Picu notifikasi bahwa top up berhasil
      await createNotification(payment.candidateUid, 'topup_success', order_id, `Selamat! Top up sebesar ${payment.koinAmount} koin berhasil dikreditkan.`);
    } else {
      // Jika expired atau failed, cukup update status invoice saja
      await paymentRef.update({
        status: newStatus,
        midtransTransactionId: transaction_id,
        midtransStatus: transaction_status,
      });
    }

    res.status(200).json({ message: 'Webhook top up koin berhasil diproses' });
  } catch (error) {
    console.error('[Webhook Error]', error.message);
    res.status(200).json({ message: 'Webhook diterima dengan error internal' });
  }
};

module.exports = { createPayment, getPaymentStatus, getMyPayments, handleMidtransWebhook };
