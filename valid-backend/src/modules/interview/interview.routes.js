// src/modules/interview/interview.routes.js

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middleware/auth');
const {
  startSession, generateQuestion, submitAnswer,
  submitAnalysisLog, completeSession, getSessionResult, getSessionHistory
} = require('./interview.controller');

/**
 * @swagger
 * tags:
 *   name: Interview
 *   description: Simulasi wawancara behavioral berbasis AI
 */

/**
 * @swagger
 * /api/interview/start:
 *   post:
 *     summary: Mulai sesi wawancara baru
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
 *                 enum: [teknik, kesehatan, hospitality, teknologi_informasi, bisnis]
 *     responses:
 *       201:
 *         description: Sesi berhasil dibuat
 *       400:
 *         description: Bidang vokasi tidak valid
 */
router.post('/start', verifyToken, startSession);

/**
 * @swagger
 * /api/interview/question:
 *   post:
 *     summary: Generate pertanyaan wawancara via Gemini AI
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
 *               questionNumber:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pertanyaan berhasil digenerate
 *       404:
 *         description: Sesi tidak ditemukan
 */
router.post('/question', verifyToken, generateQuestion);

/**
 * @swagger
 * /api/interview/answer:
 *   post:
 *     summary: Submit jawaban kandidat
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
 *               questionId:
 *                 type: string
 *               answerText:
 *                 type: string
 *               durationSeconds:
 *                 type: number
 *     responses:
 *       200:
 *         description: Jawaban berhasil disimpan
 */
router.post('/answer', verifyToken, submitAnswer);

/**
 * @swagger
 * /api/interview/analysis:
 *   post:
 *     summary: Submit log analisis wajah dan suara dari frontend
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
 *               faceData:
 *                 type: object
 *               voiceData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Log analisis disimpan
 */
router.post('/analysis', verifyToken, submitAnalysisLog);

/**
 * @swagger
 * /api/interview/complete:
 *   post:
 *     summary: Selesaikan sesi dan dapatkan scoring dari AI
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
 *     responses:
 *       200:
 *         description: Sesi selesai dan skor berhasil digenerate
 *       404:
 *         description: Sesi tidak ditemukan
 */
router.post('/complete', verifyToken, completeSession);

/**
 * @swagger
 * /api/interview/result/{sessionId}:
 *   get:
 *     summary: Ambil hasil sesi wawancara tertentu
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hasil sesi berhasil diambil
 *       404:
 *         description: Sesi tidak ditemukan
 */
router.get('/result/:sessionId', verifyToken, getSessionResult);

/**
 * @swagger
 * /api/interview/history:
 *   get:
 *     summary: Riwayat semua sesi wawancara user
 *     tags: [Interview]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Riwayat sesi berhasil diambil
 */
router.get('/history', verifyToken, getSessionHistory);

module.exports = router;