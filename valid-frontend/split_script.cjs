const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/routes/interview.tsx');
const code = fs.readFileSync(filePath, 'utf-8');

// Find boundaries of functions
const extractFunction = (funcName, code) => {
    const startStr = `function ${funcName}(`;
    const startIndex = code.indexOf(startStr);
    if (startIndex === -1) return null;

    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let endIndex = -1;

    for (let i = startIndex; i < code.length; i++) {
        const char = code[i];
        const prevChar = i > 0 ? code[i - 1] : '';

        if ((char === '"' || char === "'" || char === "\`") && prevChar !== '\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (stringChar === char) {
                inString = false;
            }
        }

        if (!inString) {
            if (char === '{') braceCount++;
            if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
    }

    if (endIndex !== -1) {
        return code.substring(startIndex, endIndex + 1);
    }
    return null;
};

const step1 = extractFunction('Step1', code);
const step2 = extractFunction('Step2', code);
const step3 = extractFunction('Step3', code);
const step4 = extractFunction('Step4', code);
const step5 = extractFunction('Step5', code);

// Create files
const outDir = path.join(__dirname, 'src/components/interview');

const commonImports = `import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Mic, CheckCircle, ShieldCheck, XCircle, Sun, Moon } from "lucide-react";
import { interviewApi } from "../../lib/api";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;
`;

const step1Code = `// HALAMAN: komponen/interview/InterviewIntro
// FUNGSI: Menampilkan layar awal pengenalan sebelum wawancara dimulai
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

${commonImports}

export ${step1}
`;

const step2Code = `// HALAMAN: komponen/interview/InterviewSetup
// FUNGSI: Menampilkan layar persiapan kamera/mic dan pemilihan bidang sebelum wawancara
// API YANG DIBUTUHKAN: interviewApi.start, interviewApi.getQuestion
// DUMMY DATA: -

${commonImports}

export ${step2}
`;

const step3Code = `// HALAMAN: komponen/interview/InterviewSession
// FUNGSI: Menampilkan layar sesi wawancara utama tempat user menjawab pertanyaan
// API YANG DIBUTUHKAN: interviewApi.submitAnalysisLog, interviewApi.submitAnswer, interviewApi.getQuestion
// DUMMY DATA: -

${commonImports}

const questions = [
  "Perkenalkan diri kamu dan ceritakan latar belakang pendidikan vokasi kamu.",
  "Ceritakan pengalaman atau proyek kerja yang paling berkesan bagi kamu.",
  "Apa tantangan terbesar yang pernah kamu hadapi dan bagaimana cara kamu mengatasinya?",
  "Skill teknis apa yang paling kamu kuasai dan bagaimana kamu terus mengembangkannya?",
  "Di mana kamu melihat dirimu dalam tiga tahun ke depan?",
];

export ${step3}
`;

const step4Code = `// HALAMAN: komponen/interview/InterviewAnalyzing
// FUNGSI: Menampilkan layar loading saat backend memproses video/jawaban wawancara
// API YANG DIBUTUHKAN: interviewApi.complete
// DUMMY DATA: -

${commonImports}

export ${step4}
`;

const step5Code = `// HALAMAN: komponen/interview/InterviewResults
// FUNGSI: Menampilkan hasil wawancara, skor, metrik, kekuatan, dan area peningkatan
// API YANG DIBUTUHKAN: - (Data didapat dari state parent)
// DUMMY DATA: -

${commonImports}

export ${step5}
`;

fs.writeFileSync(path.join(outDir, 'InterviewIntro.tsx'), step1Code);
fs.writeFileSync(path.join(outDir, 'InterviewSetup.tsx'), step2Code);
fs.writeFileSync(path.join(outDir, 'InterviewSession.tsx'), step3Code);
fs.writeFileSync(path.join(outDir, 'InterviewAnalyzing.tsx'), step4Code);
fs.writeFileSync(path.join(outDir, 'InterviewResults.tsx'), step5Code);

// Modify interview.tsx
const newInterviewTsx = `// HALAMAN: routes/interview.tsx
// FUNGSI: Halaman utama simulator wawancara AI yang membungkus komponen Step 1-5
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Step1 } from "../components/interview/InterviewIntro";
import { Step2 } from "../components/interview/InterviewSetup";
import { Step3 } from "../components/interview/InterviewSession";
import { Step4 } from "../components/interview/InterviewAnalyzing";
import { Step5 } from "../components/interview/InterviewResults";

export const Route = createFileRoute("/interview")({
  component: InterviewPage,
});

export function InterviewPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQ, setCurrentQ] = useState(1);
  const [vocationField, setVocationField] = useState("Pilih bidang pekerjaan...");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [resultData, setResultData] = useState<any>(null);

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
            vocationField={vocationField}
            setVocationField={setVocationField}
            setSessionId={setSessionId}
            setQuestionText={setQuestionText}
            setQuestionId={setQuestionId}
          />
        )}
        {currentStep === 3 && (
          <Step3
            key="step3"
            setStep={setCurrentStep}
            currentQ={currentQ}
            setCurrentQ={setCurrentQ}
            sessionId={sessionId}
            questionText={questionText}
            questionId={questionId}
            setQuestionText={setQuestionText}
            setQuestionId={setQuestionId}
          />
        )}
        {currentStep === 4 && <Step4 key="step4" setStep={setCurrentStep} sessionId={sessionId} setResultData={setResultData} />}
        {currentStep === 5 && (
          <Step5
            key="step5"
            setStep={setCurrentStep}
            setCurrentQ={setCurrentQ}
            navigate={navigate}
            isDark={isDark}
            toggleTheme={toggleTheme}
            resultData={resultData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
`;

fs.writeFileSync(filePath, newInterviewTsx);
console.log("Successfully split interview.tsx");
