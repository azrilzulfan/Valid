// src/modules/notification/notification.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const { getMyNotifications, markAsRead, markAllAsRead } = require('./notification.controller');

/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: Manajemen notifikasi pengguna
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Ambil semua notifikasi milik user
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar notifikasi berhasil diambil
 */
router.get('/', verifyToken, getMyNotifications);

/**
 * @swagger
 * /api/notifications/{notifId}/read:
 *   put:
 *     summary: Tandai satu notifikasi sebagai sudah dibaca
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notifId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notifikasi ditandai dibaca
 *       404:
 *         description: Notifikasi tidak ditemukan
 */
router.put('/:notifId/read', verifyToken, markAsRead);

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Tandai semua notifikasi sebagai sudah dibaca
 *     tags: [Notification]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Semua notifikasi ditandai dibaca
 */
router.put('/read-all', verifyToken, markAllAsRead);

module.exports = router;