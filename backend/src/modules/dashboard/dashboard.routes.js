const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  getCandidateDashboard,
  getReviewerDashboard,
  getPlatformStats
} = require('./dashboard.controller');

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
 *     description: Mengembalikan ringkasan profil, statistik wawancara, statistik portofolio, dan daftar badge. Semua data diambil secara paralel untuk efisiensi.
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard kandidat berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     displayName:
 *                       type: string
 *                     vocationField:
 *                       type: string
 *                     reputationPoints:
 *                       type: number
 *                     badgeLevel:
 *                       type: string
 *                       nullable: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalInterviews:
 *                       type: number
 *                     completedInterviews:
 *                       type: number
 *                     avgBehavioralScore:
 *                       type: number
 *                       nullable: true
 *                     totalPortfolios:
 *                       type: number
 *                     approvedPortfolios:
 *                       type: number
 *                     avgTechnicalScore:
 *                       type: number
 *                       nullable: true
 *                     totalBadges:
 *                       type: number
 *                 recentInterviews:
 *                   type: array
 *                 recentPortfolios:
 *                   type: array
 *                 badges:
 *                   type: array
 *       401:
 *         description: Token tidak valid
 */
router.get('/candidate', verifyToken, getCandidateDashboard);

/**
 * @swagger
 * /api/dashboard/reviewer:
 *   get:
 *     summary: Dashboard untuk reviewer
 *     description: Mengembalikan statistik review yang telah diberikan, jumlah portofolio pending yang tersedia, dan poin reputasi reviewer.
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard reviewer berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     displayName:
 *                       type: string
 *                     reputationPoints:
 *                       type: number
 *                 summary:
 *                   type: object
 *                   properties:
 *                     totalReviewsGiven:
 *                       type: number
 *                     pendingReviewsAvailable:
 *                       type: number
 *                     reputationPoints:
 *                       type: number
 *                 recentReviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       portfolioId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       vocationField:
 *                         type: string
 *                       myScore:
 *                         type: number
 *                       reviewedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token tidak valid
 */
router.get('/reviewer', verifyToken, getReviewerDashboard);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Statistik platform secara publik
 *     description: Mengembalikan angka agregat platform yang dapat ditampilkan di halaman publik seperti landing page. Tidak memerlukan autentikasi.
 *     tags: [Dashboard]
 *     security: []
 *     responses:
 *       200:
 *         description: Statistik platform berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalCandidates:
 *                       type: number
 *                       example: 142
 *                     completedInterviews:
 *                       type: number
 *                       example: 89
 *                     approvedPortfolios:
 *                       type: number
 *                       example: 67
 *                     badgesIssued:
 *                       type: number
 *                       example: 45
 */
router.get('/stats', getPlatformStats);

module.exports = router;