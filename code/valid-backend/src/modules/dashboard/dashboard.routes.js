// src/modules/dashboard/dashboard.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const { getCandidateDashboard, getReviewerDashboard, getPlatformStats } = require('./dashboard.controller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistik dan ringkasan data untuk kandidat, reviewer, dan publik
 */

/**
 * @swagger
 * /api/dashboard/candidate:
 *   get:
 *     summary: Dashboard lengkap untuk kandidat
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard kandidat berhasil diambil
 */
router.get('/candidate', verifyToken, getCandidateDashboard);

/**
 * @swagger
 * /api/dashboard/reviewer:
 *   get:
 *     summary: Dashboard untuk reviewer
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard reviewer berhasil diambil
 */
router.get('/reviewer', verifyToken, getReviewerDashboard);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Statistik platform secara publik (untuk landing page)
 *     tags: [Dashboard]
 *     security: []
 *     responses:
 *       200:
 *         description: Statistik platform berhasil diambil
 */
router.get('/stats', getPlatformStats);

module.exports = router;