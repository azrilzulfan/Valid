// HALAMAN: C:\laragon\www\valid-react\src\components\valid\UntukSiapa.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import worker from "@/assets/audience-worker.jpg";
import industry from "@/assets/audience-industry.jpg";
import training from "@/assets/audience-training.jpg";

gsap.registerPlugin(ScrollTrigger);

const items = [
  {
    img: worker,
    title: "Pekerja Vokasi",
    desc: "Biar skill kamu kelihatan, bukan cuma disebut.",
    big: "PEKERJA",
  },
  {
    img: industry,
    title: "Industri",
    desc: "Biar proses lihat kandidat jadi lebih yakin.",
    big: "INDUSTRI",
  },
  {
    img: training,
    title: "Lembaga Pelatihan",
    desc: "Biar hasil belajar peserta punya bukti yang lebih kuat.",
    big: "LEMBAGA",
  },
];

export function UntukSiapa() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading slide-up staggered
      gsap.from(".animate-us", {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        }
      });

      // 2. Cards entrance removed to prevent opacity bug
      // 3. Parallax effect on abstract contour waves in the background
      gsap.to(".contour-line", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={ref} 
      id="untuk-siapa" 
      className="relative py-28 md:py-36 px-6 overflow-hidden bg-[var(--bg-a)] text-[var(--text-color)] transition-colors duration-500"
    >
      {/* Glowing Mesh Auras */}
      <div className="absolute top-[20%] left-[-10%] w-[35rem] h-[35rem] bg-blue-600/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />

      {/* Abstract Contour Wave Lines (Custom Non-Dot, Non-Grid BG) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
        <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <path 
            className="contour-line"
            d="M-100,180 C300,80 500,380 800,280 C1100,180 1200,580 1640,480" 
            stroke="var(--primary)" 
            strokeWidth="2" 
            strokeDasharray="8 4" 
          />
          <path 
            className="contour-line"
            d="M-100,210 C300,110 500,410 800,310 C1100,210 1200,610 1640,510" 
            stroke="var(--primary)" 
            strokeWidth="1.5" 
          />
          <path 
            className="contour-line"
            d="M-100,240 C300,140 500,440 800,340 C1100,240 1200,640 1640,540" 
            stroke="var(--primary)" 
            strokeWidth="1" 
            strokeDasharray="4 4" 
          />

          <path 
            className="contour-line"
            d="M-100,480 C400,580 600,280 900,380 C1200,480 1300,180 1640,280" 
            stroke="rgb(234 179 8)" 
            strokeWidth="2" 
            strokeDasharray="6 6" 
          />
          <path 
            className="contour-line"
            d="M-100,510 C400,610 600,310 900,410 C1200,510 1300,210 1640,310" 
            stroke="rgb(234 179 8)" 
            strokeWidth="1.5" 
          />
          <path 
            className="contour-line"
            d="M-100,540 C400,640 600,340 900,440 C1200,540 1300,240 1640,340" 
            stroke="rgb(234 179 8)" 
            strokeWidth="1" 
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        
        {/* Section title badge */}
        <div className="animate-us inline-flex px-4 py-2 bg-yellow-300 rounded-full border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] transform -rotate-1 mb-8 transition-all duration-350">
          <span 
            className="text-xs font-black uppercase text-slate-900 tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Untuk Siapa
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="us-headline text-[3.5rem] sm:text-[5.5rem] lg:text-[6.5rem] font-black uppercase text-[var(--text-color)] leading-[0.85] tracking-tighter">
          <span className="block animate-us">Dibuat buat</span>
          <span className="block animate-us text-outline">yang serius</span>
          <span className="block animate-us text-blue-600 dark:text-blue-400">maju.</span>
        </h2>

        {/* Card Grid */}
        <div className="us-grid mt-16 grid md:grid-cols-3 gap-8">
          {items.map((it, i) => (
            <div
              key={i}
              className="us-card group relative rounded-[2rem] overflow-hidden bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] hover:border-blue-500 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={it.img}
                  alt={it.title}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 dark:opacity-90 group-hover:opacity-90 dark:group-hover:opacity-85"
                />
                {/* Visual shadow overlay */}
                <div 
                  className="absolute inset-0 opacity-85 group-hover:opacity-75 transition-opacity duration-300" 
                  style={{ background: "linear-gradient(180deg, transparent 35%, var(--card-bg) 100%)" }} 
                />
              </div>

              {/* Slide Number Badge */}
              <div className="absolute top-4 left-4 z-20 bg-[var(--card-bg)] border-2 border-[var(--border-color)] px-3 py-1 rounded-full text-[10px] tracking-[0.2em] font-black text-[var(--text-color)] uppercase shadow-sm">
                0{i + 1} / 03
              </div>

              {/* Card Copy */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-[var(--text-color)] z-20">
                <h3 
                  className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[var(--text-color)] mb-2 leading-none"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  {it.title}
                </h3>
                <p className="text-sm font-semibold text-[var(--text-muted)] max-w-xs font-body leading-relaxed">
                  {it.desc}
                </p>
              </div>

              {/* Giant Background Word Accents */}
              <div
                className="pointer-events-none absolute -top-8 -right-4 text-[9rem] font-black opacity-[0.04] text-[var(--text-color)] select-none leading-none tracking-tighter transition-transform duration-500 group-hover:translate-x-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {it.big.slice(0, 3)}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Wave transition to next light section (SDGs) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-[40px] md:h-[80px] transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="var(--bg-b)" />
        </svg>
      </div>
    </section>
  );
}