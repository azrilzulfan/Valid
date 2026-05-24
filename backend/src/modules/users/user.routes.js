const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  getUserActivity
} = require('./user.controller');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manajemen profil dan aktivitas pengguna
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Ambil profil user
 *     description: Mengembalikan data profil lengkap user yang sedang login dari Firestore.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
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
 *                     bio:
 *                       type: string
 *                       nullable: true
 *                     location:
 *                       type: string
 *                       nullable: true
 *                     role:
 *                       type: string
 *                       example: "candidate"
 *                     reputationPoints:
 *                       type: number
 *                     badgeLevel:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Profil tidak ditemukan
 */
router.get('/profile', verifyToken, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profil user
 *     description: Mengupdate field profil yang diizinkan. Field yang tidak dikirim tidak akan berubah.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               displayName:
 *                 type: string
 *                 example: "Budi Santoso"
 *               vocationField:
 *                 type: string
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *                 example: "teknologi_informasi"
 *               bio:
 *                 type: string
 *                 example: "Lulusan SMK Teknik Informatika, minat di bidang web development"
 *               location:
 *                 type: string
 *                 example: "Bandung, Jawa Barat"
 *               phoneNumber:
 *                 type: string
 *                 example: "081234567890"
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profil berhasil diupdate"
 *                 updates:
 *                   type: object
 *       400:
 *         description: Tidak ada field valid yang dikirim
 *       401:
 *         description: Token tidak valid
 */
router.put('/profile', verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/users/activity:
 *   get:
 *     summary: Riwayat aktivitas user
 *     description: Mengembalikan 20 aktivitas terakhir user dari MongoDB, diurutkan dari yang terbaru.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat aktivitas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: string
 *                       activityType:
 *                         type: string
 *                         enum: [login, interview_start, interview_complete, portfolio_upload, review_given, badge_earned]
 *                       metadata:
 *                         type: object
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token tidak valid
 */
router.get('/activity', verifyToken, getUserActivity);

module.exports = router;