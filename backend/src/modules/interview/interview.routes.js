const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  startSession,
  generateQuestion,
  submitAnswer,
  submitAnalysisLog,
  completeSession,
  getSessionResult,
  getSessionHistory
} = require('./interview.controller');

/**
 * @swagger
 * tags:
 *   name: Interview
 *   description: Manajemen sesi wawancara AI — generate pertanyaan, submit jawaban, analisis wajah & suara
 */

/**
 * @swagger
 * /api/interview/start:
 *   post:
 *     summary: Mulai sesi wawancara baru
 *     description: Membuat sesi wawancara baru di MongoDB dan Firestore. Kembalikan sessionId yang digunakan untuk semua request berikutnya dalam sesi ini.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [vocationField]
 *             properties:
 *               vocationField:
 *                 type: string
 *                 description: Bidang vokasi untuk konteks pertanyaan wawancara
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *                 example: "teknologi_informasi"
 *     responses:
 *       201:
 *         description: Sesi berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesi wawancara dimulai"
 *                 sessionId:
 *                   type: string
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *                 vocationField:
 *                   type: string
 *                   example: "teknologi_informasi"
 *       400:
 *         description: Bidang vokasi tidak valid
 *       401:
 *         description: Token tidak valid
 */
router.post('/start', verifyToken, startSession);

/**
 * @swagger
 * /api/interview/question:
 *   post:
 *     summary: Generate pertanyaan wawancara via Gemini AI
 *     description: Menghasilkan satu pertanyaan situasional berbahasa Indonesia yang disesuaikan dengan bidang vokasi dan tidak mengulang pertanyaan sebelumnya dalam sesi yang sama.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: ID sesi dari endpoint /start
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               questionNumber:
 *                 type: number
 *                 description: Nomor urut pertanyaan (opsional, default otomatis)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Pertanyaan berhasil digenerate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionId:
 *                   type: string
 *                   example: "7f3a1c2d-..."
 *                 questionText:
 *                   type: string
 *                   example: "Ceritakan pengalaman kamu ketika menghadapi bug kritis menjelang deadline. Apa yang kamu lakukan?"
 *       400:
 *         description: sessionId tidak dikirim
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Sesi tidak ditemukan atau sudah selesai
 */
router.post('/question', verifyToken, generateQuestion);

/**
 * @swagger
 * /api/interview/answer:
 *   post:
 *     summary: Submit jawaban kandidat
 *     description: Menyimpan jawaban teks kandidat untuk pertanyaan tertentu dalam sesi yang sedang berjalan.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId, questionId, answerText]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               questionId:
 *                 type: string
 *                 description: ID pertanyaan dari endpoint /question
 *                 example: "7f3a1c2d-..."
 *               answerText:
 *                 type: string
 *                 description: Jawaban kandidat hasil transkripsi Web Speech API
 *                 example: "Ketika menghadapi bug kritis, saya pertama kali..."
 *               durationSeconds:
 *                 type: number
 *                 description: Durasi kandidat menjawab dalam detik (opsional)
 *                 example: 45
 *     responses:
 *       200:
 *         description: Jawaban berhasil disimpan
 *       400:
 *         description: Field wajib tidak lengkap
 *       401:
 *         description: Token tidak valid
 */
router.post('/answer', verifyToken, submitAnswer);

/**
 * @swagger
 * /api/interview/analysis-log:
 *   post:
 *     summary: Kirim log analisis wajah dan suara dari frontend
 *     description: Menerima data hasil analisis MediaPipe (wajah) dan Web Audio API (suara) yang diproses di sisi browser. Dipanggil secara periodik selama sesi berlangsung.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               faceData:
 *                 type: object
 *                 description: Data analisis wajah dari MediaPipe (opsional)
 *                 properties:
 *                   dominantExpression:
 *                     type: string
 *                     example: "neutral"
 *                   eyeContactScore:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 100
 *                     example: 78
 *                   headPostureScore:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 100
 *                     example: 85
 *               voiceData:
 *                 type: object
 *                 description: Data analisis suara dari Web Audio API (opsional)
 *                 properties:
 *                   wordsPerMinute:
 *                     type: number
 *                     example: 120
 *                   pauseDuration:
 *                     type: number
 *                     description: Total durasi jeda dalam detik
 *                     example: 3.5
 *                   volumeVariation:
 *                     type: number
 *                     description: Variasi volume (0-100)
 *                     example: 42
 *     responses:
 *       200:
 *         description: Log analisis berhasil disimpan
 *       400:
 *         description: sessionId tidak dikirim
 *       401:
 *         description: Token tidak valid
 */
router.post('/analysis-log', verifyToken, submitAnalysisLog);

/**
 * @swagger
 * /api/interview/complete:
 *   post:
 *     summary: Selesaikan sesi dan dapatkan scoring dari AI
 *     description: Menggabungkan semua jawaban dan data analisis perilaku, lalu meminta Gemini AI untuk memberikan skor dan feedback komprehensif. Skor disimpan di MongoDB dan Firestore.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionId]
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Sesi selesai, scoring berhasil digenerate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sesi wawancara selesai"
 *                 sessionId:
 *                   type: string
 *                 scores:
 *                   type: object
 *                   properties:
 *                     communication:
 *                       type: number
 *                       example: 78
 *                     relevance:
 *                       type: number
 *                       example: 82
 *                     confidence:
 *                       type: number
 *                       example: 70
 *                     professionalism:
 *                       type: number
 *                       example: 85
 *                     overall:
 *                       type: number
 *                       example: 78
 *                 feedback:
 *                   type: string
 *                   example: "Kandidat menunjukkan kemampuan komunikasi yang baik..."
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Sesi tidak ditemukan atau sudah selesai
 */
router.post('/complete', verifyToken, completeSession);

/**
 * @swagger
 * /api/interview/result/{sessionId}:
 *   get:
 *     summary: Ambil hasil sesi wawancara tertentu
 *     description: Mengembalikan detail sesi wawancara beserta skor AI dan feedback. Log analisis wajah dan suara tidak disertakan untuk efisiensi.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sesi wawancara
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Hasil sesi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   properties:
 *                     sessionId:
 *                       type: string
 *                     vocationField:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "completed"
 *                     questions:
 *                       type: array
 *                     answers:
 *                       type: array
 *                     aiScores:
 *                       type: object
 *                     aiFeedback:
 *                       type: string
 *                     startedAt:
 *                       type: string
 *                       format: date-time
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Sesi tidak ditemukan
 */
router.get('/result/:sessionId', verifyToken, getSessionResult);

/**
 * @swagger
 * /api/interview/history:
 *   get:
 *     summary: Riwayat semua sesi wawancara user
 *     description: Mengembalikan 10 sesi wawancara terakhir milik user, diurutkan dari yang terbaru.
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat sesi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sessionId:
 *                         type: string
 *                       vocationField:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [in_progress, completed, abandoned]
 *                       overall:
 *                         type: number
 *                         nullable: true
 *                       startedAt:
 *                         type: string
 *                         format: date-time
 *                       completedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *       401:
 *         description: Token tidak valid
 */
router.get('/history', verifyToken, getSessionHistory);

module.exports = router;