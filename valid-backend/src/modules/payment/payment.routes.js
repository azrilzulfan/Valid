// src/modules/payment/payment.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  createPayment, getPaymentStatus,
  getMyPayments, handleMidtransWebhook,
  getAdminTransactions
} = require('./payment.controller');

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Pembayaran sesi review verifikator via Midtrans
 */

/**
 * @swagger
 * /api/payment/create:
 *   post:
 *     summary: Buat transaksi pembayaran untuk sesi review verifikator
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
 *               portfolioId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat, kembalikan snapToken
 *       400:
 *         description: Field tidak lengkap
 *       404:
 *         description: Verifikator atau portofolio tidak ditemukan
 *       409:
 *         description: Sudah ada pembayaran aktif
 */
router.post('/create', verifyToken, createPayment);

/**
 * @swagger
 * /api/payment/status/{orderId}:
 *   get:
 *     summary: Cek status pembayaran
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status pembayaran berhasil diambil
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get('/status/:orderId', verifyToken, getPaymentStatus);

/**
 * @swagger
 * /api/payment/my:
 *   get:
 *     summary: Riwayat pembayaran user
 *     tags: [Payment]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat pembayaran berhasil diambil
 */
router.get('/my', verifyToken, getMyPayments);

/**
 * @swagger
 * /api/payment/webhook:
 *   post:
 *     summary: Webhook Midtrans (otomatis dipanggil Midtrans)
 *     tags: [Payment]
 *     security: []
 *     responses:
 *       200:
 *         description: Webhook diterima
 */
router.post('/webhook', handleMidtransWebhook);

// Admin Routes
router.get('/admin/transactions', verifyToken, getAdminTransactions);

module.exports = router;