import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ProofManifesto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 60%",
          end: "bottom center",
          toggleActions: "play none none reverse"
        }
      });

      tl.from(".pm-line > div", {
        yPercent: 120,
        rotationX: -10,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        transformOrigin: "0% 50% -50"
      })
      .from(".pm-highlight", {
        y: 40,
        duration: 1,
        ease: "expo.out"
      }, "-=0.6")
      .from(".pm-sub", {
        y: 20,
        duration: 1,
        ease: "power2.out"
      }, "-=0.8");

      gsap.to(".pm-bg-text", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        xPercent: -15,
        ease: "none"
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={ref} 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[var(--bg-a)] text-[var(--text-color)] py-24 transition-colors duration-500"
    >
      {/* Background large transparent text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] overflow-hidden">
        <h2 className="pm-bg-text whitespace-nowrap text-[25vw] font-display font-black tracking-tighter text-[var(--text-color)]">
          REAL SKILL NEEDS REAL PROOF
        </h2>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="font-display font-black text-[11vw] sm:text-[9vw] lg:text-[7rem] leading-[0.9] tracking-tighter uppercase text-[var(--text-color)] flex flex-col items-center">
          <div className="pm-line overflow-hidden"><div className="pb-2">YANG DILIHAT</div></div>
          <div className="pm-line overflow-hidden"><div className="pb-2">BUKAN CUMA</div></div>
          <div className="pm-line overflow-hidden"><div className="pb-2">KAMU BISA</div></div>
          <div className="pm-line overflow-hidden"><div className="pb-2 text-slate-500 dark:text-slate-400">NGOMONG APA</div></div>
        </div>

        <div className="mt-10 sm:mt-12 mb-8">
          <div className="pm-highlight inline-block bg-[var(--card-bg)] text-[var(--text-color)] border-2 border-[var(--border-color)] px-8 py-3 rounded-[2rem] shadow-[0_10px_40px_rgba(255,255,255,0.05)] dark:shadow-[0_10px_40px_rgba(37,99,235,0.15)] transition-all duration-350">
            <span className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase">
              TAPI BUKTINYA
            </span>
          </div>
        </div>

        <p className="pm-sub font-body text-base sm:text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl leading-relaxed font-medium">
          Karena skill yang nyata harus bisa dilihat, dijelasin, dan dipercaya sama industri.
        </p>
      </div>

      {/* Wave transition to next light section (Cara Kerja) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-[40px] md:h-[80px] transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="var(--bg-b)" />
        </svg>
      </div>
    </section>
  );
}
