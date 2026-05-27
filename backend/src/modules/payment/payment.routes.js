const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  createPayment,
  getPaymentStatus,
  getMyPayments,
  handleMidtransWebhook
} = require('./payment.controller');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Pembayaran sesi review verifikator via Midtrans Sandbox
 */

/**
 * @swagger
 * /api/payment/create:
 *   post:
 *     summary: Buat transaksi pembayaran untuk sesi review verifikator
 *     description: Membuat order pembayaran Midtrans dan mengembalikan snap_token yang digunakan frontend untuk menampilkan popup pembayaran Midtrans Snap.
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verifierUid, portfolioId]
 *             properties:
 *               verifierUid:
 *                 type: string
 *                 description: UID verifikator yang dipilih
 *                 example: "verifier-uid-xyz"
 *               portfolioId:
 *                 type: string
 *                 description: ID portofolio yang ingin direview
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orderId:
 *                   type: string
 *                 snapToken:
 *                   type: string
 *                   description: Token untuk Midtrans Snap popup di frontend
 *                 amount:
 *                   type: number
 *                   example: 25000
 *       400:
 *         description: Field tidak lengkap atau portofolio tidak valid
 *       404:
 *         description: Verifikator tidak ditemukan
 */
router.post('/create', verifyToken, createPayment);

/**
 * @swagger
 * /api/payment/status/{orderId}:
 *   get:
 *     summary: Cek status pembayaran
 *     description: Mengecek status terkini pembayaran berdasarkan orderId.
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/status/:orderId', verifyToken, getPaymentStatus);

/**
 * @swagger
 * /api/payment/my:
 *   get:
 *     summary: Riwayat pembayaran user
 *     description: Mengembalikan semua riwayat transaksi pembayaran milik user yang sedang login.
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 */
router.get('/my', verifyToken, getMyPayments);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Webhook Midtrans
 *     description: Endpoint yang dipanggil otomatis oleh server Midtrans setelah status pembayaran berubah. Tidak perlu dipanggil manual. Setelah pembayaran dikonfirmasi, sistem otomatis menugaskan verifikator ke portofolio.
 *     tags: [Payment]
 *     security: []
 */
router.post('/webhook', handleMidtransWebhook);

module.exports = router;