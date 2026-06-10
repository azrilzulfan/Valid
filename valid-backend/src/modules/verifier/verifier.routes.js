// src/modules/verifier/verifier.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  applyAsVerifier,
  getVerifierProfile,
  listApprovedVerifiers,
  approveVerifier,
  rejectVerifier,
  getPendingApplications
} = require('./verifier.controller');

/**
 * @swagger
 * tags:
 *   name: Verifier
 *   description: Pendaftaran dan manajemen verifikator ahli industri
 */

/**
 * @swagger
 * /api/verifier/apply:
 *   post:
 *     summary: Daftar sebagai verifikator
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, vocationFields, currentJob, institution, experienceYears, reviewFee]
 *             properties:
 *               fullName:
 *                 type: string
 *               vocationFields:
 *                 type: array
 *                 items:
 *                   type: string
 *               currentJob:
 *                 type: string
 *               institution:
 *                 type: string
 *               experienceYears:
 *                 type: number
 *               certifications:
 *                 type: array
 *               linkedinUrl:
 *                 type: string
 *               reviewFee:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pendaftaran berhasil, menunggu persetujuan admin
 *       400:
 *         description: Field wajib tidak lengkap
 *       409:
 *         description: Sudah pernah mendaftar
 */
router.post('/apply', verifyToken, applyAsVerifier);

/**
 * @swagger
 * /api/verifier/list:
 *   get:
 *     summary: Daftar semua verifikator yang sudah approved
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vocationField
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar verifikator berhasil diambil
 */
router.get('/list', verifyToken, listApprovedVerifiers);

/**
 * @swagger
 * /api/verifier/profile/{uid}:
 *   get:
 *     summary: Profil verifikator tertentu
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil verifikator berhasil diambil
 *       404:
 *         description: Verifikator tidak ditemukan
 */
router.get('/profile/:uid', verifyToken, getVerifierProfile);

/**
 * @swagger
 * /api/verifier/admin/pending:
 *   get:
 *     summary: Daftar pendaftaran verifikator pending (admin only)
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pendaftaran berhasil diambil
 *       403:
 *         description: Bukan admin
 */
router.get('/admin/pending', verifyToken, getPendingApplications);

/**
 * @swagger
 * /api/verifier/admin/approve/{uid}:
 *   put:
 *     summary: Setujui pendaftaran verifikator (admin only)
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verifikator berhasil disetujui
 *       403:
 *         description: Bukan admin
 */
router.put('/admin/approve/:uid', verifyToken, approveVerifier);

/**
 * @swagger
 * /api/verifier/admin/reject/{uid}:
 *   put:
 *     summary: Tolak pendaftaran verifikator (admin only)
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pendaftaran ditolak
 *       403:
 *         description: Bukan admin
 */
router.put('/admin/reject/:uid', verifyToken, rejectVerifier);

module.exports = router;