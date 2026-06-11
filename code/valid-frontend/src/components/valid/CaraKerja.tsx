// HALAMAN: C:\laragon\www\valid-react\src\components\valid\CaraKerja.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CKMock } from "./CaraKerjaMocks";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "Kamu upload bukti kerja nyata",
    body: "Upload video, foto, proyek, atau hasil kerja yang memang nunjukin kamu pernah ngerjainnya.",
  },
  {
    n: "02",
    title: "AI ngobrol langsung sama kamu",
    body: "Sistem akan tanya jawab buat melihat seberapa paham kamu sama skill yang kamu klaim.",
  },
  {
    n: "03",
    title: "Ahli industri kasih validasi akhir",
    body: "Setelah itu profesional yang relevan akan menilai bukti kamu dan bantu bikin profilmu lebih dipercaya.",
  },
];

export function CaraKerja() {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const scrollWidth = horizontalRef.current?.scrollWidth || 0;
        const windowWidth = window.innerWidth;
        return scrollWidth - windowWidth;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      // Horizontal sliding translation
      tl.to(horizontalRef.current, {
        x: () => -getScrollAmount(),
        ease: "none"
      }, 0);

      // Parallax effect on step numbers and visuals during slide
      const panels = gsap.utils.toArray(".panel");
      panels.forEach((panel: any) => {
        const num = panel.querySelector(".step-number");
        const visual = panel.querySelector(".step-visual");

        if (num) {
          tl.to(num, {
            x: 80,
            ease: "none"
          }, 0);
        }

        if (visual) {
          tl.to(visual, {
            x: -100,
            rotationY: -10,
            ease: "none"
          }, 0);
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="cara-kerja" 
      className="relative w-full h-screen overflow-hidden bg-[var(--bg-b)] text-[var(--text-color)] transition-colors duration-500"
    >
      {/* Notebook Dot Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-20 dark:opacity-10" 
        style={{
          backgroundImage: `radial-gradient(circle at center, #64748b 1.5px, transparent 1.5px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* GSAP Floating Parallax Blobs for styling continuity */}
      <div className="absolute top-[10%] right-[20%] w-72 h-72 bg-blue-200/30 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-yellow-200/20 dark:bg-yellow-900/5 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      
      {/* Floating section title badge */}
      <div className="absolute top-8 left-6 md:top-14 md:left-16 z-20">
        <div className="px-4 py-2 bg-blue-600 rounded-full border-2 border-[var(--border-color)] inline-flex shadow-[3px_3px_0px_var(--shadow-color)] transform -rotate-1 transition-all duration-350">
          <span 
            className="text-xs md:text-sm font-black uppercase text-white tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Cara Kerja
          </span>
        </div>
      </div>

      {/* Horizontal Scroll wrapper */}
      <div 
        ref={horizontalRef} 
        className="flex flex-row flex-nowrap h-full"
        style={{ width: `${steps.length * 100}vw` }}
      >
        {steps.map((s, i) => (
          <div 
            key={i} 
            className="panel w-screen h-screen flex flex-col lg:flex-row items-center justify-center shrink-0 relative z-10"
          >
            {/* Left Side: Editorial Typography */}
            <div className="w-full lg:w-[55%] h-1/2 lg:h-full flex flex-col justify-center px-8 lg:px-24 pt-20 lg:pt-0 relative">
              {/* Massive background number */}
              <div 
                className="step-number absolute top-[10%] left-[5%] md:left-[10%] text-[15rem] md:text-[22rem] font-black leading-none text-[var(--text-color)] opacity-[0.06] select-none -z-10 tracking-tighter"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {s.n}
              </div>

              <h3 
                className="text-4xl md:text-6xl font-black text-[var(--text-color)] uppercase leading-[0.95] mb-6 tracking-tighter"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {s.title}
              </h3>
              <p className="text-base md:text-xl text-[var(--text-muted)] font-semibold leading-relaxed font-body max-w-xl">
                {s.body}
              </p>
            </div>

            {/* Right Side: Visual Mockups */}
            <div className="w-full lg:w-[45%] h-1/2 lg:h-full flex items-center justify-center pb-8 lg:pb-0" style={{ perspective: "1000px" }}>
              <div className="step-visual w-full max-w-sm md:max-w-md px-6">
                <CKMock index={i} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wave transition to next dark section (AI Interview) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-[40px] md:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="var(--bg-a)" />
        </svg>
      </div>
    </section>
  );
}
