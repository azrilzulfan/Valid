// src/modules/interview/interview.controller.js

const { v4: uuidv4 } = require('uuid');
const { db } = require('../../config/firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VOCATION_CONTEXT = {
  teknik: 'bidang teknik mesin / teknik elektro / teknik otomotif',
  kesehatan: 'bidang asisten keperawatan / farmasi / kesehatan lingkungan',
  hospitality: 'bidang perhotelan / tata boga / pariwisata',
  teknologi_informasi: 'bidang rekayasa perangkat lunak / jaringan komputer / multimedia',
  bisnis: 'bidang akuntansi / pemasaran / administrasi perkantoran',
};

// 1. Mulai sesi wawancara baru & Generate 5 Pertanyaan Sekaligus (OPTIMASI ACTION PLAN 3)
const startSession = async (req, res, next) => {
  try {
    const { vocationField } = req.body;

    if (!vocationField || !VOCATION_CONTEXT[vocationField]) {
      return res.status(400).json({
        error: 'Bidang vokasi tidak valid',
        validFields: Object.keys(VOCATION_CONTEXT),
      });
    }

    const sessionId = uuidv4();
    let generatedQuestions = [];

    // Panggil Gemini API 1x saja di awal untuk memborong 5 pertanyaan!
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 1024,
        },
      });

      const prompt = `Buat 5 pertanyaan wawancara terstruktur (gabungan behavioral dan teknis dasar) dalam Bahasa Indonesia untuk pencari kerja lulusan pendidikan vokasi di ${VOCATION_CONTEXT[vocationField]}.
      Kembalikan HANYA dalam format JSON array dengan struktur:
      [
        { "text": "Pertanyaan 1" },
        { "text": "Pertanyaan 2" },
        { "text": "Pertanyaan 3" },
        { "text": "Pertanyaan 4" },
        { "text": "Pertanyaan 5" }
      ]`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      // Tambahkan UUID untuk masing-masing pertanyaan
      generatedQuestions = parsed.map((q) => ({
        questionId: uuidv4(),
        text: q.text || q.pertanyaan || q.question,
      }));
    } catch (apiError) {
      console.error('Gemini API Error (startSession):', apiError);
      // Fallback sangat penting! Jika API Limit (429) terjadi, aplikasi TETAP berjalan
      generatedQuestions = [
        { questionId: uuidv4(), text: 'Silakan perkenalkan diri Anda dan ceritakan latar belakang pendidikan Anda.' },
        { questionId: uuidv4(), text: `Apa keahlian praktis yang paling Anda kuasai terkait ${VOCATION_CONTEXT[vocationField]}?` },
        { questionId: uuidv4(), text: 'Ceritakan pengalaman saat Anda menghadapi proyek atau tugas yang sulit, dan bagaimana cara menyelesaikannya.' },
        { questionId: uuidv4(), text: 'Bagaimana Anda beradaptasi dengan lingkungan kerja baru atau bekerja di dalam tim?' },
        { questionId: uuidv4(), text: 'Apa pencapaian terbesar Anda sejauh ini yang paling relevan dengan bidang pekerjaan ini?' },
      ];
    }

    // Simpan data sesi beserta KELIMA pertanyaan ke Firestore
    await db.collection('interviewSessions').doc(sessionId).set({
      sessionId,
      uid: req.user.uid,
      vocationField,
      status: 'started',
      questions: generatedQuestions, // <--- Bank soal lokal disimpan di sini
      answers: [],
      faceAnalysisLog: [],
      voiceAnalysisLog: [],
      startedAt: new Date().toISOString(),
    });

    res.status(201).json({ sessionId, message: 'Sesi wawancara dimulai dan pertanyaan berhasil di-generate.' });
  } catch (error) {
    next(error);
  }
};

// 2. Ambil Pertanyaan Satuan dari Database (TANPA memanggil AI lagi)
const generateQuestion = async (req, res, next) => {
  try {
    const { sessionId, questionIndex = 1 } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId wajib diisi' });
    }

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    const sessionData = sessionSnap.data();

    // Konversi indeks yang dikirim frontend agar sesuai dengan urutan array lokal
    const idx = parseInt(questionIndex) - 1;
    if (!sessionData.questions || !sessionData.questions[idx]) {
      return res.status(404).json({ error: 'Pertanyaan tidak ditemukan atau indeks di luar batas' });
    }

    const currentQuestion = sessionData.questions[idx];

    // Response sekilat kilat! Tanpa latency API Eksternal
    res.json({
      question: currentQuestion.text,
      questionId: currentQuestion.questionId,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Submit Jawaban (Tetap sama)
const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionId, answerText, durationSeconds } = req.body;

    if (!sessionId || !questionId || !answerText) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    const answerData = {
      questionId,
      answerText,
      durationSeconds: durationSeconds || 0,
      answeredAt: new Date().toISOString(),
    };

    await sessionRef.update({
      answers: require('firebase-admin').firestore.FieldValue.arrayUnion(answerData),
    });

    res.json({ message: 'Jawaban tersimpan', answer: answerData });
  } catch (error) {
    next(error);
  }
};

// 4. Submit Log Analisis Ekspresi/Suara (Tetap sama)
const submitAnalysisLog = async (req, res, next) => {
  try {
    const { sessionId, faceLog, voiceLog } = req.body;

    const updates = {};
    if (faceLog) {
      updates.faceAnalysisLog = require('firebase-admin').firestore.FieldValue.arrayUnion(faceLog);
    }
    if (voiceLog) {
      updates.voiceAnalysisLog = require('firebase-admin').firestore.FieldValue.arrayUnion(voiceLog);
    }

    if (Object.keys(updates).length > 0) {
      await db.collection('interviewSessions').doc(sessionId).update(updates);
    }

    res.json({ message: 'Log analisis tersimpan' });
  } catch (error) {
    next(error);
  }
};

// 5. Complete Session & Skoring Akhir (AI Dipanggil ke-2 Kalinya)
const completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    const sessionData = sessionSnap.data();

    if (sessionData.status === 'completed') {
      return res.status(400).json({ error: 'Sesi sudah selesai dan dinilai' });
    }

    let parsedScores = {};

    // Panggil Gemini untuk Skoring Keseluruhan
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          maxOutputTokens: 1024,
        },
      });

      const transcript = sessionData.answers.map((a, i) => `Q${i + 1}: ${a.answerText}`).join('\n');

      const prompt = `Analisis performa wawancara berikut untuk bidang ${sessionData.vocationField}.
      Data transkrip jawaban kandidat:
      ${transcript}

      Evaluasi dan berikan skor dari 0-100 untuk metrik berikut, serta berikan masukan.
      Format HANYA JSON:
      {
        "aiScores": {
          "overall": 80,
          "confidence": 75,
          "communication": 80,
          "professionalism": 85,
          "relevance": 80,
          "eyeContact": 75,
          "headPosture": 80
        },
        "aiSkills": ["Komunikasi", "Analisis", "Pengalaman Praktis"],
        "aiFeedback": {
          "summary": "Kesimpulan singkat...",
          "strengths": ["Kekuatan 1", "Kekuatan 2"],
          "improvements": ["Hal yang perlu ditingkatkan"],
          "recommendation": "Rekomendasi tindakan..."
        }
      }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      parsedScores = JSON.parse(text);
    } catch (apiError) {
      console.error('Gemini AI Error (completeSession):', apiError);
      // Fallback Score jika API menyentuh Limit saat Submit Terakhir
      parsedScores = {
        aiScores: {
          overall: 70,
          confidence: 70,
          communication: 70,
          professionalism: 70,
          relevance: 70,
          eyeContact: 70,
          headPosture: 70,
        },
        aiSkills: ['Pengetahuan Dasar'],
        aiFeedback: {
          summary: 'Analisis otomatis saat ini tertunda karena limit server Google, tetapi jawabanmu aman tersimpan.',
          strengths: ['Kandidat berhasil menjawab seluruh pertanyaan.'],
          improvements: ['Tidak ada analisis mendetail yang dapat ditarik saat ini.'],
          recommendation: 'Kamu dapat mencoba fitur wawancara kembali setelah 1 menit.',
        },
      };
    }

    const finalData = {
      status: 'completed',
      completedAt: new Date().toISOString(),
      ...parsedScores,
    };

    await sessionRef.update(finalData);
    res.json({ message: 'Sesi selesai', result: finalData });
  } catch (error) {
    next(error);
  }
};

// 6. Ambil hasil sesi tertentu (Tetap sama)
const getSessionResult = async (req, res, next) => {
  try {
    const sessionSnap = await db.collection('interviewSessions').doc(req.params.sessionId).get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    const session = sessionSnap.data();
    delete session.faceAnalysisLog;
    delete session.voiceAnalysisLog;

    res.json({ session });
  } catch (error) {
    next(error);
  }
};

// 7. Riwayat semua sesi user (Tetap sama)
const getSessionHistory = async (req, res, next) => {
  try {
    const snapshot = await db.collection('interviewSessions').where('uid', '==', req.user.uid).orderBy('startedAt', 'desc').limit(10).get();

    const sessions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        sessionId: data.sessionId,
        vocationField: data.vocationField,
        status: data.status,
        overall: data.aiScores?.overall || null,
        startedAt: data.startedAt,
      };
    });

    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startSession,
  generateQuestion,
  submitAnswer,
  submitAnalysisLog,
  completeSession,
  getSessionResult,
  getSessionHistory,
};
