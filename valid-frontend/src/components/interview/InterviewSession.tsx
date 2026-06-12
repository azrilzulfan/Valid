// HALAMAN: src/components/interview/InterviewSession.tsx
// FUNGSI: Komponen untuk fitur Interview AI

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Mic, CheckCircle, ShieldCheck, XCircle, Sun, Moon } from "lucide-react";
import { interviewApi } from "../../lib/api";
import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

// Blendshape gaze: makin tinggi nilainya, makin "menyimpang" arah pandangan dari kamera
const GAZE_BLENDSHAPES = [
  "eyeLookDownLeft",
  "eyeLookDownRight",
  "eyeLookInLeft",
  "eyeLookInRight",
  "eyeLookOutLeft",
  "eyeLookOutRight",
  "eyeLookUpLeft",
  "eyeLookUpRight",
];

function computeEyeContactScore(result: FaceLandmarkerResult): number | null {
  const blendshapes = result.faceBlendshapes?.[0]?.categories;
  if (!blendshapes) return null;

  let total = 0;
  let count = 0;
  for (const c of blendshapes) {
    if (GAZE_BLENDSHAPES.includes(c.categoryName)) {
      total += c.score;
      count++;
    }
  }
  if (count === 0) return null;

  const avgDeviation = total / count; // 0 (lurus ke kamera) - 1 (menyimpang jauh)
  return Math.round(Math.max(0, Math.min(100, 100 - avgDeviation * 250)));
}

function computeHeadPostureScore(result: FaceLandmarkerResult): number | null {
  const matrix = result.facialTransformationMatrixes?.[0]?.data;
  if (!matrix || matrix.length < 16) return null;

  // Estimasi sederhana yaw & pitch dari matriks transformasi 4x4 (column-major)
  const yaw = Math.atan2(matrix[2], matrix[10]) * (180 / Math.PI);
  const pitch = Math.atan2(-matrix[6], matrix[10]) * (180 / Math.PI);
  const deviation = Math.abs(yaw) + Math.abs(pitch);

  return Math.round(Math.max(0, Math.min(100, 100 - deviation * 1.2)));
}

export function Step3({
  setStep,
  currentQ,
  setCurrentQ,
  sessionId,
  setScores,
}: {
  setStep: (s: number) => void;
  currentQ: number;
  setCurrentQ: (q: number) => void;
  sessionId: string;
  setScores: (s: any) => void;
}) {
  const [questionId, setQuestionId] = useState("");
  const [questionText, setQuestionText] = useState("Memuat pertanyaan...");
  const [answerText, setAnswerText] = useState("");
  const [eyeContactLive, setEyeContactLive] = useState(70);
  const [confidenceLive, setConfidenceLive] = useState(70);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const faceDetectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const recognitionRef = useRef<any>(null);
  const speechSupportedRef = useRef(true);

  const answerTextRef = useRef("");
  const questionStartRef = useRef<number>(Date.now());

  const metricsRef = useRef({
    eyeContactScores: [] as number[],
    headPostureScores: [] as number[],
    volumeSamples: [] as number[],
    silenceMsTotal: 0,
    wordCountAtLastSend: 0,
  });

  // Simpan answerText terbaru ke ref agar bisa dibaca dari interval/closure
  useEffect(() => {
    answerTextRef.current = answerText;
  }, [answerText]);

  // === Setup kamera + MediaPipe Face Landmarker + Web Audio API (sekali saat mount) ===
  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        // --- Face Landmarker ---
        try {
          const filesetResolver = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
          );
          const faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            outputFaceBlendshapes: true,
            outputFacialTransformationMatrixes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          });
          if (cancelled) return;
          faceLandmarkerRef.current = faceLandmarker;

          faceDetectIntervalRef.current = setInterval(() => {
            const video = videoRef.current;
            const landmarker = faceLandmarkerRef.current;
            if (!video || !landmarker || video.readyState < 2) return;

            const result = landmarker.detectForVideo(video, performance.now());
            const eyeContact = computeEyeContactScore(result);
            const headPosture = computeHeadPostureScore(result);

            if (eyeContact !== null) metricsRef.current.eyeContactScores.push(eyeContact);
            if (headPosture !== null) metricsRef.current.headPostureScores.push(headPosture);
          }, 300);
        } catch (err) {
          console.error("Gagal memuat MediaPipe Face Landmarker, deteksi wajah dilewati:", err);
        }

        // --- Web Audio API (volume & silence detection) ---
        try {
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);

          audioContextRef.current = audioContext;
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          audioIntervalRef.current = setInterval(() => {
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            metricsRef.current.volumeSamples.push(volume);
            if (volume < 5) {
              metricsRef.current.silenceMsTotal += 150;
            }
          }, 150);
        } catch (err) {
          console.error("Gagal menginisialisasi Web Audio API:", err);
        }
      } catch (err) {
        console.error("Gagal mengakses kamera/mikrofon:", err);
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (faceDetectIntervalRef.current) clearInterval(faceDetectIntervalRef.current);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      faceLandmarkerRef.current?.close();
      audioContextRef.current?.close();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // === Setup Web Speech API (reset setiap ganti pertanyaan) ===
  useEffect(() => {
    questionStartRef.current = Date.now();
    setAnswerText("");
    metricsRef.current.wordCountAtLastSend = 0;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      speechSupportedRef.current = false;
      return;
    }

    let shouldRestart = true;
    const recognition = new SpeechRecognition();
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswerText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      // Chrome menghentikan recognition setelah idle, restart otomatis selama pertanyaan masih aktif
      if (shouldRestart) {
        try {
          recognition.start();
        } catch {}
      }
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Gagal memulai speech recognition:", err);
    }

    recognitionRef.current = recognition;

    return () => {
      shouldRestart = false;
      try {
        recognition.stop();
      } catch {}
    };
  }, [currentQ]);

  // === Kirim log analisis nyata setiap 10 detik ===
  useEffect(() => {
    const interval = setInterval(() => {
      const m = metricsRef.current;

      const avgEyeContact = m.eyeContactScores.length
        ? Math.round(m.eyeContactScores.reduce((a, b) => a + b, 0) / m.eyeContactScores.length)
        : 70;

      const avgHeadPosture = m.headPostureScores.length
        ? Math.round(m.headPostureScores.reduce((a, b) => a + b, 0) / m.headPostureScores.length)
        : 70;

      let volumeVariation = 0;
      if (m.volumeSamples.length > 1) {
        const avgVol = m.volumeSamples.reduce((a, b) => a + b, 0) / m.volumeSamples.length;
        const variance =
          m.volumeSamples.reduce((s, v) => s + Math.pow(v - avgVol, 2), 0) / m.volumeSamples.length;
        volumeVariation = Math.round(Math.sqrt(variance));
      }

      const currentWordCount = answerTextRef.current.trim().split(/\s+/).filter(Boolean).length;
      const wordsThisInterval = Math.max(0, currentWordCount - m.wordCountAtLastSend);
      const wordsPerMinute = wordsThisInterval * 6; // 10 detik -> per menit

      interviewApi
        .sendAnalysisLog({
          sessionId,
          faceData: {
            dominantExpression: avgEyeContact > 60 ? "focused" : "distracted",
            eyeContactScore: avgEyeContact,
            headPostureScore: avgHeadPosture,
          },
          voiceData: {
            wordsPerMinute,
            pauseDuration: Math.round(m.silenceMsTotal / 1000),
            volumeVariation,
          },
        })
        .catch((err) => console.error(err));

      setEyeContactLive(avgEyeContact);
      setConfidenceLive(avgHeadPosture);

      m.eyeContactScores = [];
      m.headPostureScores = [];
      m.volumeSamples = [];
      m.silenceMsTotal = 0;
      m.wordCountAtLastSend = currentWordCount;
    }, 10000);

    return () => clearInterval(interval);
  }, [sessionId]);

  // === Ambil pertanyaan dari backend setiap currentQ berubah ===
  useEffect(() => {
    const fetchQ = async () => {
      try {
        setQuestionText("Memuat pertanyaan...");
        const res = await interviewApi.getQuestion({ sessionId, questionNumber: currentQ });
        setQuestionId(res.questionId);
        setQuestionText(res.questionText);
      } catch (err: any) {
        console.error(err);
        setQuestionText("Gagal memuat pertanyaan: " + err.message);
      }
    };
    fetchQ();
  }, [currentQ, sessionId]);

  const handleNext = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const durationSeconds = Math.round((Date.now() - questionStartRef.current) / 1000);
    const finalAnswer = answerTextRef.current.trim() || "Tidak ada jawaban yang terdeteksi.";

    try {
      await interviewApi.submitAnswer({
        sessionId,
        questionId,
        answerText: finalAnswer,
        durationSeconds,
      });

      if (currentQ < 5) {
        setAnswerText("");
        setCurrentQ(currentQ + 1);
      } else {
        const res = await interviewApi.complete({ sessionId });
        setScores(res.scores);
        setStep(4);
      }
    } catch (err: any) {
      console.error(err);
      alert("Gagal mengirim jawaban: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      {...pageTransition}
      style={{
        background: "var(--gradient-sky)",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
      className="flex-col md:flex-row"
    >
      {/* LEFT PANEL */}
      <div className="w-full md:w-[60%] shrink-0 h-[45vh] md:h-full relative border-b md:border-b-0 md:border-r-[3px] border-[var(--border-color)] bg-slate-950/10 backdrop-blur-sm overflow-hidden">
        {/* Live camera feed */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />

        {/* Abstract Face overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "12px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "var(--primary)",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontSize: "10px",
                color: "var(--primary)",
                fontWeight: 700,
              }}
            >
              {eyeContactLive > 60 ? "Fokus Terdeteksi" : "Coba lihat ke kamera"}
            </span>
          </div>
        </div>

        {/* Top Left REC */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: "8px", height: "8px", backgroundColor: "#FF5C5C", borderRadius: "50%" }}
          />
          <span
            style={{
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              color: "#FF5C5C",
            }}
          >
            REC
          </span>
        </div>

        {/* Top Right Panel */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            backgroundColor: "var(--card-bg)",
            border: "2px solid var(--border-color)",
            boxShadow: "3px 3px 0px var(--shadow-color)",
            borderRadius: "12px",
            padding: "12px 16px",
            width: "176px",
            transition:
              "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                Kontak Mata
              </div>
              <div
                style={{
                  height: "4px",
                  backgroundColor: "var(--bg-b)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "2px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    width: `${eyeContactLive}%`,
                    height: "100%",
                    backgroundColor: "var(--primary)",
                    borderRadius: "2px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                Postur Kepala
              </div>
              <div
                style={{
                  height: "4px",
                  backgroundColor: "var(--bg-b)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "2px",
                  marginTop: "4px",
                }}
              >
                <div
                  style={{
                    width: `${confidenceLive}%`,
                    height: "100%",
                    backgroundColor: "var(--primary)",
                    borderRadius: "2px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                }}
              >
                Mikrofon
              </div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "var(--primary)",
                  borderRadius: "50%",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to top, var(--card-bg), transparent)",
          }}
        />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[40%] flex-1 overflow-y-auto bg-[var(--card-bg)] border-t md:border-t-0 md:border-l-[3px] border-[var(--border-color)] flex flex-col px-6 md:px-8 py-6 md:py-9 transition-colors duration-500">
        <div
          style={{
            height: "4px",
            backgroundColor: "var(--bg-b)",
            border: "1px solid var(--border-color)",
            borderRadius: "2px",
            width: "100%",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: `${(currentQ / 5) * 100}%`,
              height: "100%",
              backgroundColor: "var(--primary)",
              borderRadius: "2px",
              transition: "width 0.3s ease",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "18px",
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "12px",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
            flexShrink: 0,
          }}
        >
          Pertanyaan {currentQ} dari 5
        </div>

        <div style={{ marginTop: "12px", flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              style={{
                fontFamily: "var(--font-heading), Syne, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(17px, 2vw, 24px)",
                color: "var(--text-color)",
                lineHeight: 1.45,
              }}
            >
              {questionText}
            </motion.div>
          </AnimatePresence>
        </div>

        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          placeholder="Jawaban kamu akan muncul di sini saat kamu berbicara... (atau ketik manual)"
          style={{
            flex: 1,
            marginTop: "18px",
            backgroundColor: "var(--bg-b)",
            border: "2px solid var(--border-color)",
            borderRadius: "14px",
            padding: "16px 18px",
            color: "var(--text-color)",
            outline: "none",
            resize: "none",
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            transition: "background-color 500ms ease, border-color 500ms ease",
          }}
        />

        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            style={{
              width: "100%",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "12px",
              border: "3px solid var(--border-color)",
              boxShadow: "4px 4px 0px var(--shadow-color)",
              padding: "13px",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            className="hover:-translate-y-0.5 active:translate-y-0"
          >
            {isSubmitting
              ? currentQ < 5
                ? "Mengirim..."
                : "Memproses hasil..."
              : "Jawaban Selesai"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
