// HALAMAN: src/components/interview/InterviewResults.tsx
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

export function Step5({ setStep, setCurrentQ, navigate, isDark, toggleTheme, scores }: { setStep: (s: number) => void; setCurrentQ: (q: number) => void; navigate: any; isDark: boolean; toggleTheme: () => void; scores?: any }) {
  const overallScore = scores?.overallScore || 0;
  const dashoffsetTarget = 339.29 * (1 - (overallScore / 100));

  return (
    <motion.div
      {...pageTransition}
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 7vw", borderBottom: "3px solid var(--border-color)", backgroundColor: "var(--card-bg)", transition: "background-color 500ms ease, border-color 500ms ease" }}>
        <div>
          <img src="/logo.png" alt="VALID Logo" className="h-[24px] object-contain" />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
            size={20} 
            style={{ cursor: "pointer" }} 
            onClick={() => navigate({ to: "/dashboard" })} 
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "48px 7vw 80px" }}>
        {/* SCORE ROW */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div style={{ position: "relative", width: "130px", height: "130px", flexShrink: 0 }}>
            <svg width="130" height="130">
              <circle cx="65" cy="65" r="54" stroke="var(--border-color)" strokeWidth="6" strokeOpacity="0.1" fill="none" />
              <motion.circle
                cx="65" cy="65" r="54"
                stroke="var(--primary)" strokeWidth="6" fill="none" strokeLinecap="round"
                strokeDasharray="339.29"
                initial={{ strokeDashoffset: 339.29 }}
                animate={{ strokeDashoffset: dashoffsetTarget }}
                transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
                style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
              />
            </svg>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 900, fontSize: "32px", color: "var(--text-color)", lineHeight: 1 }}>{overallScore}</span>
              <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>/100</span>
            </div>
          </div>

          <div style={{ flex: 1, width: "100%" }}>
            {[
              { label: "Kontak Mata", value: `${scores?.metrics?.eyeContact || 0}%`, w: `${scores?.metrics?.eyeContact || 0}%` },
              { label: "Kepercayaan Diri", value: `${scores?.metrics?.confidence || 0}%`, w: `${scores?.metrics?.confidence || 0}%` },
              { label: "Komunikasi", value: `${scores?.metrics?.communication || 0}%`, w: `${scores?.metrics?.communication || 0}%` },
            ].map((m, i) => (
              <div key={i} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", color: "var(--text-muted)" }}>{m.label}</span>
                  <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px", color: "var(--primary)" }}>{m.value}</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "var(--bg-b)", border: "1px solid var(--border-color)", borderRadius: "3px" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: m.w }}
                    transition={{ delay: i * 0.1, duration: 0.9, ease: "easeOut" }}
                    style={{ height: "100%", backgroundColor: "var(--primary)", borderRadius: "3px" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK CARDS */}
        <div style={{ marginTop: "40px" }}>
          {/* Card 1 */}
          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "24px 28px", marginBottom: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--text-color)", marginBottom: "14px" }}>
              Ringkasan
            </div>
            <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8 }}>
              {scores?.feedback?.summary || "Belum ada ringkasan hasil."}
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "24px 28px", marginBottom: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--text-color)", marginBottom: "14px" }}>
              Kekuatan
            </div>
            {(scores?.feedback?.strengths || []).map((txt: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                <div style={{ width: "3px", height: "18px", backgroundColor: "var(--primary)", borderRadius: "1px", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{txt}</div>
              </div>
            ))}
          </div>

          {/* Card 3 */}
          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "24px 28px", marginBottom: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--text-color)", marginBottom: "14px" }}>
              Area yang Perlu Ditingkatkan
            </div>
            {(scores?.feedback?.improvements || []).map((txt: string, i: number) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
                <div style={{ width: "3px", height: "18px", backgroundColor: "#C9A84C", borderRadius: "1px", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{txt}</div>
              </div>
            ))}
          </div>

          {/* Card 4 */}
          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "24px 28px", marginBottom: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--text-color)", marginBottom: "14px" }}>
              Rekomendasi
            </div>
            <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8 }}>
              {scores?.feedback?.recommendation || "Belum ada rekomendasi."}
            </div>
          </div>
        </div>

        {/* SKILL TAGS */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.12em", marginBottom: "12px", fontWeight: 700 }}>
            SKILL TERDETEKSI
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {(scores?.skills || []).map((skill: string) => (
              <div 
                key={skill} 
                style={{ 
                  backgroundColor: "var(--card-bg)", 
                  border: "2px solid var(--border-color)", 
                  color: "var(--text-color)", 
                  fontFamily: "var(--font-body), 'DM Sans', sans-serif", 
                  fontSize: "12px", 
                  fontWeight: 600, 
                  padding: "5px 14px", 
                  borderRadius: "999px",
                  transition: "background-color 500ms ease, border-color 500ms ease, color 500ms ease",
                }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* CTA CARD */}
        <div className="flex flex-col md:flex-row gap-8" style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "6px 6px 0px var(--shadow-color)", borderRadius: "20px", padding: "28px 32px", marginTop: "32px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "17px", color: "var(--text-color)" }}>Simpan ke Portfolio</div>
            <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "13px", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.7 }}>
              Tambahkan hasil wawancara ini ke portfolio agar perekrut bisa melihat kemampuan komunikasimu.
            </div>
            <button
              onClick={() => navigate({ to: "/dashboard/portfolio" })}
              style={{
                marginTop: "18px",
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: "12px",
                border: "3px solid var(--border-color)",
                boxShadow: "3px 3px 0px var(--shadow-color)",
                padding: "11px 24px",
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              className="hover:-translate-y-0.5 active:translate-y-0"
            >
              Simpan Hasil
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "17px", color: "var(--text-color)" }}>Minta Review Profesional</div>
            <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "13px", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.7 }}>
              Bayar dengan koin untuk mendapatkan feedback dari ahli BNSP bersertifikat.
            </div>
            <button
              onClick={() => { window.location.href = "/professionals"; }}
              style={{
                marginTop: "18px",
                backgroundColor: "var(--bg-b)",
                color: "var(--text-color)",
                border: "3px solid var(--border-color)",
                boxShadow: "3px 3px 0px var(--shadow-color)",
                borderRadius: "12px",
                padding: "11px 24px",
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                cursor: "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              className="hover:-translate-y-0.5 active:translate-y-0"
            >
              Lihat Profesional
            </button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={() => {
              setCurrentQ(1);
              setStep(1);
            }}
            style={{
              backgroundColor: "transparent",
              color: "var(--text-muted)",
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Coba lagi
          </button>
        </div>

      </div>
    </motion.div>
  );
}
