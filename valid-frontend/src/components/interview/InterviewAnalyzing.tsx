// HALAMAN: src/components/interview/InterviewAnalyzing.tsx
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

export function Step4({ setStep }: { setStep: (s: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => {
      setStep(5);
    }, 3000);
    return () => clearTimeout(t);
  }, [setStep]);

  return (
    <motion.div
      {...pageTransition}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "40px" }}>
        {[0.12, 0.24, 0.36, 0.48, 0.6].map((delay, i) => (
          <motion.div
            key={i}
            animate={{ scaleY: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 0.8, delay }}
            style={{ width: "5px", height: "100%", borderRadius: "3px", backgroundColor: "var(--primary)", transformOrigin: "bottom" }}
          />
        ))}
      </div>

      <div style={{ marginTop: "36px", fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-color)", textAlign: "center" }}>
        Menganalisis performa wawancara kamu...
      </div>
      <div style={{ marginTop: "8px", fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 300, fontSize: "14px", color: "var(--text-muted)", textAlign: "center" }}>
        Ini memakan waktu sekitar 30 detik.
      </div>

      <div style={{ marginTop: "44px", width: "300px", height: "4px", backgroundColor: "var(--bg-b)", border: "1px solid var(--border-color)", borderRadius: "2px" }}>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "linear" }}
          style={{ height: "100%", backgroundColor: "var(--primary)", borderRadius: "2px" }}
        />
      </div>
    </motion.div>
  );
}
