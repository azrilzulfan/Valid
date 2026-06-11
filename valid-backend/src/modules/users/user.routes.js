// src/modules/users/user.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const { getUserProfile, updateUserProfile, getUserActivity, getAdminUserList, suspendUser, unsuspendUser, getAdminUserDetail } = require('./user.controller');

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
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
 *       404:
 *         description: Profil tidak ditemukan
 */
router.get('/profile', verifyToken, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profil user
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
 *               vocationField:
 *                 type: string
 *               bio:
 *                 type: string
 *               location:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
 *       400:
 *         description: Tidak ada field valid yang dikirim
 */
router.put('/profile', verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/users/activity:
 *   get:
 *     summary: Riwayat aktivitas user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat aktivitas berhasil diambil
 */
router.get('/activity', verifyToken, getUserActivity);

// Admin Routes
router.get('/admin/list', verifyToken, getAdminUserList);
router.get('/admin/detail/:uid', verifyToken, getAdminUserDetail);
router.put('/admin/suspend/:uid', verifyToken, suspendUser);
router.put('/admin/unsuspend/:uid', verifyToken, unsuspendUser);

module.exports = router;