// HALAMAN: src/routes/interview.tsx
// FUNGSI: Halaman wrapper untuk Interview AI
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
  const [sessionId, setSessionId] = useState('');
  const [scores, setScores] = useState<any>(null);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark") || 
      (typeof window !== 'undefined' ? localStorage.getItem("theme") : null) === "dark" || 
      (typeof window !== 'undefined' && !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
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
    if (typeof window !== 'undefined') localStorage.setItem("theme", isDarkNow ? "dark" : "light");
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
            setSessionId={setSessionId}
          />
        )}
        {currentStep === 3 && (
          <Step3
            key="step3"
            setStep={setCurrentStep}
            currentQ={currentQ}
            setCurrentQ={setCurrentQ}
            sessionId={sessionId}
            setScores={setScores}
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
            scores={scores}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
