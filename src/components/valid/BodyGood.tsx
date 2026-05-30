// HALAMAN: C:\laragon\www\valid-react\src\components\valid\BodyGood.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  { k: "Komunikasi", v: "82" },
  { k: "Problem Solving", v: "76" },
  { k: "Kedisiplinan", v: "88" },
  { k: "Ketelitian", v: "80" },
  { k: "Adaptasi Kerja", v: "74" },
  { k: "Kepercayaan Profil", v: "94" },
];

export function BodyGood() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Title and paragraph entrance
      gsap.from(".animate-body-text", {
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        }
      });

      // 2. Table container entrance
      gsap.from(".bg-rows-container", {
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".bg-rows-container",
          start: "top 80%",
        }
      });

      // 3. Staggered progress bar filling animation
      gsap.from(".metric-bar", {
        width: "0%",
        duration: 1.5,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".bg-rows-container",
          start: "top 75%",
        }
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={ref} 
      id="solusi"
      className="relative py-28 md:py-36 px-6 overflow-hidden bg-[var(--bg-b)] text-[var(--text-color)] transition-colors duration-500"
    >
      {/* Soft Premium Gradient Background instead of dots */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[var(--bg-b)]">
        <div className="absolute top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-rose-100/40 dark:bg-rose-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section title badge */}
        <div className="animate-body-text inline-flex px-4 py-2 bg-blue-600 rounded-full border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] transform -rotate-1 mb-8 transition-all duration-350">
          <span 
            className="text-xs font-black uppercase text-white tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pola Skill Terbaca
          </span>
        </div>

        {/* Heading Grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <h2 
              className="animate-body-text text-[4rem] sm:text-[6rem] lg:text-[7rem] font-black uppercase text-[var(--text-color)] leading-[0.85] tracking-tighter" 
              style={{ fontFamily: "var(--font-impact)" }}
            >
              <span className="block">Bukan</span>
              <span className="block pl-[10%] text-blue-600">cuma</span>
              <span className="block text-outline font-black">skill list.</span>
            </h2>
          </div>
          
          <div className="lg:col-span-5 lg:pt-14">
            <p className="animate-body-text text-base md:text-xl text-[var(--text-color)] font-semibold leading-relaxed font-body max-w-lg">
              Yang bikin orang percaya itu bukan daftar skill yang panjang. Yang bikin percaya itu bukti, cara kamu jelasin kerjaanmu, dan pola kemampuan yang kebaca jelas.
            </p>
          </div>
        </div>

        {/* Clean Brutalist Progress Table */}
        <div className="bg-rows-container mt-16 bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-3xl overflow-hidden transition-all duration-350">
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-12 items-center py-5 px-6 md:px-8 border-b-2 last:border-b-0 border-[var(--border-color)] transition-colors hover:bg-[var(--card-bg-hover)]"
            >
              {/* Index Column */}
              <div className="col-span-1 font-mono text-xs md:text-sm font-bold text-[var(--text-muted)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              
              {/* Skill Name */}
              <div 
                className="col-span-5 sm:col-span-4 font-display font-black text-lg md:text-2xl text-[var(--text-color)] uppercase tracking-tight" 
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {r.k}
              </div>
              
              {/* Progress Channel */}
              <div className="hidden sm:block col-span-4 px-4">
                <div className="h-3.5 bg-slate-100 dark:bg-slate-950 border-2 border-[var(--border-color)] rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="metric-bar h-full rounded-full bg-blue-600 border-r-2 border-[var(--border-color)] transition-all" 
                    style={{ width: `${r.v}%` }} 
                  />
                </div>
              </div>
              
              {/* Metric Percentage */}
              <div className="col-span-6 sm:col-span-3 text-right">
                <span className="text-xs font-bold text-[var(--text-muted)] mr-2 uppercase tracking-wider">hingga</span>
                <span 
                  className="font-display font-black text-2xl md:text-3xl text-blue-600 dark:text-blue-400" 
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  {r.v}%
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Wave transition to next dark section (UntukSiapa) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-[40px] md:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="var(--bg-a)" />
        </svg>
      </div>
    </section>
  );
}