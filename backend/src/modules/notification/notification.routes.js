const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead
} = require('./notification.controller');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Manajemen notifikasi in-app untuk pengguna
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Daftar notifikasi user
 *     description: Mengembalikan 20 notifikasi terakhir milik user yang sedang login, diurutkan dari yang terbaru. Juga menyertakan jumlah notifikasi yang belum dibaca.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Notifikasi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       notificationId:
 *                         type: string
 *                       type:
 *                         type: string
 *                         enum: [review_assigned, review_completed, badge_issued, portfolio_approved, portfolio_rejected, interview_reminder]
 *                       title:
 *                         type: string
 *                         example: "Badge GOLD Diterbitkan!"
 *                       message:
 *                         type: string
 *                         example: "Selamat! Kamu mendapatkan badge gold atas pencapaian verifikasimu."
 *                       isRead:
 *                         type: boolean
 *                         example: false
 *                       relatedId:
 *                         type: string
 *                         nullable: true
 *                         description: ID badge, portfolio, atau sesi yang terkait
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 unreadCount:
 *                   type: number
 *                   description: Jumlah notifikasi yang belum dibaca
 *                   example: 3
 *       401:
 *         description: Token tidak valid
 */
router.get('/', verifyToken, getMyNotifications);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Tandai semua notifikasi sudah dibaca
 *     description: Mengubah status isRead menjadi true untuk semua notifikasi yang belum dibaca milik user.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Semua notifikasi berhasil ditandai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Semua notifikasi ditandai sudah dibaca"
 *       401:
 *         description: Token tidak valid
 */
router.put('/read-all', verifyToken, markAllAsRead);

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   put:
 *     summary: Tandai satu notifikasi sudah dibaca
 *     description: Mengubah status isRead menjadi true untuk satu notifikasi tertentu berdasarkan ID.
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID notifikasi yang akan ditandai
 *     responses:
 *       200:
 *         description: Notifikasi berhasil ditandai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notifikasi ditandai sudah dibaca"
 *       401:
 *         description: Token tidak valid
 */
router.put('/:notificationId/read', verifyToken, markAsRead);

module.exports = router;