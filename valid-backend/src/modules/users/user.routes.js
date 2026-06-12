// src/modules/users/user.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const { getUserProfile, updateUserProfile, getUserActivity, getPublicUserProfile } = require('./user.controller');

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

/**
 * @swagger
 * /api/users/public/{username}:
 *   get:
 *     summary: Ambil profil publik user berdasarkan username slug
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil publik berhasil diambil
 *       404:
 *         description: Pengguna tidak ditemukan
 */
router.get('/public/:username', getPublicUserProfile);

module.exports = router;