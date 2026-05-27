import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { User, CheckCircle2 } from "lucide-react";

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
        },
      });

      // Horizontal sliding translation
      tl.to(
        horizontalRef.current,
        {
          x: () => -getScrollAmount(),
          ease: "none",
        },
        0,
      );

      // Parallax effect on step numbers and visuals during slide
      const panels = gsap.utils.toArray(".panel");
      panels.forEach((panel: any) => {
        const num = panel.querySelector(".step-number");
        const visual = panel.querySelector(".step-visual");

        if (num) {
          tl.to(
            num,
            {
              x: 80,
              ease: "none",
            },
            0,
          );
        }

        if (visual) {
          tl.to(
            visual,
            {
              x: -100,
              rotationY: -10,
              ease: "none",
            },
            0,
          );
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
            <div
              className="w-full lg:w-[45%] h-1/2 lg:h-full flex items-center justify-center pb-8 lg:pb-0"
              style={{ perspective: "1000px" }}
            >
              <div className="step-visual w-full max-w-sm md:max-w-md px-6">
                <CKMock index={i} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Wave transition to next dark section (AI Interview) */}
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

function CKMock({ index }: { index: number }) {
  return (
    <div className="w-full relative" style={{ perspective: "1200px" }}>
      {index === 0 && <MockUpload />}
      {index === 1 && <MockInterview />}
      {index === 2 && <MockValidation />}
    </div>
  );
}

function MockUpload() {
  return (
    <div className="relative w-full">
      {/* Main Upload Card */}
      <div className="w-full rounded-3xl p-6 md:p-8 bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] relative z-10 overflow-hidden transition-all duration-350">
        {/* Browser Traffic Lights */}
        <div className="flex items-center gap-1.5 mb-6 border-b-[3px] border-[var(--border-color)] pb-4">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[var(--border-color)]" />
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[var(--border-color)]" />
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--border-color)]" />
          <span
            className="text-xs font-black text-[var(--text-color)] uppercase tracking-widest ml-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Upload Center
          </span>
        </div>

        <div className="border-[3px] border-dashed border-[var(--border-color)] rounded-2xl p-8 text-center bg-blue-500/5 dark:bg-blue-900/10 transition-all hover:bg-blue-500/10 duration-300">
          <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white text-3xl font-black bg-blue-600 border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] mb-4 animate-pulse">
            ↑
          </div>
          <div
            className="font-display font-black text-xl text-[var(--text-color)] uppercase tracking-tight"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            Tarik file ke sini
          </div>
          <div className="text-xs font-bold text-[var(--text-muted)] mt-1">
            Video, foto, dokumen, hingga 200MB
          </div>
        </div>

        {/* Padding placeholder for overflow cards */}
        <div className="h-28" />
      </div>

      {/* Floating File 1: Overlaps Bottom Right */}
      <div className="absolute bottom-6 left-4 right-4 bg-yellow-300 rounded-2xl p-4 border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] flex items-center gap-4 transition-all hover:scale-105 duration-300 transform rotate-[3deg] z-25">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white bg-slate-900 border-2 border-slate-900">
          MP4
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-black text-slate-900 mb-1">
            <span>demo_perbaikan.mp4</span>
            <span className="text-slate-900">100%</span>
          </div>
          <div className="h-2.5 bg-white border-2 border-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 border-r-2 border-slate-900"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Floating File 2: Overlaps Slightly Above File 1 */}
      <div className="absolute -bottom-8 left-10 right-2 bg-[var(--card-bg)] rounded-2xl p-4 border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] flex items-center gap-4 transition-all hover:scale-105 duration-300 transform rotate-[-2deg] z-30">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white bg-emerald-600 border-2 border-[var(--border-color)]">
          JPG
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-xs font-black text-[var(--text-color)] mb-1">
            <span>hasil_las.jpg</span>
            <span className="text-emerald-600">100%</span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-950 border-2 border-[var(--border-color)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 border-r-2 border-[var(--border-color)]"
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MockInterview() {
  return (
    <div className="w-full rounded-3xl p-6 bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] relative overflow-hidden transition-all duration-350">
      {/* Traffic Lights */}
      <div className="flex items-center gap-1.5 mb-4 border-b-[3px] border-[var(--border-color)] pb-4">
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

      {/* Main Video/Voice Screen */}
      <div className="aspect-video rounded-2xl border-[3px] border-[var(--border-color)] relative overflow-hidden flex flex-col items-center justify-center p-6 bg-slate-950">
        {/* Animated Neon Waveform */}
        <div className="flex items-center justify-center gap-2 h-16 w-full max-w-[200px]">
          <div
            className="w-2.5 bg-blue-500 rounded-full border border-slate-900"
            style={{ height: "45%", animation: "valid-wave 1.2s infinite ease-in-out" }}
          />
          <div
            className="w-2.5 bg-indigo-500 rounded-full border border-slate-900"
            style={{ height: "75%", animation: "valid-wave 1.2s infinite ease-in-out 0.2s" }}
          />
          <div
            className="w-2.5 bg-yellow-300 rounded-full border border-slate-900"
            style={{ height: "100%", animation: "valid-wave 1.2s infinite ease-in-out 0.4s" }}
          />
          <div
            className="w-2.5 bg-rose-500 rounded-full border border-slate-900"
            style={{ height: "60%", animation: "valid-wave 1.2s infinite ease-in-out 0.1s" }}
          />
          <div
            className="w-2.5 bg-emerald-400 rounded-full border border-slate-900"
            style={{ height: "80%", animation: "valid-wave 1.2s infinite ease-in-out 0.3s" }}
          />
        </div>

        {/* Live Red Dot Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-yellow-300 border-2 border-slate-900 px-3 py-1 rounded-full shadow-[2.5px_2.5px_0px_#000]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
          <span className="text-slate-950 text-[9px] font-black tracking-wider uppercase">
            Live Voice AI
          </span>
        </div>

        {/* Text Speech Bubble */}
        <div className="absolute bottom-4 left-4 right-4 text-slate-900 text-xs sm:text-sm bg-white border-2 border-slate-900 px-4 py-2.5 rounded-xl font-bold text-center shadow-[3px_3px_0px_#000]">
          "Coba ceritain proyek tersulit yang pernah kamu kerjain"
        </div>

        {/* Floating User Webcam thumbnail overlay */}
        <div className="absolute bottom-4 right-4 w-14 h-18 sm:w-16 sm:h-20 rounded-xl border-2 border-[var(--border-color)] bg-emerald-500/20 dark:bg-emerald-950/40 shadow-[3px_3px_0px_var(--shadow-color)] overflow-hidden hidden sm:flex items-center justify-center transform rotate-[-4deg]">
          <div className="w-full h-full flex flex-col items-center justify-center p-2">
            <User className="w-6 h-6 text-[var(--text-color)] mb-1 stroke-[2.5]" />
            <span className="text-[7px] font-black text-[var(--text-color)] uppercase">Ahmad</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MockValidation() {
  return (
    <div className="relative w-full">
      {/* Main Validation Dashboard */}
      <div className="w-full rounded-3xl p-6 md:p-8 bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] relative z-10 overflow-hidden transition-all duration-350">
        {/* Browser Traffic Lights */}
        <div className="flex items-center gap-1.5 mb-6 border-b-[3px] border-[var(--border-color)] pb-4">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-[var(--border-color)]" />
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[var(--border-color)]" />
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[var(--border-color)]" />
          <span
            className="text-xs font-black text-[var(--text-color)] uppercase tracking-widest ml-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Verification Desk
          </span>
        </div>

        {/* Validator Info */}
        <div className="flex items-center gap-4 mb-6 border-[3px] border-[var(--border-color)] bg-blue-500/5 dark:bg-blue-900/10 p-4 rounded-2xl shadow-[4px_4px_0px_var(--shadow-color)]">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center font-display font-black text-white text-base bg-blue-600">
            BS
          </div>
          <div>
            <div
              className="font-display font-black text-sm md:text-base text-[var(--text-color)] uppercase leading-none"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              Bagas Sutomo
            </div>
            <div className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider mt-1">
              Validator Otomotif
            </div>
          </div>

          {/* Badge check seal */}
          <div className="ml-auto flex items-center gap-1.5 bg-emerald-400 border-2 border-[var(--border-color)] px-3 py-1.5 rounded-full shadow-[2.5px_2.5px_0px_var(--shadow-color)] text-[9px] font-black text-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Certificate testimonial quote */}
        <div className="border-l-[6px] border-[var(--border-color)] pl-4 py-2 text-xs sm:text-sm text-[var(--text-color)] font-bold leading-relaxed italic bg-yellow-500/10 border-[3px] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] rounded-2xl mb-6">
          "Praktiknya rapi, paham diagnosa awal, layak masuk level menengah. Kandidat siap kerja."
        </div>

        {/* Asymmetrical Floating Score Badges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Teknik",
              score: "92",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-[var(--card-bg)]",
              rot: "rotate-[2deg]",
            },
            {
              label: "Komunikasi",
              score: "85",
              color: "text-indigo-600 dark:text-indigo-400",
              bg: "bg-[var(--card-bg)]",
              rot: "rotate-[-2deg]",
            },
            {
              label: "Skor Akhir",
              score: "A",
              color: "text-slate-950 dark:text-slate-900",
              bg: "bg-yellow-300",
              rot: "rotate-[3deg]",
            },
          ].map((r, i) => (
            <div
              key={i}
              className={`rounded-2xl py-3 border-[3px] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] transition-all hover:scale-105 duration-300 ${r.bg} ${r.rot} text-center`}
            >
              <div
                className={`font-display font-black text-2xl ${r.color}`}
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {r.score}
              </div>
              <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-1">
                {r.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
