// src/modules/portfolio/portfolio.routes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../../middleware/auth');
const {
  uploadPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getPendingReviews,
  submitPeerReview,
  addUserComment,
  submitVerifierReview,
  getPublicPortfolios
} = require('./portfolio.controller');

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // maks 10 MB per file
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.'));
    }
  }
});

/**
 * @swagger
 * tags:
 *   name: Portfolio
 *   description: Upload portofolio teknis dan sistem peer review
 */

/**
 * @swagger
 * /api/portfolio/upload:
 *   post:
 *     summary: Upload portofolio beserta file bukti kerja ke Cloudinary
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, vocationField, files]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               vocationField:
 *                 type: string
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *               repositoryUrl:
 *                 type: string
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Portofolio berhasil diunggah
 *       400:
 *         description: Field wajib tidak lengkap
 *       409:
 *         description: File duplikat terdeteksi
 */
router.post('/upload', verifyToken, upload.array('files', 5), uploadPortfolio);

/**
 * @swagger
 * /api/portfolio/my:
 *   get:
 *     summary: Daftar portofolio milik user
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar portofolio berhasil diambil
 */
router.get('/my', verifyToken, getMyPortfolios);

/**
 * @swagger
 * /api/portfolio/review/pending:
 *   get:
 *     summary: Daftar portofolio yang menunggu peer review
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar portofolio pending berhasil diambil
 */
router.get('/review/pending', verifyToken, getPendingReviews);

/**
 * @swagger
 * /api/portfolio/public:
 *   get:
 *     summary: Daftar portofolio publik yang sudah approved
 *     tags: [Portfolio]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: vocationField
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar portofolio publik berhasil diambil
 */
router.get('/public', getPublicPortfolios);

/**
 * @swagger
 * /api/portfolio/{portfolioId}:
 *   get:
 *     summary: Detail portofolio tertentu (hanya pemilik)
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail portofolio berhasil diambil
 *       404:
 *         description: Portofolio tidak ditemukan
 */
router.get('/:portfolioId', verifyToken, getPortfolioById);

/**
 * @swagger
 * /api/portfolio/review/{portfolioId}:
 *   post:
 *     summary: Submit penilaian peer review
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [technicalAccuracy, processDocumentation, originality, feedback]
 *             properties:
 *               technicalAccuracy:
 *                 type: number
 *               processDocumentation:
 *                 type: number
 *               originality:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review berhasil disimpan
 *       403:
 *         description: Tidak bisa review portofolio sendiri
 *       409:
 *         description: Sudah pernah mereview
 */
router.post('/review/:portfolioId', verifyToken, submitPeerReview);

/**
 * @swagger
 * /api/portfolio/{portfolioId}/comment:
 *   post:
 *     summary: Tambah komentar pada portofolio
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Komentar berhasil ditambahkan
 */
router.post('/:portfolioId/comment', verifyToken, addUserComment);

/**
 * @swagger
 * /api/portfolio/{portfolioId}/verify:
 *   post:
 *     summary: Submit review resmi oleh verifikator yang ditugaskan
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [technicalAccuracy, processDocumentation, originality, feedback]
 *             properties:
 *               technicalAccuracy:
 *                 type: number
 *               processDocumentation:
 *                 type: number
 *               originality:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review verifikator berhasil disimpan
 *       403:
 *         description: Bukan verifikator yang ditugaskan
 */
router.post('/:portfolioId/verify', verifyToken, submitVerifierReview);

module.exports = router;