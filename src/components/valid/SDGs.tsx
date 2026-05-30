// HALAMAN: C:\laragon\www\valid-react\src\components\valid\SDGs.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import sdgEdu from "@/assets/sdg-education.jpg";
import sdgWork from "@/assets/sdg-work.jpg";
import sdgEq from "@/assets/sdg-equality.jpg";
import evidence from "@/assets/evidence.jpg";
import impact from "@/assets/impact.jpg";

gsap.registerPlugin(ScrollTrigger);

export function SDGs() {
  const ref = useRef<HTMLElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Animations removed to prevent cards from getting stuck at opacity: 0
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="dampak"
      className="relative min-h-screen py-32 px-6 flex flex-col justify-center overflow-hidden bg-[var(--bg-a)] text-[var(--text-color)] transition-colors duration-500"
    >
      {/* Soft Premium Gradient Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[60vw] h-[60vw] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '11s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-wrap items-end justify-between gap-8 mb-20">
          <div>
            <div className="inline-block px-4 py-2 bg-[var(--card-bg)] border-2 border-[var(--border-color)] text-[var(--text-color)] rounded-full text-xs md:text-sm uppercase tracking-widest font-black shadow-[4px_4px_0px_var(--shadow-color)] transform -rotate-2 mb-6 transition-all duration-350">
              Dampak Nyata
            </div>
            <h2 
              className="text-[4rem] sm:text-[5rem] lg:text-[7rem] font-black uppercase text-[var(--text-color)] leading-[0.85] tracking-tighter" 
              style={{ fontFamily: "var(--font-impact)" }}
            >
              Selaras
              <span className="block text-blue-600 dark:text-blue-400 mt-2">SDGs.</span>
            </h2>
          </div>
          <div className="p-6 bg-[var(--card-bg)] border-2 border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] max-w-md transform rotate-1 transition-all duration-350">
            <p className="text-[var(--text-color)] text-lg md:text-xl font-bold font-body leading-relaxed">
              VALID dibangun bukan cuma buat profil, tapi juga buat dorong perubahan nyata di dunia kerja vokasi Indonesia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 grid-rows-2 gap-6 md:gap-8 auto-rows-fr">
          {/* Bento Cards */}
          <BentoCard className="col-span-6 md:col-span-3 row-span-2 min-h-[420px]" img={sdgEdu} sdg="04" title="Pendidikan Berkualitas" body="Bukti belajar yang bisa dipercaya jadi standar baru buat hasil pendidikan vokasi." color="bg-emerald-600" />
          <BentoCard className="col-span-6 md:col-span-3 min-h-[260px]" img={sdgWork} sdg="08" title="Pekerjaan Layak" body="Lebih banyak pekerja vokasi yang dapat akses ke peluang sesuai keahliannya." color="bg-blue-600" />
          <BentoCard className="col-span-6 md:col-span-2 min-h-[260px]" img={sdgEq} sdg="10" title="Kurangi Kesenjangan" body="Validasi yang adil, tanpa lihat asal sekolah." color="bg-rose-600" />
          <BentoCard className="col-span-6 md:col-span-1 min-h-[260px]" img={evidence} sdg="" title="Bukti Nyata" body="Bukan janji, tapi kerja." color="bg-amber-500" />
        </div>

        {/* Wide impact card below */}
        <div className="sdg-card mt-8 relative rounded-[2rem] border-[3px] md:border-4 border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] overflow-hidden min-h-[300px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[4px_4px_0px_var(--shadow-color)] group bg-[var(--card-bg)]">
          <img src={impact} alt="Dampak" loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-95 dark:opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--card-bg)] via-[var(--card-bg)]/70 to-transparent opacity-90 group-hover:opacity-85 transition-opacity duration-300" />
          <div className="relative p-10 md:p-14 text-[var(--text-color)] max-w-2xl h-full flex flex-col justify-center">
            <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-black tracking-widest uppercase mb-4 self-start border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] transition-all duration-350">
              Dampak Berlanjut
            </div>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none mb-6" style={{ fontFamily: "var(--font-impact)" }}>Dampak nyata untuk talenta dan industri.</h3>
            <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Semua bukti kerja, semua validasi ahli, semua hasil wawancara, jadi pondasi profil yang benar benar bisa diandalkan.
            </p>
          </div>
        </div>
      </div>

      {/* Wave transition to next dark section (Kontak) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-[40px] md:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C254.19,67.11,171.18,52,83,26.13,55.05,18,26.9,8.75,0,0V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="var(--bg-a)" />
        </svg>
      </div>
    </section>
  );
}

function BentoCard({
  className,
  img,
  sdg,
  title,
  body,
  color,
}: {
  className?: string;
  img: string;
  sdg: string;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div className={`sdg-card group relative rounded-[2rem] border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden bg-[var(--card-bg)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[4px_4px_0px_var(--shadow-color)] ${className}`}>
      <img src={img} alt={title} loading="eager" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-95 group-hover:opacity-90 dark:opacity-90 dark:group-hover:opacity-85" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/40 to-transparent opacity-85 group-hover:opacity-75 transition-opacity duration-300" />
      {sdg && (
        <div className="pointer-events-none absolute -top-8 -right-4 text-[16rem] leading-none text-[var(--text-color)] opacity-[0.06] font-black" style={{ fontFamily: "var(--font-impact)" }}>
          {sdg}
        </div>
      )}
      <div className="relative h-full flex flex-col justify-end p-8 text-[var(--text-color)]">
        {sdg && (
          <div className={`inline-flex items-center self-start px-4 py-1.5 rounded-full ${color} text-white text-xs font-black tracking-wider uppercase mb-4 border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] transform -rotate-2 transition-all duration-350`}>
            SDG {sdg}
          </div>
        )}
        <div className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight leading-none mb-3">{title}</div>
        <p className="text-[var(--text-muted)] text-sm md:text-base font-medium max-w-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}