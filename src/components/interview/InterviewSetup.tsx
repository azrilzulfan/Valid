// HALAMAN: src/components/interview/InterviewSetup.tsx
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

export function Step2({ setStep, isDark, toggleTheme }: { setStep: (s: number) => void; isDark: boolean; toggleTheme: () => void }) {
  return (
    <motion.div
      {...pageTransition}
      style={{
        minHeight: "100vh",
        padding: "80px 24px",
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

      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--border-color)", opacity: 0.2 }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--border-color)", opacity: 0.2 }} />
        </div>

        <h2 style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "34px", color: "var(--text-color)", textAlign: "center", marginTop: "28px" }}>
          Persiapan Wawancara
        </h2>
        <p style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 300, fontSize: "14px", color: "var(--text-muted)", textAlign: "center", marginTop: "8px" }}>
          Pastikan perangkat kamu siap sebelum mulai.
        </p>

        <div style={{ marginTop: "36px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <Camera color="var(--primary)" size={22} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text-color)" }}>Kamera</div>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>Diperlukan untuk analisis kontak mata</div>
            </div>
            <CheckCircle color="var(--primary)" size={18} />
          </div>

          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <Mic color="var(--primary)" size={22} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 700, fontSize: "15px", color: "var(--text-color)" }}>Mikrofon</div>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>Diperlukan untuk analisis suara</div>
            </div>
            <CheckCircle color="var(--primary)" size={18} />
          </div>
        </div>

        <div style={{ backgroundColor: "var(--bg-b)", border: "2px solid var(--border-color)", borderRadius: "12px", padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "20px", transition: "background-color 500ms ease, border-color 500ms ease" }}>
          <ShieldCheck color="var(--primary)" size={15} style={{ flexShrink: 0, marginTop: "1px" }} />
          <p style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Semua analisis berjalan langsung di browser kamu. Tidak ada video atau audio yang dikirim atau disimpan ke server kami tanpa izin kamu.
          </p>
        </div>

        <div style={{ marginTop: "22px" }}>
          <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 700 }}>
            Konteks Wawancara (Opsional)
          </div>
          <select
            style={{
              backgroundColor: "var(--card-bg)",
              border: "3px solid var(--border-color)",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "var(--text-color)",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "14px",
              width: "100%",
              appearance: "none",
              outline: "none",
              fontWeight: 600,
              transition: "background-color 500ms ease, border-color 500ms ease, color 500ms ease",
            }}
          >
            {["Pilih bidang pekerjaan...", "Teknik Mesin", "Desain Grafis", "Teknologi Informasi", "Akuntansi", "Teknik Listrik", "Kuliner", "Lainnya"].map(opt => (
              <option key={opt} value={opt} style={{ backgroundColor: "var(--card-bg)", color: "var(--text-color)" }}>{opt}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setStep(3)}
          style={{
            width: "100%",
            marginTop: "28px",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            borderRadius: "12px",
            border: "3px solid var(--border-color)",
            boxShadow: "4px 4px 0px var(--shadow-color)",
            padding: "16px",
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            cursor: "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          className="hover:-translate-y-0.5 active:translate-y-0"
        >
          Mulai Wawancara
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
    </motion.div>
  );
}
