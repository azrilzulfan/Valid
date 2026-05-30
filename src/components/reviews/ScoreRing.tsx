// HALAMAN: komponen/reviews/ScoreRing
// FUNGSI: Menampilkan skor review dalam bentuk cincin progres melingkar
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { useState, useEffect } from 'react';

export function ScoreRing({ score }: { score: number }) {
  const [offset, setOffset] = useState(251.2); // 2 * PI * 40
  
  useEffect(() => {
    // Animate dashoffset after mount
    setTimeout(() => {
      setOffset(251.2 - (251.2 * score) / 100);
    }, 100);
  }, [score]);

  return (
    <div className="relative w-[120px] h-[120px] mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8" className="opacity-20" />
        <circle 
          cx="50" cy="50" r="40" fill="transparent" stroke="#16A34A" strokeWidth="8" 
          strokeDasharray="251.2"
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-black text-[32px] leading-none text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>{score}</span>
        <span className="font-bold text-[11px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>/100</span>
      </div>
    </div>
  );
}
