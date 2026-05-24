const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  issueBadge,
  getMyBadges,
  getBadgeById,
  verifyBadgePublic
} = require('./badge.controller');

/**
 * @swagger
 * tags:
 *   name: Badge
 *   description: Penerbitan dan verifikasi digital credential
 */

/**
 * @swagger
 * /api/badge/issue:
 *   post:
 *     summary: Terbitkan badge berdasarkan skor kombinasi
 *     description: Menerbitkan digital badge secara otomatis berdasarkan kombinasi skor behavioral (dari sesi interview) dan skor teknis (dari peer review portofolio). Level badge ditentukan oleh logika — Gold jika keduanya >= 75, Silver jika teknis >= 60, Bronze jika behavioral >= 60.
 *     tags: [Badge]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, portfolioId]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID sesi wawancara yang sudah selesai (status completed)
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               portfolioId:
 *                 type: string
 *                 description: ID portofolio yang sudah disetujui (status approved)
 *                 example: "660f9511-f30c-52e5-b827-557766551111"
 *     responses:
 *       201:
 *         description: Badge berhasil diterbitkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Badge GOLD berhasil diterbitkan"
 *                 badgeId:
 *                   type: string
 *                 level:
 *                   type: string
 *                   enum: [bronze, silver, gold]
 *                 verificationCode:
 *                   type: string
 *                   description: Kode 16 karakter untuk verifikasi publik
 *                   example: "A1B2C3D4E5F6G7H8"
 *                 combinedScore:
 *                   type: number
 *                   example: 82.5
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Skor belum memenuhi syarat minimum
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Sesi atau portofolio tidak ditemukan
 *       409:
 *         description: Badge untuk bidang vokasi ini sudah diterbitkan
 */
router.post('/issue', verifyToken, issueBadge);

/**
 * @swagger
 * /api/badge/my:
 *   get:
 *     summary: Semua badge aktif milik user
 *     description: Mengembalikan semua badge yang dimiliki user yang belum dicabut (isRevoked = false), diurutkan dari yang terbaru.
 *     tags: [Badge]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar badge berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 badges:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       badgeId:
 *                         type: string
 *                       level:
 *                         type: string
 *                         enum: [bronze, silver, gold]
 *                       vocationField:
 *                         type: string
 *                       criteria:
 *                         type: object
 *                         properties:
 *                           behavioralScore:
 *                             type: number
 *                           technicalScore:
 *                             type: number
 *                           combinedScore:
 *                             type: number
 *                       verificationCode:
 *                         type: string
 *                       issuedAt:
 *                         type: string
 *                         format: date-time
 *                       expiresAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token tidak valid
 */
router.get('/my', verifyToken, getMyBadges);

/**
 * @swagger
 * /api/badge/detail/{badgeId}:
 *   get:
 *     summary: Detail badge tertentu milik user
 *     description: Mengembalikan detail lengkap satu badge berdasarkan ID. Hanya bisa diakses oleh pemilik badge.
 *     tags: [Badge]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID badge
 *     responses:
 *       200:
 *         description: Detail badge berhasil diambil
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Badge tidak ditemukan
 */
router.get('/detail/:badgeId', verifyToken, getBadgeById);

/**
 * @swagger
 * /api/badge/verify/{verificationCode}:
 *   get:
 *     summary: Verifikasi keaslian badge secara publik
 *     description: Endpoint publik tanpa autentikasi. Digunakan oleh rekruter atau pihak ketiga untuk memverifikasi keaslian badge kandidat menggunakan kode verifikasi 16 karakter. Mengembalikan informasi badge beserta nama pemegang jika valid.
 *     tags: [Badge]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: verificationCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Kode verifikasi 16 karakter dari badge
 *         example: "A1B2C3D4E5F6G7H8"
 *     responses:
 *       200:
 *         description: Badge valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 badge:
 *                   type: object
 *                   properties:
 *                     level:
 *                       type: string
 *                       example: "gold"
 *                     vocationField:
 *                       type: string
 *                       example: "teknologi_informasi"
 *                     combinedScore:
 *                       type: number
 *                       example: 82.5
 *                     issuedAt:
 *                       type: string
 *                       format: date-time
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                     holderName:
 *                       type: string
 *                       example: "Budi Santoso"
 *       404:
 *         description: Kode verifikasi tidak valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *       410:
 *         description: Badge dicabut atau sudah kadaluarsa
 */
router.get('/verify/:verificationCode', verifyBadgePublic);

module.exports = router;