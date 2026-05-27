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
  limits: { fileSize: 10 * 1024 * 1024 },
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
 *     summary: Upload portofolio beserta file bukti kerja
 *     description: Mengunggah portofolio teknis kandidat ke Cloudinary. Mendukung hingga 5 file berformat JPG, PNG, atau PDF dengan ukuran maksimal 10 MB per file. Sistem akan memeriksa duplikasi file menggunakan hash SHA-256.
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
 *                 description: Judul portofolio
 *                 example: "Proyek Sistem Kasir Berbasis Web"
 *               description:
 *                 type: string
 *                 description: Deskripsi singkat portofolio
 *                 example: "Sistem kasir yang dibangun menggunakan React dan Node.js untuk UMKM"
 *               vocationField:
 *                 type: string
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *                 example: "teknologi_informasi"
 *               repositoryUrl:
 *                 type: string
 *                 description: Tautan repositori GitHub (opsional)
 *                 example: "https://github.com/username/kasir-app"
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: File bukti kerja (JPG, PNG, PDF — maks 5 file, 10 MB/file)
 *     responses:
 *       201:
 *         description: Portofolio berhasil diunggah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Portofolio berhasil diunggah dan menunggu peer review"
 *                 portfolioId:
 *                   type: string
 *                 fileCount:
 *                   type: number
 *                   example: 3
 *       400:
 *         description: Field wajib tidak lengkap atau tidak ada file
 *       401:
 *         description: Token tidak valid
 *       409:
 *         description: File duplikat terdeteksi
 */
router.post('/upload', verifyToken, upload.array('files', 5), uploadPortfolio);

/**
 * @swagger
 * /api/portfolio/my:
 *   get:
 *     summary: Daftar portofolio milik user
 *     description: Mengembalikan semua portofolio yang diunggah oleh user yang sedang login, diurutkan dari yang terbaru.
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar portofolio berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 portfolios:
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
 *                       status:
 *                         type: string
 *                         enum: [pending, under_review, approved, rejected]
 *                       averageScore:
 *                         type: number
 *                         nullable: true
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token tidak valid
 */
router.get('/my', verifyToken, getMyPortfolios);

/**
 * @swagger
 * /api/portfolio/review/pending:
 *   get:
 *     summary: Daftar portofolio yang menunggu peer review
 *     description: Mengembalikan hingga 10 portofolio berstatus pending yang belum pernah direview oleh user ini dan bukan milik user ini sendiri. Digunakan oleh reviewer untuk memilih portofolio yang akan dinilai.
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar portofolio pending berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 portfolios:
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
 *                       description:
 *                         type: string
 *                       submittedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Token tidak valid
 */
router.get('/review/pending', verifyToken, getPendingReviews);

/**
 * @swagger
 * /api/portfolio/{portfolioId}:
 *   get:
 *     summary: Detail portofolio tertentu
 *     description: Mengembalikan detail lengkap portofolio termasuk URL file dan daftar peer review yang sudah masuk. Hanya bisa diakses oleh pemilik portofolio.
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID portofolio
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Detail portofolio berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 portfolio:
 *                   type: object
 *                   properties:
 *                     portfolioId:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     vocationField:
 *                       type: string
 *                     fileUrls:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fileName:
 *                             type: string
 *                           fileUrl:
 *                             type: string
 *                           fileType:
 *                             type: string
 *                     repositoryUrl:
 *                       type: string
 *                     status:
 *                       type: string
 *                     averageScore:
 *                       type: number
 *                       nullable: true
 *                     peerReviews:
 *                       type: array
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Portofolio tidak ditemukan
 */
router.get('/:portfolioId', verifyToken, getPortfolioById);

/**
 * @swagger
 * /api/portfolio/review/{portfolioId}:
 *   post:
 *     summary: Submit penilaian peer review
 *     description: Reviewer mengirimkan penilaian untuk portofolio tertentu menggunakan rubrik standar. Setiap reviewer hanya bisa menilai satu kali per portofolio dan tidak bisa menilai portofolio milik sendiri. Jika sudah terkumpul 2+ review, portofolio otomatis berstatus approved dan pemilik mendapat notifikasi.
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID portofolio yang akan direview
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
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Skor akurasi teknis pekerjaan
 *                 example: 80
 *               processDocumentation:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Skor kelengkapan dokumentasi proses kerja
 *                 example: 75
 *               originality:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Skor orisinalitas karya
 *                 example: 85
 *               feedback:
 *                 type: string
 *                 description: Komentar kualitatif reviewer
 *                 example: "Dokumentasi proses kerja cukup lengkap, namun kode perlu lebih banyak komentar..."
 *     responses:
 *       200:
 *         description: Review berhasil disimpan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review berhasil disimpan, poin reputasi +10"
 *                 overallScore:
 *                   type: number
 *                   example: 80
 *       400:
 *         description: Field penilaian tidak lengkap
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Tidak dapat mereview portofolio sendiri
 *       404:
 *         description: Portofolio tidak ditemukan
 *       409:
 *         description: Sudah pernah mereview portofolio ini
 */
router.post('/review/:portfolioId', verifyToken, submitPeerReview);

/**
 * @swagger
 * /api/portfolio/public:
 *   get:
 *     summary: Daftar portofolio publik yang sudah approved
 *     description: Mengembalikan portofolio yang sudah diverifikasi, bisa dilihat semua user.
 *     tags: [Portfolio]
 *     security:
 *       - BearerAuth: []
 */
router.get('/public', verifyToken, getPublicPortfolios);

/**
 * @swagger
 * /api/portfolio/{portfolioId}/comment:
 *   post:
 *     summary: Tambah komentar pada portofolio
 *     description: Pengguna biasa dapat menambahkan komentar pada portofolio yang sudah approved. Komentar bersifat sosial dan tidak mempengaruhi skor atau badge.
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
 *                 example: "Keren banget proyeknya, terutama bagian implementasi databasenya!"
 *     responses:
 *       200:
 *         description: Komentar berhasil ditambahkan
 *       400:
 *         description: Komentar tidak boleh kosong
 *       404:
 *         description: Portofolio tidak ditemukan
 */
router.post('/:portfolioId/comment', verifyToken, addUserComment);

/**
 * @swagger
 * /api/portfolio/{portfolioId}/verify:
 *   post:
 *     summary: Submit review resmi oleh verifikator
 *     description: Hanya bisa dilakukan oleh verifikator yang sudah ditugaskan ke portofolio ini setelah pembayaran dikonfirmasi. Hasil review ini yang menentukan skor teknis untuk badge.
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
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 85
 *               processDocumentation:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 80
 *               originality:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 75
 *               feedback:
 *                 type: string
 *                 example: "Proyek menunjukkan pemahaman teknis yang solid..."
 *     responses:
 *       200:
 *         description: Review verifikator berhasil disimpan, portofolio approved
 *       403:
 *         description: Bukan verifikator yang ditugaskan untuk portofolio ini
 *       404:
 *         description: Portofolio tidak ditemukan
 */
router.post('/:portfolioId/verify', verifyToken, submitVerifierReview);

module.exports = router;