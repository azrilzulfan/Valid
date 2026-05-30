// HALAMAN: src/components/interview/InterviewSession.tsx
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

export function Step3({ setStep, currentQ, setCurrentQ }: { setStep: (s: number) => void; currentQ: number; setCurrentQ: (q: number) => void }) {
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
      <div className="w-full md:w-[60%] shrink-0 h-[45vh] md:h-full relative border-b md:border-b-0 md:border-r-[3px] border-[var(--border-color)] bg-slate-950/10 backdrop-blur-sm">
        {/* Abstract Face */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", gap: "24px" }}>
            <div style={{ width: "10px", height: "10px", backgroundColor: "var(--primary)", opacity: 0.65, borderRadius: "50%" }} />
            <div style={{ width: "10px", height: "10px", backgroundColor: "var(--primary)", opacity: 0.65, borderRadius: "50%" }} />
          </div>
          <div style={{ width: "28px", height: "4px", backgroundColor: "var(--primary)", opacity: 0.35, borderRadius: "2px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "12px" }}>
            <div style={{ width: "6px", height: "6px", backgroundColor: "var(--primary)", borderRadius: "50%" }} />
            <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", color: "var(--primary)", fontWeight: 700 }}>
              Fokus Terdeteksi
            </span>
          </div>
        </div>

        {/* Top Left REC */}
        <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: "8px", height: "8px", backgroundColor: "#FF5C5C", borderRadius: "50%" }}
          />
          <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", fontWeight: 700, color: "#FF5C5C" }}>
            REC
          </span>
        </div>

        {/* Top Right Panel */}
        <div style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "var(--card-bg)", border: "2px solid var(--border-color)", boxShadow: "3px 3px 0px var(--shadow-color)", borderRadius: "12px", padding: "12px 16px", width: "176px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>Kontak Mata</div>
              <div style={{ height: "4px", backgroundColor: "var(--bg-b)", border: "1px solid var(--border-color)", borderRadius: "2px", marginTop: "4px" }}>
                <div style={{ width: "75%", height: "100%", backgroundColor: "var(--primary)", borderRadius: "2px" }} />
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>Kepercayaan Diri</div>
              <div style={{ height: "4px", backgroundColor: "var(--bg-b)", border: "1px solid var(--border-color)", borderRadius: "2px", marginTop: "4px" }}>
                <div style={{ width: "60%", height: "100%", backgroundColor: "var(--primary)", borderRadius: "2px" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>Gugup</div>
              <div style={{ width: "8px", height: "8px", backgroundColor: "var(--primary)", borderRadius: "50%" }} />
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to top, var(--card-bg), transparent)" }} />
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[40%] flex-1 overflow-y-auto bg-[var(--card-bg)] border-t md:border-t-0 md:border-l-[3px] border-[var(--border-color)] flex flex-col px-6 md:px-8 py-6 md:py-9 transition-colors duration-500">
        <div style={{ height: "4px", backgroundColor: "var(--bg-b)", border: "1px solid var(--border-color)", borderRadius: "2px", width: "100%", flexShrink: 0 }}>
          <div style={{ width: `${(currentQ / 5) * 100}%`, height: "100%", backgroundColor: "var(--primary)", borderRadius: "2px", transition: "width 0.3s ease" }} />
        </div>

        <div style={{ marginTop: "18px", fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 600, fontSize: "12px", color: "var(--text-muted)", letterSpacing: "0.04em", flexShrink: 0 }}>
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
              {questions[currentQ - 1]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div style={{ flex: 1, marginTop: "18px", backgroundColor: "var(--bg-b)", border: "2px solid var(--border-color)", borderRadius: "14px", padding: "16px 18px", overflowY: "auto", transition: "background-color 500ms ease, border-color 500ms ease" }}>
          <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic", fontWeight: 500 }}>
            Jawaban kamu akan muncul di sini saat kamu berbicara...
          </span>
        </div>

        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button
            onClick={() => {
              if (currentQ < 5) {
                setCurrentQ(currentQ + 1);
              } else {
                setStep(4);
              }
            }}
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
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            className="hover:-translate-y-0.5 active:translate-y-0"
          >
            Jawaban Selesai
          </button>
        </div>
      </div>
    </motion.div>
  );
}
