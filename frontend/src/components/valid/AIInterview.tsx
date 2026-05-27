import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function AIInterview() {
  const sectionRef = useRef<HTMLElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text elements slide and fade in on scroll
      gsap.from(".ai-text-anim", {
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // 2. Mockup panel slides in from the right
      gsap.from(mockRef.current, {
        x: 80,
        rotation: 4,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // 3. Metric bars animate width from 0%
      gsap.from(".metric-bar-1", {
        width: "0%",
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: mockRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".metric-bar-2", {
        width: "0%",
        duration: 1.6,
        ease: "power4.out",
        scrollTrigger: {
          trigger: mockRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="wawancara-ai"
      className="relative py-28 md:py-36 overflow-hidden bg-[var(--bg-a)] text-[var(--text-color)] transition-colors duration-500"
    >
      {/* Notebook Dot Pattern Background (Dark Theme variant) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at center, #94a3b8 1.5px, transparent 1.5px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Parallax / Glowing Blob */}
      <div className="absolute top-[20%] right-[5%] w-80 h-80 bg-blue-600/15 dark:bg-blue-600/25 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
      <div className="absolute bottom-[10%] left-[20%] w-[32rem] h-[32rem] bg-indigo-900/10 dark:bg-indigo-900/30 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Columns: Text & Features */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Section Title Badge */}
          <div className="animate-text inline-flex px-4 py-2 bg-yellow-300 rounded-full border-2 border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] transform -rotate-1 mb-6 transition-all duration-350">
            <span
              className="text-xs font-black uppercase text-slate-900 tracking-widest"
              style={{ fontFamily: "var(--font-display)" }}
            >
              AI Interview
            </span>
          </div>

          <h2
            className="animate-text text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] font-black uppercase text-[var(--text-color)] leading-[0.85] tracking-tighter"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            AI yang <span className="text-yellow-500 dark:text-yellow-300">jujur</span>
            <br />
            sama kamu
          </h2>

          <p className="animate-text mt-8 text-[var(--text-muted)] text-base md:text-lg max-w-xl font-medium leading-relaxed font-body">
            VALID bukan cuma denger jawaban kamu. Sistem juga bantu baca cara kamu ngomong, fokus
            kamu, dan seberapa yakin kamu sama jawaban sendiri.
          </p>

          {/* Brutalist Styled List Items */}
          <div className="animate-text mt-10 space-y-4 w-full max-w-xl">
            {[
              "Kontak mata kebaca",
              "Suara dan jeda bicara dianalisis",
              "Laporan otomatis langsung jadi",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-6 p-4 bg-[var(--card-bg)] border-2 border-[var(--border-color)] rounded-2xl shadow-[4px_4px_0px_var(--shadow-color)] hover:border-blue-500 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 border-2 border-[var(--border-color)] flex items-center justify-center font-display font-black text-white text-lg shadow-[2px_2px_0px_var(--shadow-color)] group-hover:bg-yellow-300 group-hover:text-slate-900 transition-colors duration-300">
                  0{i + 1}
                </div>
                <div className="text-[var(--text-color)] text-lg font-bold font-body">{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Visual Mock */}
        <div ref={mockRef} className="lg:col-span-5">
          <InterviewMock />
        </div>
      </div>

      {/* Wave transition to next light section (BodyGood) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          className="relative block w-full h-[40px] md:h-[80px] transform rotate-180"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="var(--bg-b)"
          />
        </svg>
      </div>
    </section>
  );
}

function InterviewMock() {
  return (
    <div className="relative">
      {/* Backdrop brutalist glow */}
      <div className="absolute -inset-6 rounded-[2.5rem] opacity-20 dark:opacity-30 blur-3xl bg-blue-600 pointer-events-none -z-10" />

      {/* Main card */}
      <div className="w-full rounded-3xl p-6 bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] relative overflow-hidden transition-all duration-350">
        {/* Browser Traffic Lights */}
        <div className="flex items-center gap-1.5 mb-5 border-b-[3px] border-[var(--border-color)] pb-4">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[var(--border-color)]" />
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[var(--border-color)]" />
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--border-color)]" />
          <span
            className="text-xs font-black text-[var(--text-color)] uppercase tracking-widest ml-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI Interviewer
          </span>
        </div>

        {/* Metrics wrapper */}
        <div className="space-y-5">
          <Metric label="Kontak mata" value={86} className="metric-bar-1" />

          <Metric label="Kejernihan suara" value={72} className="metric-bar-2" />

          {/* Waveform */}
          <div>
            <div className="flex justify-between text-xs font-black text-[var(--text-muted)] uppercase tracking-wide mb-2">
              <span>Gelombang suara</span>
              <span>realtime</span>
            </div>
            <div className="flex items-center gap-1.5 h-16 bg-slate-950 border-[3px] border-[var(--border-color)] rounded-2xl p-4 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-full bg-yellow-300 border border-slate-950"
                  style={{
                    height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%`,
                    animation: `valid-wave 1.${(i % 9) + 1}s ease-in-out ${i * 0.05}s infinite`,
                    transformOrigin: "center",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="mt-6 flex items-start gap-4 p-4 rounded-2xl bg-rose-500/10 border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)]">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center text-white bg-rose-500 font-black text-sm shrink-0">
            !
          </div>
          <div>
            <div
              className="font-display font-black text-sm text-[var(--text-color)] uppercase leading-none"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              Terdeteksi sedikit gugup
            </div>
            <div className="text-[var(--text-muted)] font-semibold text-xs mt-2 leading-relaxed">
              Tarik napas, jawab dengan tenang. Tidak akan mengurangi nilai.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-black text-[var(--text-muted)] uppercase tracking-wide mb-2">
        <span>{label}</span>
        <span className="font-black text-[var(--text-color)]">{value}%</span>
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-950 border-[2.5px] border-[var(--border-color)] rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-blue-600 border-r-[2.5px] border-[var(--border-color)] transition-all duration-1000 ${className}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
