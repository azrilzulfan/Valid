const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  registerUser,
  loginUser,
  getMe,
  logoutUser
} = require('./auth.controller');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autentikasi dan manajemen sesi pengguna
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     description: Dipanggil setelah Firebase Auth berhasil di frontend. Menyimpan data profil user ke Firestore.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [uid, email]
 *             properties:
 *               uid:
 *                 type: string
 *                 description: UID dari Firebase Auth
 *                 example: "firebase-uid-abc123"
 *               email:
 *                 type: string
 *                 description: Email pengguna
 *                 example: "budi@email.com"
 *               displayName:
 *                 type: string
 *                 description: Nama lengkap pengguna
 *                 example: "Budi Santoso"
 *               vocationField:
 *                 type: string
 *                 description: Bidang vokasi pengguna
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *                 example: "teknologi_informasi"
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil"
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                     email:
 *                       type: string
 *                     displayName:
 *                       type: string
 *                     vocationField:
 *                       type: string
 *                     role:
 *                       type: string
 *                       example: "candidate"
 *                     reputationPoints:
 *                       type: number
 *                       example: 0
 *                     badgeLevel:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: uid atau email tidak dikirim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "uid dan email wajib diisi"
 *       409:
 *         description: User sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User sudah terdaftar"
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dan ambil data user
 *     description: Memverifikasi token Firebase dari header Authorization dan mengembalikan data profil user dari Firestore.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login berhasil"
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                     email:
 *                       type: string
 *                     displayName:
 *                       type: string
 *                     vocationField:
 *                       type: string
 *                     role:
 *                       type: string
 *                     badgeLevel:
 *                       type: string
 *                       nullable: true
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: User tidak ditemukan, perlu registrasi
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Ambil data user yang sedang login
 *     description: Mengembalikan data profil lengkap berdasarkan token Firebase yang dikirim.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                     email:
 *                       type: string
 *                     displayName:
 *                       type: string
 *                     vocationField:
 *                       type: string
 *                     role:
 *                       type: string
 *                     reputationPoints:
 *                       type: number
 *                     badgeLevel:
 *                       type: string
 *                       nullable: true
 *       401:
 *         description: Token tidak valid atau kadaluarsa
 *       404:
 *         description: User tidak ditemukan
 */
router.get('/me', verifyToken, getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout dan batalkan token Firebase
 *     description: Merevoke semua refresh token Firebase milik user yang sedang login.
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout berhasil"
 *       401:
 *         description: Token tidak valid
 */
router.post('/logout', verifyToken, logoutUser);

module.exports = router;