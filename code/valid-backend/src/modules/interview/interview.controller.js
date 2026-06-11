// src/modules/interview/interview.controller.js

const { v4: uuidv4 } = require('uuid');
const { db } = require('../../config/firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VOCATION_CONTEXT = {
  teknik:                'bidang teknik mesin / teknik elektro / teknik otomotif',
  kesehatan:             'bidang asisten keperawatan / farmasi / kesehatan lingkungan',
  hospitality:           'bidang perhotelan / tata boga / pariwisata',
  teknologi_informasi:   'bidang rekayasa perangkat lunak / jaringan komputer / multimedia',
  bisnis:                'bidang akuntansi / pemasaran / administrasi perkantoran',
};

// 1. Mulai sesi wawancara baru
const startSession = async (req, res, next) => {
  try {
    const { vocationField } = req.body;

    if (!vocationField || !VOCATION_CONTEXT[vocationField]) {
      return res.status(400).json({
        error: 'Bidang vokasi tidak valid',
        validFields: Object.keys(VOCATION_CONTEXT)
      });
    }

    const sessionId = uuidv4();

    await db.collection('interviewSessions').doc(sessionId).set({
      sessionId,
      uid:          req.user.uid,
      vocationField,
      status:       'in_progress',
      questions:    [],
      answers:      [],
      faceAnalysisLog:  [],
      voiceAnalysisLog: [],
      aiScores:     null,
      aiFeedback:   '',
      startedAt:    new Date().toISOString(),
      completedAt:  null,
    });

    res.status(201).json({
      message: 'Sesi wawancara dimulai',
      sessionId,
      vocationField
    });
  } catch (error) {
    next(error);
  }
};

// 2. Generate pertanyaan dari Gemini AI
const generateQuestion = async (req, res, next) => {
  try {
    const { sessionId, questionNumber } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId wajib diisi' });
    }

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid || sessionSnap.data().status !== 'in_progress') {
      return res.status(404).json({ error: 'Sesi tidak ditemukan atau sudah selesai' });
    }

    const session = sessionSnap.data();
    const vocationContext = VOCATION_CONTEXT[session.vocationField];
    const previousQuestions = session.questions.map(q => q.questionText).join('\n- ');

    const prompt = `Kamu adalah pewawancara kerja profesional untuk calon tenaga kerja vokasi Indonesia di ${vocationContext}.

Buatkan 1 pertanyaan wawancara kerja untuk pertanyaan nomor ${questionNumber || session.questions.length + 1} dari 5.

Aturan:
- Gunakan Bahasa Indonesia yang formal namun ramah
- Pertanyaan bersifat situasional atau behavioral (contoh: "Ceritakan pengalaman kamu ketika...")
- Tingkat kesulitan sesuai lulusan SMK atau D3
- Jangan ulangi pertanyaan berikut: ${previousQuestions || 'belum ada'}
- Hanya tulis pertanyaannya saja, tanpa nomor atau pengantar

Pertanyaan:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const questionText = result.response.text().trim();

    const questionId = uuidv4();
    const questionData = {
      questionId,
      questionText,
      askedAt: new Date().toISOString()
    };

    await sessionRef.update({
      questions: [...session.questions, questionData]
    });

    res.json({ questionId, questionText });
  } catch (error) {
    next(error);
  }
};

// 3. Submit jawaban kandidat
const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId, questionId, answerText, durationSeconds } = req.body;

    if (!sessionId || !questionId || !answerText) {
      return res.status(400).json({ error: 'sessionId, questionId, dan answerText wajib diisi' });
    }

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    const session = sessionSnap.data();
    const newAnswer = {
      questionId,
      answerText,
      answeredAt:      new Date().toISOString(),
      durationSeconds: durationSeconds || 0
    };

    await sessionRef.update({
      answers: [...session.answers, newAnswer]
    });

    res.json({ message: 'Jawaban berhasil disimpan' });
  } catch (error) {
    next(error);
  }
};

// 4. Submit log analisis wajah & suara dari frontend
const submitAnalysisLog = async (req, res, next) => {
  try {
    const { sessionId, faceData, voiceData } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId wajib diisi' });
    }

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    const session = sessionSnap.data();
    const updates = {};

    if (faceData) {
      updates.faceAnalysisLog = [
        ...session.faceAnalysisLog,
        {
          timestamp:         new Date().toISOString(),
          dominantExpression: faceData.dominantExpression,
          eyeContactScore:   faceData.eyeContactScore,
          headPostureScore:  faceData.headPostureScore
        }
      ];
    }

    if (voiceData) {
      updates.voiceAnalysisLog = [
        ...session.voiceAnalysisLog,
        {
          timestamp:       new Date().toISOString(),
          wordsPerMinute:  voiceData.wordsPerMinute,
          pauseDuration:   voiceData.pauseDuration,
          volumeVariation: voiceData.volumeVariation
        }
      ];
    }

    await sessionRef.update(updates);

    res.json({ message: 'Log analisis disimpan' });
  } catch (error) {
    next(error);
  }
};

// 5. Selesaikan sesi dan minta scoring dari Gemini
const completeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;

    const sessionRef = db.collection('interviewSessions').doc(sessionId);
    const sessionSnap = await sessionRef.get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid || sessionSnap.data().status !== 'in_progress') {
      return res.status(404).json({ error: 'Sesi tidak ditemukan atau sudah selesai' });
    }

    const session = sessionSnap.data();

    // Susun Q&A untuk dikirim ke Gemini
    const qaText = session.questions.map((q, i) => {
      const answer = session.answers.find(a => a.questionId === q.questionId);
      return `Pertanyaan ${i + 1}: ${q.questionText}\nJawaban: ${answer ? answer.answerText : '(tidak dijawab)'}`;
    }).join('\n\n');

    // Hitung rata-rata skor wajah dari log
    const avgEyeContact = session.faceAnalysisLog.length > 0
      ? session.faceAnalysisLog.reduce((sum, log) => sum + (log.eyeContactScore || 0), 0) / session.faceAnalysisLog.length
      : 50;

    const avgWPM = session.voiceAnalysisLog.length > 0
      ? session.voiceAnalysisLog.reduce((sum, log) => sum + (log.wordsPerMinute || 0), 0) / session.voiceAnalysisLog.length
      : 0;

    const scoringPrompt = `Kamu adalah penilai wawancara kerja profesional untuk calon tenaga kerja vokasi Indonesia di ${VOCATION_CONTEXT[session.vocationField]}.

Berikut rekap wawancara kandidat:
${qaText}

Data tambahan dari analisis perilaku:
- Rata-rata kontak mata: ${avgEyeContact.toFixed(1)}/100
- Rata-rata kecepatan bicara: ${avgWPM.toFixed(0)} kata/menit

Berikan penilaian dalam format JSON berikut (tanpa markdown, hanya JSON murni):
{
  "communication": <skor 0-100>,
  "relevance": <skor 0-100>,
  "confidence": <skor 0-100>,
  "professionalism": <skor 0-100>,
  "overall": <rata-rata dari keempat skor>,
  "feedback": "<paragraf singkat 3-4 kalimat dalam Bahasa Indonesia>"
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(scoringPrompt);
    const rawResponse = result.response.text().trim();

    let scores;
    try {
      const cleanJson = rawResponse.replace(/```json|```/g, '').trim();
      scores = JSON.parse(cleanJson);
    } catch {
      scores = {
        communication: 60, relevance: 60, confidence: 60,
        professionalism: 60, overall: 60,
        feedback: 'Analisis tidak dapat diproses secara otomatis.'
      };
    }

    await sessionRef.update({
      status:      'completed',
      aiScores:    {
        communication:  scores.communication,
        relevance:      scores.relevance,
        confidence:     scores.confidence,
        professionalism: scores.professionalism,
        overall:        scores.overall
      },
      aiFeedback:  scores.feedback,
      completedAt: new Date().toISOString(),
    });

    // Update skor behavioral di profil user
    await db.collection('users').doc(req.user.uid).update({
      behavioralScore:   scores.overall,
      lastInterviewAt:   new Date().toISOString(),
      updatedAt:         new Date().toISOString()
    });

    res.json({
      message:  'Sesi wawancara selesai',
      sessionId,
      scores,
      feedback: scores.feedback
    });
  } catch (error) {
    next(error);
  }
};

// 6. Ambil hasil sesi tertentu
const getSessionResult = async (req, res, next) => {
  try {
    const sessionSnap = await db.collection('interviewSessions').doc(req.params.sessionId).get();

    if (!sessionSnap.exists || sessionSnap.data().uid !== req.user.uid) {
      return res.status(404).json({ error: 'Sesi tidak ditemukan' });
    }

    // Hapus log besar dari response agar lebih ringan
    const session = sessionSnap.data();
    delete session.faceAnalysisLog;
    delete session.voiceAnalysisLog;

    res.json({ session });
  } catch (error) {
    next(error);
  }
};

// 7. Riwayat semua sesi user
const getSessionHistory = async (req, res, next) => {
  try {
    const snapshot = await db.collection('interviewSessions')
      .where('uid', '==', req.user.uid)
      .orderBy('startedAt', 'desc')
      .limit(10)
      .get();

    const sessions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        sessionId:    data.sessionId,
        vocationField: data.vocationField,
        status:       data.status,
        overall:      data.aiScores?.overall || null,
        startedAt:    data.startedAt,
        completedAt:  data.completedAt,
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
  getSessionHistory
};