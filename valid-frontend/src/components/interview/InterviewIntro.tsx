// HALAMAN: src/components/interview/InterviewIntro.tsx
// FUNGSI: Komponen untuk fitur Interview AI
// API YANG DIBUTUHKAN: -
// DUMMY DATA: pertanyaan hardcoded (TODO)

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Mic, CheckCircle, ShieldCheck, XCircle, Sun, Moon } from "lucide-react";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

const questions = [
  "Perkenalkan diri kamu dan ceritakan latar belakang pendidikan vokasi kamu.",
  "Ceritakan pengalaman atau proyek kerja yang paling berkesan bagi kamu.",
  "Apa tantangan terbesar yang pernah kamu hadapi dan bagaimana cara kamu mengatasinya?",
  "Skill teknis apa yang paling kamu kuasai dan bagaimana kamu terus mengembangkannya?",
  "Di mana kamu melihat dirimu dalam tiga tahun ke depan?",
];

export function Step1({ setStep, isDark, toggleTheme }: { setStep: (s: number) => void; isDark: boolean; toggleTheme: () => void }) {
  return (
    <motion.div
      {...pageTransition}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Floating Theme Toggle */}
      <div style={{ position: "absolute", top: "24px", right: "7vw", zIndex: 10 }}>
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center border-none bg-transparent outline-none"
          style={{ color: "var(--navy)" }}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-300 stroke-[2]" />
          ) : (
            <Moon className="w-5 h-5 text-slate-800 stroke-[2]" />
          )}
        </button>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between" style={{ padding: "80px 7vw 40px", gap: "60px" }}>
        {/* LEFT COLUMN */}
        <div style={{ width: "100%", flexBasis: "55%" }}>
          <div
            style={{
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "11px",
              color: "var(--primary)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "20px",
              fontWeight: 700,
            }}
          >
            WAWANCARA AI — SIMULATOR PRO
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading), Syne, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 82px)",
              color: "var(--text-color)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              display: "block",
            }}
          >
            Uji Kemampuanmu
          </h1>
          <h1
            style={{
              fontFamily: "var(--font-heading), Syne, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(44px, 6vw, 82px)",
              color: "var(--text-color)",
              lineHeight: 0.92,
              letterSpacing: "-0.03em",
              display: "block",
              position: "relative",
            }}
          >
            Sekarang.
            <div
              style={{
                height: "4px",
                width: "70%",
                backgroundColor: "var(--primary)",
                borderRadius: "2px",
                marginTop: "8px",
              }}
            />
          </h1>

          <p
            style={{
              marginTop: "28px",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "15px",
              color: "var(--text-muted)",
              maxWidth: "440px",
              lineHeight: 1.8,
            }}
          >
            Jawab 5 pertanyaan di depan kamera. Sistem kami menganalisis kontak mata, kepercayaan diri, dan pola komunikasi kamu secara real-time — langsung di browser, tanpa data yang dikirim ke server.
          </p>

          <div style={{ marginTop: "28px" }}>
            {[
              "Analisis kontak mata real-time",
              "Deteksi kata pengisi otomatis",
              "Laporan AI dalam 30 detik",
            ].map((text, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: "var(--primary)", borderRadius: "50%", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-muted)", fontWeight: 500 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              marginTop: "36px",
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "12px",
              border: "3px solid var(--border-color)",
              boxShadow: "4px 4px 0px var(--shadow-color)",
              padding: "14px 36px",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              display: "inline-block",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            className="hover:-translate-y-0.5 active:translate-y-0"
          >
            Mulai Sekarang
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: "100%", flexBasis: "45%", display: "flex", justifyContent: "center" }}>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            style={{
              backgroundColor: "var(--card-bg)",
              border: "3px solid var(--border-color)",
              boxShadow: "8px 8px 0px var(--shadow-color)",
              borderRadius: "24px",
              padding: "24px",
              maxWidth: "380px",
              width: "100%",
              transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: "8px", height: "8px", backgroundColor: "#FF5C5C", borderRadius: "50%" }}
                />
                <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: "#FF5C5C" }}>
                  REC
                </span>
              </div>
              <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                Pertanyaan 2 dari 5
              </span>
            </div>

            <div
              style={{
                marginTop: "14px",
                backgroundColor: "var(--bg-b)",
                border: "2px solid var(--border-color)",
                borderRadius: "16px",
                height: "160px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "8px",
                transition: "background-color 500ms ease, border-color 500ms ease",
              }}
            >
              <div style={{ display: "flex", gap: "20px" }}>
                <div style={{ width: "8px", height: "8px", backgroundColor: "var(--primary)", opacity: 0.65, borderRadius: "50%" }} />
                <div style={{ width: "8px", height: "8px", backgroundColor: "var(--primary)", opacity: 0.65, borderRadius: "50%" }} />
              </div>
              <div style={{ width: "22px", height: "4px", backgroundColor: "var(--primary)", opacity: 0.35, borderRadius: "2px" }} />
              
              <div style={{ display: "flex", alignItems: "center", gap: "5px", position: "absolute", bottom: "12px" }}>
                <div style={{ width: "6px", height: "6px", backgroundColor: "var(--primary)", borderRadius: "50%" }} />
                <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", color: "var(--primary)", fontWeight: 700 }}>
                  Fokus Terdeteksi
                </span>
              </div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Kontak Mata", value: "84%", width: "84%" },
                { label: "Kepercayaan Diri", value: "71%", width: "71%" },
                { label: "Komunikasi", value: "79%", width: "79%" },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>{m.label}</span>
                    <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: "var(--primary)" }}>{m.value}</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "var(--bg-b)", border: "1px solid var(--border-color)", borderRadius: "2px" }}>
                    <div style={{ width: m.width, height: "100%", backgroundColor: "var(--primary)", borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "14px", fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic", fontWeight: 500 }}>
              "Ceritakan pengalaman kerja yang paling berkesan..."
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
