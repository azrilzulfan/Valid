const fs = require('fs');
const path = require('path');

function splitInterview() {
  const filePath = path.join(__dirname, 'src/routes/interview.tsx');
  const code = fs.readFileSync(filePath, 'utf-8');

  function extract(funcName) {
    const regex = new RegExp('function\\\\s+' + funcName + '\\\\s*\\\\([^)]*\\\\)\\\\s*\\\{');
    const match = code.match(regex);
    if (!match) return null;
    
    let startIndex = match.index;
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    let endIndex = -1;
    let bodyStarted = false;

    for (let i = startIndex; i < code.length; i++) {
        const char = code[i];
        const prevChar = i > 0 ? code[i - 1] : '';

        if ((char === '"' || char === "'" || char === "\") && prevChar !== '\\\\') {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (stringChar === char) {
                inString = false;
            }
        }

        if (!inString) {
            if (char === '{') {
                braceCount++;
                bodyStarted = true;
            }
            if (char === '}') {
                braceCount--;
                if (bodyStarted && braceCount === 0) {
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
  }

  const steps = [1,2,3,4,5].map(i => extract('Step' + i));
  const imports = \import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Mic, CheckCircle, ShieldCheck, XCircle, Sun, Moon, Maximize2, Minimize2, Video, StopCircle, RefreshCw } from "lucide-react";
import { interviewApi } from "../../lib/api";

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
];\;

  if (!fs.existsSync(path.join(__dirname, 'src/components/interview'))) {
      fs.mkdirSync(path.join(__dirname, 'src/components/interview'), {recursive: true});
  }

  steps.forEach((content, i) => {
    if(content) {
        let n = i + 1;
        const fileData = \// HALAMAN: src/components/interview/InterviewStep\.tsx
// FUNGSI: Komponen Step \ untuk wawancara AI
// API YANG DIBUTUHKAN: interviewApi
// DUMMY DATA: questions hardcoded (TODO)

\

export \
\;
        let name = '';
        if(n===1) name='InterviewIntro';
        if(n===2) name='InterviewSetup';
        if(n===3) name='InterviewSession';
        if(n===4) name='InterviewAnalyzing';
        if(n===5) name='InterviewResults';

        fs.writeFileSync(path.join(__dirname, 'src/components/interview/' + name + '.tsx'), fileData);
    }
  });

  // Now create the new interview.tsx
  const newInterview = \// HALAMAN: src/routes/interview.tsx
// FUNGSI: Halaman wrapper untuk Interview AI
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
        {currentStep === 1 && <Step1 key="step1" setStep={setCurrentStep} isDark={isDark} toggleTheme={toggleTheme} />}
        {currentStep === 2 && <Step2 key="step2" setStep={setCurrentStep} isDark={isDark} toggleTheme={toggleTheme} />}
        {currentStep === 3 && <Step3 key="step3" setStep={setCurrentStep} currentQ={currentQ} setCurrentQ={setCurrentQ} />}
        {currentStep === 4 && <Step4 key="step4" setStep={setCurrentStep} />}
        {currentStep === 5 && <Step5 key="step5" setStep={setCurrentStep} setCurrentQ={setCurrentQ} navigate={navigate} isDark={isDark} toggleTheme={toggleTheme} />}
      </AnimatePresence>
    </div>
  );
}
\;

  fs.writeFileSync(filePath, newInterview);
  console.log("Successfully split interview.tsx");
}

splitInterview();
