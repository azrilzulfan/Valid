import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Mic, CheckCircle, ShieldCheck, XCircle, Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/interview")({
  component: InterviewPage,
});

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

export function InterviewPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQ, setCurrentQ] = useState(1);
  const navigate = useNavigate({ from: "/interview" });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark") || 
      localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDarkNow = html.classList.toggle("dark");
    setIsDark(isDarkNow);
    localStorage.setItem("theme", isDarkNow ? "dark" : "light");
  };

  return (
    <div
      style={{
        background: "var(--gradient-sky)",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "var(--font-body), 'DM Sans', sans-serif",
        color: "var(--text-color)",
        overflowX: "hidden",
        transition: "background 500ms ease, color 500ms ease",
      }}
    >
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <Step1 
            key="step1" 
            setStep={setCurrentStep} 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
          />
        )}
        {currentStep === 2 && (
          <Step2 
            key="step2" 
            setStep={setCurrentStep} 
            isDark={isDark} 
            toggleTheme={toggleTheme} 
          />
        )}
        {currentStep === 3 && (
          <Step3
            key="step3"
            setStep={setCurrentStep}
            currentQ={currentQ}
            setCurrentQ={setCurrentQ}
          />
        )}
        {currentStep === 4 && <Step4 key="step4" setStep={setCurrentStep} />}
        {currentStep === 5 && (
          <Step5
            key="step5"
            setStep={setCurrentStep}
            setCurrentQ={setCurrentQ}
            navigate={navigate}
            isDark={isDark}
            toggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Step1({ setStep, isDark, toggleTheme }: { setStep: (s: number) => void; isDark: boolean; toggleTheme: () => void }) {
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

function Step2({ setStep, isDark, toggleTheme }: { setStep: (s: number) => void; isDark: boolean; toggleTheme: () => void }) {
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

function Step3({ setStep, currentQ, setCurrentQ }: { setStep: (s: number) => void; currentQ: number; setCurrentQ: (q: number) => void }) {
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

function Step4({ setStep }: { setStep: (s: number) => void }) {
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

function Step5({ setStep, setCurrentQ, navigate, isDark, toggleTheme }: { setStep: (s: number) => void; setCurrentQ: (q: number) => void; navigate: any; isDark: boolean; toggleTheme: () => void }) {
  const dashoffsetTarget = 339.29 * (1 - 0.78);

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
              <span style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 900, fontSize: "32px", color: "var(--text-color)", lineHeight: 1 }}>78</span>
              <span style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontWeight: 400, fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>/100</span>
            </div>
          </div>

          <div style={{ flex: 1, width: "100%" }}>
            {[
              { label: "Kontak Mata", value: "84%", w: "84%" },
              { label: "Kepercayaan Diri", value: "71%", w: "71%" },
              { label: "Komunikasi", value: "79%", w: "79%" },
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
              Kamu menunjukkan performa yang cukup baik dalam sesi ini. Kepercayaan diri dan kemampuan komunikasi berada di atas rata-rata untuk lulusan vokasi.
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ backgroundColor: "var(--card-bg)", border: "3px solid var(--border-color)", boxShadow: "4px 4px 0px var(--shadow-color)", borderRadius: "16px", padding: "24px 28px", marginBottom: "16px", transition: "background-color 500ms ease, border-color 500ms ease, box-shadow 500ms ease" }}>
            <div style={{ fontFamily: "var(--font-heading), Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "var(--text-color)", marginBottom: "14px" }}>
              Kekuatan
            </div>
            {[
              "Kontak mata yang konsisten menunjukkan kepercayaan diri yang baik",
              "Penyampaian pengalaman kerja yang jelas dan terstruktur",
              "Penggunaan terminologi teknis yang tepat dan relevan"
            ].map((txt, i) => (
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
            {[
              "Kurangi penggunaan kata pengisi seperti 'eh' dan 'anu'",
              "Jawaban untuk pertanyaan rencana masa depan bisa lebih spesifik",
              "Latih kelancaran berbicara agar tidak terkesan terburu-buru"
            ].map((txt, i) => (
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
              Latih wawancara minimal 3 kali seminggu dan rekam diri sendiri untuk evaluasi mandiri. Fokus pada kejelasan jawaban dan minimalkan kata pengisi.
            </div>
          </div>
        </div>

        {/* SKILL TAGS */}
        <div style={{ marginTop: "24px" }}>
          <div style={{ fontFamily: "var(--font-body), 'DM Sans', sans-serif", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.12em", marginBottom: "12px", fontWeight: 700 }}>
            SKILL TERDETEKSI
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {["Pengelasan", "CNC Machining", "Quality Control", "AutoCAD"].map(skill => (
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
