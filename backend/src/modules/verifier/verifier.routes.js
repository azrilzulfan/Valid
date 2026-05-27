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
 *   description: Pendaftaran dan manajemen verifikator
 */

/**
 * @swagger
 * /api/verifier/apply:
 *   post:
 *     summary: Daftar sebagai verifikator
 *     description: Pengguna biasa mengajukan diri sebagai verifikator dengan melampirkan data profesional. Status awal adalah pending hingga disetujui admin.
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
 *                 example: "Andi Wijaya, S.T."
 *               vocationFields:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["teknologi_informasi", "teknik"]
 *               currentJob:
 *                 type: string
 *                 example: "Senior Software Engineer"
 *               institution:
 *                 type: string
 *                 example: "PT. Teknologi Maju Indonesia"
 *               experienceYears:
 *                 type: number
 *                 example: 5
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     issuedBy:
 *                       type: string
 *                     year:
 *                       type: number
 *               linkedinUrl:
 *                 type: string
 *                 example: "https://linkedin.com/in/andiwijaya"
 *               reviewFee:
 *                 type: number
 *                 description: Harga per sesi review dalam rupiah
 *                 example: 25000
 *     responses:
 *       201:
 *         description: Pendaftaran berhasil, menunggu persetujuan admin
 *       400:
 *         description: Field wajib tidak lengkap
 *       409:
 *         description: Sudah pernah mendaftar sebagai verifikator
 */
router.post('/apply', verifyToken, applyAsVerifier);

/**
 * @swagger
 * /api/verifier/profile/{uid}:
 *   get:
 *     summary: Profil verifikator tertentu
 *     description: Mengembalikan profil publik verifikator yang sudah approved.
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/profile/:uid', verifyToken, getVerifierProfile);

/**
 * @swagger
 * /api/verifier/list:
 *   get:
 *     summary: Daftar semua verifikator yang sudah approved
 *     description: Mengembalikan daftar verifikator aktif. Bisa difilter berdasarkan bidang vokasi.
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: vocationField
 *         schema:
 *           type: string
 *         description: Filter berdasarkan bidang keahlian (opsional)
 *         example: "teknologi_informasi"
 */
router.get('/list', verifyToken, listApprovedVerifiers);

/**
 * @swagger
 * /api/verifier/admin/pending:
 *   get:
 *     summary: Daftar pendaftaran verifikator yang pending (admin only)
 *     tags: [Verifier]
 *     security:
 *       - BearerAuth: []
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
 */
router.put('/admin/reject/:uid', verifyToken, rejectVerifier);

module.exports = router;