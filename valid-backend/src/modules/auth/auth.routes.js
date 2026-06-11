// src/modules/auth/auth.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const { registerUser, loginUser, getMe, logoutUser } = require('./auth.controller');

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
 *               email:
 *                 type: string
 *               displayName:
 *                 type: string
 *               vocationField:
 *                 type: string
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: uid atau email tidak dikirim
 *       409:
 *         description: User sudah terdaftar
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login dan ambil data user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Login berhasil
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Ambil data user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 */
router.get('/me', verifyToken, getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout dan batalkan token Firebase
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post('/logout', verifyToken, logoutUser);

module.exports = router;