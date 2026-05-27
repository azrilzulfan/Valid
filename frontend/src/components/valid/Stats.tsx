import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileBadge, Paintbrush, TerminalSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: FileBadge,
    title: "Sertifikat Fiktif",
    desc: "Gelar dan sertifikat makin mudah dibeli atau didapat dari joki. Rekruter kehabisan waktu memvalidasi satu per satu.",
    color: "text-rose-500",
    bg: "bg-white",
  },
  {
    icon: Paintbrush,
    title: "Portofolio 'Pinjaman'",
    desc: "Banyak karya indah di portofolio yang ternyata sekadar template atau parahnya, hasil mencuri karya orang lain.",
    color: "text-amber-500",
    bg: "bg-white",
  },
  {
    icon: TerminalSquare,
    title: "Klaim Over-Promising",
    desc: "Menulis 'Expert' di CV sangat mudah. Namun ketika diuji dengan studi kasus nyata, pemahaman dasarnya seringkali nihil.",
    color: "text-blue-500",
    bg: "bg-white",
  },
];

export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal Scroll Timeline using dynamic functions for responsive calculations
      gsap.to(scrollWrapperRef.current, {
        x: () => {
          const scrollWidth = scrollWrapperRef.current?.scrollWidth || 0;
          const windowWidth = window.innerWidth;
          return -(scrollWidth - windowWidth);
        },
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => {
            const scrollWidth = scrollWrapperRef.current?.scrollWidth || 0;
            const windowWidth = window.innerWidth;
            return `+=${scrollWidth - windowWidth}`;
          },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="masalah"
      className="relative w-full h-screen overflow-hidden bg-[var(--bg-b)] text-[var(--text-color)] transition-colors duration-500"
    >
      {/* Smooth Gradient Transition from Hero */}
      <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-white dark:from-slate-900 to-transparent z-20 pointer-events-none" />

      {/* Soft Premium Gradient Background instead of dots */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-blue-100/60 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-rose-100/50 dark:bg-rose-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] bg-amber-50/50 dark:bg-slate-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse"
          style={{ animationDuration: "12s" }}
        />
      </div>

      {/* STICKY LEFT TITLE */}
      <div className="absolute top-0 left-0 h-full w-full md:w-[45vw] flex flex-col justify-start md:justify-center pt-28 md:pt-0 px-6 md:px-16 z-20 pointer-events-none">
        <h2
          className="text-[3.5rem] sm:text-[4.5rem] md:text-[5rem] lg:text-[6.5rem] font-black uppercase text-[var(--text-color)] leading-[0.85] tracking-tighter"
          style={{ fontFamily: "var(--font-impact)" }}
        >
          Semua bisa
          <br />
          nulis CV,
        </h2>

        <div className="mt-4 md:mt-8 px-5 py-3 md:px-6 md:py-4 bg-blue-600 rounded-[2rem] border-[3px] border-[var(--border-color)] inline-flex max-w-max transform -rotate-2 shadow-[4px_4px_0px_var(--shadow-color)] md:shadow-[6px_6px_0px_var(--shadow-color)] pointer-events-auto transition-all duration-350">
          <span
            className="text-lg md:text-3xl font-black uppercase text-white tracking-wide"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            tapi siapa yang buktiin?
          </span>
        </div>

        <p className="mt-8 md:mt-12 max-w-sm text-base md:text-lg text-[var(--text-color)] font-medium font-body leading-relaxed bg-[var(--card-bg)] p-5 rounded-2xl border-2 border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] hidden md:block pointer-events-auto transition-all duration-350">
          Klaim fiktif dan dokumen bodong membuat proses rekrutmen penuh keraguan. VALID hadir untuk
          memutus siklus ini.
        </p>
      </div>

      {/* GRADIENT OVERLAY (FADES OUT CARDS ON THE LEFT) */}
      <div className="absolute inset-y-0 left-0 z-15 pointer-events-none scroll-overlay" />
      <style>{`
        .scroll-overlay {
          width: 15vw;
          background: linear-gradient(to right, var(--bg-b) 0%, transparent 100%);
        }
        @media (min-width: 768px) {
          .scroll-overlay {
            width: 55vw;
            background: linear-gradient(to right, var(--bg-b) 0%, var(--bg-b) 72%, transparent 100%);
          }
        }
      `}</style>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
        {/* HORIZONTAL SCROLL WRAPPER */}
        <div
          ref={scrollWrapperRef}
          className="flex flex-row flex-nowrap h-full"
          style={{ width: `${problems.length * 100}vw` }}
        >
          {/* Starting spacer to offset cards to the right initially */}
          <div className="w-[100vw] md:w-[65vw] shrink-0 pointer-events-none" />

          {problems.map((p, i) => (
            <div
              key={i}
              className="w-[85vw] md:w-[50vw] shrink-0 flex items-center justify-center px-4 md:px-8 relative z-10"
            >
              {/* Non-AI design: Typographic, raw, editorial, no glassmorphism */}
              <div className="w-full relative flex flex-col justify-center max-w-2xl mx-auto group">
                {/* Massive background number - Made softer */}
                <div
                  className="absolute -top-10 md:-top-20 right-0 md:-right-10 text-[100px] md:text-[200px] font-black text-[var(--text-color)] opacity-[0.06] leading-none select-none -z-10 tracking-tighter transition-transform duration-700 group-hover:scale-110 group-hover:text-blue-500/20"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  0{i + 1}
                </div>

                <div className="flex flex-col gap-5 md:gap-6 items-start relative z-10 w-full">
                  {/* Quirky brutalist icon wrapper */}
                  <div
                    className={`p-4 md:p-5 rounded-[1.2rem] md:rounded-[1.5rem] border-2 md:border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] transform -rotate-3 ${p.bg} ${p.color} shrink-0 bg-[var(--card-bg)] transition-transform duration-500 group-hover:rotate-0 group-hover:-translate-y-1`}
                  >
                    <p.icon className="w-8 h-8 md:w-10 md:h-10 stroke-[2.5]" />
                  </div>

                  {/* Styled similar to sticky text description but readable */}
                  <div className="flex flex-col p-6 md:p-8 bg-[var(--card-bg)] rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] md:shadow-[8px_8px_0px_var(--shadow-color)] w-full transition-all duration-500 group-hover:shadow-[4px_4px_0px_var(--shadow-color)] group-hover:translate-y-1 group-hover:translate-x-1">
                    <h3 className="text-2xl md:text-4xl font-extrabold text-[var(--text-color)] uppercase leading-tight mb-3 md:mb-4 tracking-tight">
                      {p.title}
                    </h3>
                    <div className="w-12 md:w-16 h-1.5 md:h-2 bg-blue-600 mb-4 md:mb-5 rounded-full transition-all duration-500 group-hover:w-24" />
                    <p className="text-base md:text-xl text-[var(--text-muted)] font-medium leading-relaxed font-body">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Ending spacer to allow Card 3 to sit centered at the end */}
          <div className="w-[10vw] md:w-0 shrink-0 pointer-events-none" />
        </div>
      </div>

      {/* Wave transition to next dark section (ProofManifesto) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          className="relative block w-full h-[40px] md:h-[80px]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="var(--bg-a)"
          />
        </svg>
      </div>
    </section>
  );
}
