const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'src/routes/interview.tsx');
const lines = fs.readFileSync(srcFile, 'utf8').split('\n');

const step1Start = 104; // line 105 (0-indexed)
const step2Start = 327; // line 328
const step3Start = 463; // line 464
const step4Start = 601; // line 602
const step5Start = 650; // line 651

const imports = `import { useState, useEffect } from "react";
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
];`;

const createStepFile = (name, startLine, endLine, apiReq = '-') => {
  const code = lines.slice(startLine, endLine).join('\n');
  const exportCode = code.replace('function ', 'export function ');
  
  const content = `// HALAMAN: src/components/interview/${name}.tsx
// FUNGSI: Komponen untuk fitur Interview AI
// API YANG DIBUTUHKAN: ${apiReq}
// DUMMY DATA: pertanyaan hardcoded (TODO)

${imports}

${exportCode}`;

  const dir = path.join(__dirname, 'src/components/interview');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${name}.tsx`), content);
};

createStepFile('InterviewIntro', step1Start, step2Start);
createStepFile('InterviewSetup', step2Start, step3Start);
createStepFile('InterviewSession', step3Start, step4Start);
createStepFile('InterviewAnalyzing', step4Start, step5Start);
createStepFile('InterviewResults', step5Start, lines.length);

const wrapperCode = `// HALAMAN: src/routes/interview.tsx
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

${lines.slice(5, 103).join('\n')}
`;

fs.writeFileSync(srcFile, wrapperCode);
console.log("Split successful!");
