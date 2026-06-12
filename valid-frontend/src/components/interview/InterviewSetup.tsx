// HALAMAN: src/components/interview/InterviewSetup.tsx
// FUNGSI: Komponen untuk fitur Interview AI

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Mic,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";
import { interviewApi, usersApi } from "../../lib/api";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

const VALID_VOCATION_FIELDS = [
  "teknik",
  "kesehatan",
  "hospitality",
  "teknologi_informasi",
  "bisnis",
];

export function Step2({
  setStep,
  navigate,
  isDark,
  toggleTheme,
  setSessionId,
}: {
  setStep: (s: number) => void;
  navigate: any;
  isDark: boolean;
  toggleTheme: () => void;
  setSessionId: (s: string) => void;
}) {
  const [camStatus, setCamStatus] = useState<"checking" | "ok" | "error">("checking");
  const [micStatus, setMicStatus] = useState<"checking" | "ok" | "error">("checking");
  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const vocationFieldRef = useRef<string>("teknologi_informasi");

  useEffect(() => {
    let permissionStream: MediaStream | null = null;

    const checkPermissions = async () => {
      try {
        permissionStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setCamStatus(permissionStream.getVideoTracks().length > 0 ? "ok" : "error");
        setMicStatus(permissionStream.getAudioTracks().length > 0 ? "ok" : "error");
      } catch (err) {
        console.error("Gagal mengakses kamera/mikrofon:", err);
        setCamStatus("error");
        setMicStatus("error");
        setErrorMsg("Izin kamera/mikrofon ditolak. Aktifkan izin pada browser untuk melanjutkan.");
      } finally {
        // Lepas stream pengecekan ini, Step3 akan membuat stream sendiri
        permissionStream?.getTracks().forEach((t) => t.stop());
      }
    };

    const fetchVocationField = async () => {
      try {
        const res = await usersApi.getProfile();
        const field = res?.user?.vocationField || res?.vocationField;
        if (field && VALID_VOCATION_FIELDS.includes(field)) {
          vocationFieldRef.current = field;
        }
      } catch (err) {
        console.error("Gagal mengambil profil user, menggunakan default vocationField:", err);
      }
    };

    checkPermissions();
    fetchVocationField();

    return () => {
      permissionStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const handleStart = async () => {
    try {
      setIsStarting(true);
      const res = await interviewApi.start({ vocationField: vocationFieldRef.current });
      setSessionId(res.sessionId);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      alert("Gagal memulai sesi wawancara: " + err.message);
    } finally {
      setIsStarting(false);
    }
  };

  const isReady = camStatus === "ok" && micStatus === "ok";
  const hasError = camStatus === "error" || micStatus === "error";

  return (
    <motion.div
      {...pageTransition}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "7vw",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent outline-none"
          style={{ color: "var(--navy)" }}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-300 stroke-[2]" />
          ) : (
            <Moon className="w-5 h-5 text-slate-800 stroke-[2]" />
          )}
        </button>
        <XCircle
          color="var(--text-muted)"
          size={24}
          style={{ cursor: "pointer" }}
          onClick={() => navigate({ to: "/dashboard" })}
        />
      </div>

      <div
        style={{
          backgroundColor: "var(--card-bg)",
          border: "3px solid var(--border-color)",
          boxShadow: "6px 6px 0px var(--shadow-color)",
          borderRadius: "20px",
          padding: "40px 32px",
          width: "100%",
          maxWidth: "480px",
          textAlign: "center",
          transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            backgroundColor: "var(--bg-b)",
            border: "2px solid var(--border-color)",
            borderRadius: "16px",
            marginBottom: "24px",
          }}
        >
          <ShieldCheck color="var(--primary)" size={32} />
        </div>

        <div
          style={{
            fontFamily: "var(--font-heading), Syne, sans-serif",
            fontWeight: 800,
            fontSize: "24px",
            color: "var(--text-color)",
            marginBottom: "8px",
          }}
        >
          Persiapan Wawancara
        </div>

        <div
          style={{
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: "14px",
            color: "var(--text-muted)",
            marginBottom: "32px",
            lineHeight: 1.6,
          }}
        >
          Kami perlu akses ke kamera dan mikrofon kamu untuk menganalisis ekspresi dan nada suara.
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: hasError ? "16px" : "32px",
          }}
        >
          {/* CAMERA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "var(--bg-b)",
              border: "2px solid var(--border-color)",
              borderRadius: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  backgroundColor: "var(--card-bg)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <Camera size={18} color="var(--text-color)" />
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--text-color)",
                  }}
                >
                  Kamera
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  Untuk kontak mata & postur
                </div>
              </div>
            </div>
            <div>
              {camStatus === "checking" && (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid var(--text-muted)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              )}
              {camStatus === "ok" && <CheckCircle color="#10B981" size={20} />}
              {camStatus === "error" && <AlertTriangle color="#EF4444" size={20} />}
            </div>
          </div>

          {/* MICROPHONE */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              backgroundColor: "var(--bg-b)",
              border: "2px solid var(--border-color)",
              borderRadius: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "36px",
                  height: "36px",
                  backgroundColor: "var(--card-bg)",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                }}
              >
                <Mic size={18} color="var(--text-color)" />
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "var(--text-color)",
                  }}
                >
                  Mikrofon
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  Untuk analisis suara & jawaban
                </div>
              </div>
            </div>
            <div>
              {micStatus === "checking" && (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid var(--text-muted)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
              )}
              {micStatus === "ok" && <CheckCircle color="#10B981" size={20} />}
              {micStatus === "error" && <AlertTriangle color="#EF4444" size={20} />}
            </div>
          </div>
        </div>

        {hasError && (
          <div
            style={{
              marginBottom: "24px",
              padding: "12px 16px",
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "2px solid #EF4444",
              borderRadius: "12px",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "12px",
              color: "#EF4444",
              textAlign: "left",
              lineHeight: 1.6,
            }}
          >
            {errorMsg || "Tidak dapat mengakses kamera atau mikrofon."}
          </div>
        )}

        <button
          disabled={!isReady || isStarting}
          onClick={handleStart}
          style={{
            width: "100%",
            backgroundColor: !isReady || isStarting ? "var(--bg-b)" : "var(--primary)",
            color: !isReady || isStarting ? "var(--text-muted)" : "var(--primary-foreground)",
            borderRadius: "12px",
            border: "3px solid var(--border-color)",
            boxShadow: "4px 4px 0px var(--shadow-color)",
            padding: "16px",
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            cursor: !isReady || isStarting ? "not-allowed" : "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          className={!isReady || isStarting ? "" : "hover:-translate-y-0.5 active:translate-y-0"}
        >
          {isStarting ? "Memulai..." : "Mulai Wawancara"}
        </button>

        <button
          onClick={() => setStep(1)}
          style={{
            width: "100%",
            marginTop: "12px",
            backgroundColor: "transparent",
            color: "var(--text-muted)",
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Kembali
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
