import { motion, Variants } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';

const DUMMY_PROJECTS = [
  { title: "Mesin Las MIG Otomatis", tech: ["CNC", "PENGELASAN"], desc: "Merancang sistem otomasi mesin las MIG untuk meningkatkan presisi dan efisiensi produksi.", date: "Mei 2026" },
  { title: "Sistem Quality Control", tech: ["AUTOCAD", "QC"], desc: "Membangun prosedur quality control untuk lini produksi komponen otomotif.", date: "Apr 2026" },
  { title: "Desain Jig & Fixture", tech: ["AUTOCAD", "CNC"], desc: "Mendesain jig dan fixture untuk proses manufaktur presisi tinggi.", date: "Feb 2026" },
  { title: "Laporan Magang Industri", tech: ["DOKUMENTASI"], desc: "Dokumentasi lengkap pengalaman magang di PT Astra Manufacturing.", date: "Jan 2026" }
];

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

function ScoreRing({ score }: { score: number }) {
  const [offset, setOffset] = useState(251.2);
  
  useEffect(() => {
    setTimeout(() => {
      setOffset(251.2 - (251.2 * score) / 100);
    }, 100);
  }, [score]);

  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-[4px_4px_0px_#0f172a]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="white" stroke="#0f172a" strokeWidth="3" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border-color)" strokeWidth="8" className="opacity-20" />
        <circle 
          cx="50" cy="50" r="40" fill="transparent" stroke="#2563EB" strokeWidth="8" 
          strokeDasharray="251.2" strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-black text-[36px] leading-none text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>{score}</span>
        <span className="font-bold text-[12px] text-slate-500 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Rata-rata</span>
      </div>
    </div>
  );
}

export function PublicProfile() {
  const { username } = useParams({ from: '/p/$username' });
  const formattedName = username ? username.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'RIZKY PRATAMA';
  const initial = formattedName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg-a)] text-[var(--text-color)] font-sans flex flex-col">
      
      {/* PUBLIC NAVBAR - Marketing for VALID */}
      <nav className="fixed top-0 left-0 w-full h-[70px] bg-white border-b-[3px] border-slate-900 shadow-[0_4px_0px_#0f172a] z-50 flex items-center justify-between px-[20px] md:px-[40px]">
        <div className="flex items-center gap-[12px]">
          <img src="/logo.png" alt="VALID Logo" className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform" />
          <span className="hidden sm:block font-bold text-[13px] text-slate-500 uppercase tracking-widest mt-1" style={{ fontFamily: 'var(--font-body)' }}>Platform Portofolio Terverifikasi</span>
        </div>
        
        <button 
          onClick={() => window.location.href = '/register'}
          className="bg-blue-600 border-[2.5px] border-slate-900 text-white rounded-[1rem] px-[16px] py-[10px] font-black text-[11px] sm:text-[13px] uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-1 transition-all" style={{ fontFamily: 'var(--font-body)' }}
        >
          <span className="hidden sm:inline">Buat Portofoliomu</span><span className="sm:hidden">Daftar</span> <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* FLOATING BACKGROUND SHAPES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex justify-center">
        <div className="absolute top-[100px] left-[-100px] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[100px] right-[-100px] w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-[80px]" />
      </div>

      <div className="flex-1 w-full pt-[100px] pb-[80px] overflow-y-auto">
        <motion.div 
          className="max-w-[800px] mx-auto px-[20px] relative z-10 flex flex-col gap-[32px]"
          variants={pageVariants as any} initial="hidden" animate="visible"
        >
          
          {/* HERO PROFILE */}
          <motion.div variants={sectionVariants as any} className="bg-white border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] p-[32px] md:p-[48px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[120px] bg-gradient-to-r from-blue-600 to-indigo-600 border-b-[3px] border-slate-900" />
            
            <div className="relative flex flex-col md:flex-row gap-[32px] items-center md:items-start pt-[40px]">
              <div className="w-[140px] h-[140px] rounded-full border-[4px] border-slate-900 bg-yellow-400 flex items-center justify-center shadow-[6px_6px_0px_#0f172a] shrink-0 z-10">
                <span className="font-black text-[64px] text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>{initial}</span>
              </div>
              
              <div className="flex-1 text-center md:text-left z-10 mt-[20px] md:mt-0">
                <h1 className="font-black text-[40px] md:text-[48px] text-slate-900 uppercase leading-none tracking-tighter" style={{ fontFamily: 'var(--font-impact)' }}>{formattedName}</h1>
                <h2 className="font-bold text-[16px] md:text-[18px] text-slate-600 mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Fresh Graduate Teknik Mesin — SMK Negeri 1 Bandung</h2>
                
                <p className="font-bold text-[14px] text-slate-700 leading-relaxed mt-[20px] bg-blue-50 border-[2px] border-blue-200 p-[16px] rounded-[16px]" style={{ fontFamily: 'var(--font-body)' }}>
                  Saya adalah lulusan Teknik Mesin yang bersemangat dalam bidang manufaktur otomotif. Fokus utama saya adalah desain dengan AutoCAD dan operasional mesin CNC. Sedang mencari peluang untuk berkembang di industri.
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-[12px] mt-[24px]">
                  <button className="bg-slate-900 text-white rounded-[12px] px-[24px] py-[14px] font-black text-[13px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#64748B] hover:-translate-y-1 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                    Hubungi Saya
                  </button>
                  <button className="bg-white text-slate-900 rounded-[12px] px-[24px] py-[14px] font-black text-[13px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 transition-all flex items-center gap-2" style={{ fontFamily: 'var(--font-body)' }}>
                    Resume <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VERIFIED SKILLS & STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
            {/* Skills */}
            <motion.div variants={sectionVariants as any} className="md:col-span-2 bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-[24px] p-[32px] md:p-[40px]">
              <div className="inline-flex px-3 py-1 bg-green-100 border-[2px] border-green-500 rounded-full shadow-[2px_2px_0px_#22c55e] font-black text-[10px] uppercase tracking-widest text-green-700 mb-[16px]" style={{ fontFamily: 'var(--font-body)' }}>BNSP & AI VALIDATED</div>
              <h3 className="font-black text-[24px] md:text-[28px] text-slate-900 uppercase tracking-tight mb-[24px]" style={{ fontFamily: 'var(--font-impact)' }}>KOMPETENSI TERUJI</h3>
              
              <div className="flex flex-wrap gap-[12px]">
                {['Autodesk AutoCAD', 'SolidWorks', 'Operasi CNC', 'QC/QA', 'Pengelasan Dasar'].map((skill, i) => (
                  <div key={i} className="bg-slate-50 border-[2.5px] border-slate-900 rounded-[12px] px-[16px] py-[10px] flex items-center gap-[10px] shadow-[3px_3px_0px_#0f172a]">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-[14px] text-slate-800" style={{ fontFamily: 'var(--font-body)' }}>{skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Score */}
            <motion.div variants={sectionVariants as any} className="bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-[24px] p-[32px] flex flex-col items-center justify-center text-center">
              <ScoreRing score={88} />
              <div className="mt-[24px]">
                <div className="font-black text-[18px] text-slate-900 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-impact)' }}>Skor AI & Ahli</div>
                <div className="font-bold text-[12px] text-slate-500 mt-[4px]" style={{ fontFamily: 'var(--font-body)' }}>Berdasarkan 4 Review Simulasi</div>
              </div>
            </motion.div>
          </div>

          {/* PROJECTS TIMELINE */}
          <motion.div variants={sectionVariants as any} className="bg-white border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] p-[32px] md:p-[48px]">
            <div className="flex items-center gap-[12px] mb-[32px]">
              <div className="w-[48px] h-[48px] bg-yellow-400 border-[3px] border-slate-900 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
                <Zap className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="font-black text-[28px] md:text-[32px] text-slate-900 uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-impact)' }}>BUKTI KARYA</h3>
            </div>
            
            <div className="space-y-[32px] relative before:absolute before:inset-0 before:ml-[22px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[3px] before:bg-slate-200">
              {DUMMY_PROJECTS.map((project, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full border-[3px] border-slate-900 bg-white shadow-[3px_3px_0px_#0f172a] text-slate-900 group-[.is-active]:bg-blue-600 group-[.is-active]:text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  
                  <div className="w-[calc(100%-56px)] md:w-[calc(50%-40px)] bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all rounded-[16px] p-[24px]">
                    <div className="font-bold text-[11px] text-slate-400 uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>{project.date}</div>
                    <h4 className="font-black text-[20px] text-slate-900 uppercase tracking-tight mb-[12px] leading-tight" style={{ fontFamily: 'var(--font-impact)' }}>{project.title}</h4>
                    
                    <div className="flex flex-wrap gap-[8px] mb-[16px]">
                      {project.tech.map(t => (
                        <span key={t} className="bg-slate-100 text-slate-600 border-[2px] border-slate-200 rounded-md px-[10px] py-[4px] font-black text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>{t}</span>
                      ))}
                    </div>
                    
                    <p className="font-bold text-[13px] text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>{project.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FOOTER BADGE */}
          <motion.div variants={sectionVariants as any} className="flex justify-center mt-[40px] pb-[40px]">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-[12px] bg-slate-900 text-white px-[20px] py-[12px] rounded-full border-[3px] border-slate-900 shadow-[4px_4px_0px_#64748B]">
                <span className="font-bold text-[11px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Divalidasi menggunakan AI & Reviewer Manusia</span>
                <div className="w-[6px] h-[6px] rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="font-black text-[12px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Powered by</span>
                <img src="/logo.png" alt="VALID Logo" className="h-[24px] object-contain opacity-50 grayscale hover:grayscale-0 transition-all" />
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
