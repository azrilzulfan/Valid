import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BadgeCheck, ShieldCheck, FileBadge, Star, Award, GraduationCap } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // typography animation
      gsap.from(".hero-headline", { y: 60, opacity: 0, duration: 1, ease: "power3.out" });
      gsap.from(".hero-badge", { scale: 0.8, opacity: 0, rotation: -10, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" });
      gsap.from(".hero-sub", { y: 30, opacity: 0, duration: 0.8, delay: 0.5, ease: "power2.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, delay: 0.7, ease: "power2.out" });

      // floating items continuous bobbing
      const items = gsap.utils.toArray(".floating-item");
      items.forEach((item: any, i) => {
        gsap.to(item, {
          y: () => `+=${Math.random() * 40 + 20}`,
          x: () => `+=${Math.random() * 20 - 10}`,
          rotation: () => `+=${Math.random() * 20 - 10}`,
          duration: () => Math.random() * 3 + 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.2
        });
      });

      // floating items burst animation on scroll
      gsap.from(".floating-wrapper", {
        x: (i, el) => {
          const rect = el.getBoundingClientRect();
          return (window.innerWidth / 2) - (rect.left + rect.width / 2);
        },
        y: (i, el) => {
          const rect = el.getBoundingClientRect();
          return (window.innerHeight / 2) - (rect.top + rect.height / 2);
        },
        scale: 0,
        opacity: 0,
        rotation: () => Math.random() * 180 - 90,
        duration: 1.5,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ref.current,
          start: "top -10px", // Trigger slightly after scrolling starts
          toggleActions: "play none none reverse",
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  // Glassmorphic cards with icons to represent verification and skills
  const floatingItems = [
    { Icon: BadgeCheck, top: "5%", left: "8%", className: "rotate-[-15deg] blur-[2px] z-0 scale-110" },
    { Icon: ShieldCheck, top: "25%", left: "2%", className: "rotate-[10deg] blur-0 z-20 scale-125" },
    { Icon: FileBadge, bottom: "5%", left: "15%", className: "rotate-[25deg] blur-[4px] z-0" },
    { Icon: Award, top: "10%", right: "12%", className: "rotate-[25deg] blur-[3px] z-0 scale-90" },
    { Icon: Star, bottom: "20%", right: "5%", className: "rotate-[-15deg] blur-0 z-20 scale-110" },
    { Icon: GraduationCap, bottom: "5%", right: "25%", className: "rotate-[-30deg] blur-[5px] z-0 scale-75" },
  ];

  return (
    <>
      <section
        ref={ref}
        id="top"
        className="relative min-h-[100svh] flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden"
        style={{ background: "var(--gradient-sky)" }}
      >
        <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "var(--gradient-hero-aura)" }} />

        {/* Floating abstract items simulating volumetric objects */}
        {floatingItems.map((item, i) => (
          <div
            key={i}
            className={`floating-wrapper absolute z-0`}
            style={{ top: item.top, left: item.left, right: item.right, bottom: item.bottom }}
          >
            <div
              className={`floating-item flex items-center justify-center p-4 sm:p-6 rounded-[2rem] opacity-90 ${item.className}`}
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.4))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: "0 20px 40px rgba(37,99,235,0.15), inset 0 0 0 1px rgba(255,255,255,0.6), inset 2px 2px 5px rgba(255,255,255,0.8)",
              }}
            >
              <item.Icon 
                className="w-12 h-12 sm:w-20 sm:h-20 text-[var(--primary)]" 
                strokeWidth={1.5} 
                style={{ filter: "drop-shadow(0 4px 6px rgba(37,99,235,0.2))" }} 
              />
            </div>
          </div>
        ))}

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center mt-10">
          {/* HUGE HEADLINE */}
          <h1 
            className="hero-headline text-[16vw] sm:text-[14vw] md:text-[10rem] lg:text-[12rem] leading-none tracking-normal font-black"
            style={{ 
              fontFamily: "var(--font-impact)", 
              color: "var(--navy)",
              textTransform: "uppercase"
            }}
          >
            BUKTIKAN
          </h1>

          {/* OVERLAPPING BADGE */}
          <div 
            className="hero-badge relative -mt-6 sm:-mt-10 md:-mt-16 z-20 px-6 sm:px-12 py-2 sm:py-4 border-4 sm:border-[6px] shadow-xl"
            style={{ 
              backgroundColor: "var(--primary)",
              borderColor: "var(--card-bg)",
              transform: "rotate(-3deg)",
            }}
          >
            <h2 
              className="text-[9vw] sm:text-[7vw] md:text-[5rem] lg:text-[6rem] leading-none tracking-wide text-[var(--primary-foreground)] font-black"
              style={{ fontFamily: "var(--font-impact)", textTransform: "uppercase" }}
            >
              KEMAMPUANMU
            </h2>
          </div>

          {/* SUBHEADLINE */}
          <p 
            className="hero-sub mt-12 sm:mt-16 mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed font-semibold"
            style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-body)" }}
          >
            Bukan sekadar CV. Bukan sekadar nilai. VALID bantu kamu nunjukin kalau skill kamu memang nyata dan bisa dipercaya
          </p>

          {/* CTA BUTTON */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full relative z-30">
            <Link
              to="/interview"
              className="hero-cta group inline-flex items-center justify-center rounded-full px-10 py-4 font-bold text-sm sm:text-base uppercase tracking-wider transition-transform hover:-translate-y-0.5 shadow-[0_20px_50px_-15px_rgba(37,99,235,0.6)] text-white"
              style={{ 
                background: "linear-gradient(135deg, var(--primary), #1d4ed8)",
                fontFamily: "var(--font-body)"
              }}
            >
              MULAI VERIFIKASI
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#cara-kerja"
              className="hero-cta inline-flex items-center justify-center rounded-full px-10 py-4 font-bold text-sm sm:text-base uppercase tracking-wider border border-[var(--navy)]/15 bg-white/60 backdrop-blur transition-colors hover:bg-white text-[var(--navy)]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              LIHAT CARA KERJA
            </a>
          </div>
        </div>
      </section>
    </>
  );
}