// src/modules/badge/badge.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const { issueBadge, getMyBadges, getBadgeById, verifyBadgePublic } = require('./badge.controller');

/**
 * @swagger
 * tags:
 *   name: Badge
 *   description: Penerbitan dan verifikasi badge kompetensi
 */

/**
 * @swagger
 * /api/badge/issue:
 *   post:
 *     summary: Terbitkan badge berdasarkan skor interview dan portofolio
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
 *               portfolioId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Badge berhasil diterbitkan
 *       400:
 *         description: Skor belum memenuhi syarat
 *       404:
 *         description: Sesi atau portofolio tidak ditemukan
 *       409:
 *         description: Badge sudah ada untuk bidang vokasi ini
 */
router.post('/issue', verifyToken, issueBadge);

/**
 * @swagger
 * /api/badge/my:
 *   get:
 *     summary: Semua badge aktif milik user
 *     tags: [Badge]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar badge berhasil diambil
 */
router.get('/my', verifyToken, getMyBadges);

/**
 * @swagger
 * /api/badge/detail/{badgeId}:
 *   get:
 *     summary: Detail badge tertentu milik user
 *     tags: [Badge]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: badgeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail badge berhasil diambil
 *       404:
 *         description: Badge tidak ditemukan
 */
router.get('/detail/:badgeId', verifyToken, getBadgeById);

/**
 * @swagger
 * /api/badge/verify/{verificationCode}:
 *   get:
 *     summary: Verifikasi keaslian badge secara publik (tanpa login)
 *     tags: [Badge]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: verificationCode
 *         required: true
 *         schema:
 *           type: string
 *         example: "A1B2C3D4E5F6G7H8"
 *     responses:
 *       200:
 *         description: Badge valid
 *       404:
 *         description: Kode verifikasi tidak valid
 *       410:
 *         description: Badge dicabut atau kadaluarsa
 */
router.get('/verify/:verificationCode', verifyBadgePublic);

module.exports = router;