// HALAMAN: C:\laragon\www\valid-react\src\pages\Explore.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Mic, Star, Users, Coins, LogOut, Search, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { UserSidebar } from '../components/valid/UserSidebar';
import { dashboardApi } from '../lib/api';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const DUMMY_STRANGERS = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    headline: "Junior Web Developer",
    avatar: "A",
    color: "bg-blue-400",
    verifiedSkills: ["REACT", "TAILWIND CSS"],
    otherSkills: ["NODE.JS"],
    topProject: "Sistem Manajemen Apotek",
    score: 82
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    headline: "Graphic Designer & Illustrator",
    avatar: "S",
    color: "bg-pink-400",
    verifiedSkills: ["ADOBE ILLUSTRATOR", "UI/UX"],
    otherSkills: ["PHOTOSHOP"],
    topProject: "Redesign Aplikasi M-Banking",
    score: 88
  },
  {
    id: 3,
    name: "Bagas Pratama",
    headline: "Teknisi Jaringan & Cloud",
    avatar: "B",
    color: "bg-green-400",
    verifiedSkills: ["CISCO", "AWS"],
    otherSkills: ["LINUX"],
    topProject: "Setup Jaringan Kantor 3 Lantai",
    score: 75
  },
  {
    id: 4,
    name: "Dinda Kirana",
    headline: "Content Creator & Copywriter",
    avatar: "D",
    color: "bg-yellow-400",
    verifiedSkills: ["COPYWRITING", "SEO"],
    otherSkills: ["TIKTOK ADS"],
    topProject: "Campaign Sosmed Valid 2026",
    score: 91
  }
];

export function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    dashboardApi.getStats().then(res => {
      setStats(res.stats);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        
        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
        </div>

        <motion.div 
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1200px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          
          {/* HEADER */}
          <motion.div variants={sectionVariants} className="mb-[32px]">
            <div className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_var(--shadow-color)] font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-[12px]" style={{ fontFamily: 'var(--font-body)' }}>
              EKSPLORASI
            </div>
            <div className="font-black text-[36px] md:text-[44px] text-[var(--text-color)] leading-[0.9] tracking-tighter mt-1 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>JELAJAH PORTOFOLIO</div>
            <p className="font-bold text-[14px] text-[var(--text-muted)] mt-[12px] max-w-[500px]" style={{ fontFamily: 'var(--font-body)' }}>
              Temukan dan lihat karya dari ribuan pencari kerja lainnya yang telah diverifikasi oleh AI dan Profesional.
            </p>
            
            {stats && (
              <div className="flex gap-4 mt-6">
                <div className="bg-[var(--card-bg)] border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-xl px-4 py-2">
                  <div className="font-black text-[20px] text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>{stats.totalCandidates || 0}</div>
                  <div className="font-bold text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Kandidat</div>
                </div>
                <div className="bg-[var(--card-bg)] border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-xl px-4 py-2">
                  <div className="font-black text-[20px] text-green-600" style={{ fontFamily: 'var(--font-impact)' }}>{stats.approvedPortfolios || 0}</div>
                  <div className="font-bold text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Portofolio</div>
                </div>
                <div className="bg-[var(--card-bg)] border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-xl px-4 py-2">
                  <div className="font-black text-[20px] text-yellow-500" style={{ fontFamily: 'var(--font-impact)' }}>{stats.badgesIssued || 0}</div>
                  <div className="font-bold text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Badge</div>
                </div>
              </div>
            )}
          </motion.div>

          {/* SEARCH & FILTERS */}
          <motion.div variants={sectionVariants} className="flex flex-col md:flex-row gap-[16px] mb-[40px]">
            <div className="flex-1 relative">
              <div className="absolute left-[20px] top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Cari skill (contoh: AutoCAD, React, Copywriting)..." 
                className="w-full bg-[var(--card-bg)] border-[3px] border-slate-900 rounded-[1.5rem] pl-[54px] pr-[20px] py-[16px] font-bold text-[15px] text-[var(--text-color)] focus:outline-none focus:shadow-[6px_6px_0px_#0f172a] shadow-[4px_4px_0px_var(--shadow-color)] transition-all placeholder:text-slate-400" 
                style={{ fontFamily: 'var(--font-body)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-yellow-300 border-[3px] border-slate-900 text-slate-900 rounded-[1.5rem] px-[32px] py-[16px] font-black text-[13px] uppercase tracking-widest shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all whitespace-nowrap" style={{ fontFamily: 'var(--font-body)' }}>
              Cari Portofolio
            </button>
          </motion.div>

          {/* GRID GALLERY */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            {DUMMY_STRANGERS.map((person) => (
              <div key={person.id} className="bg-[var(--card-bg)] border-[3px] border-slate-900 rounded-[2rem] p-[24px] md:p-[32px] shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 transition-all flex flex-col md:flex-row gap-[24px]">
                
                {/* Avatar & Score */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-[80px] h-[80px] rounded-full border-[3px] border-slate-900 ${person.color} flex items-center justify-center shadow-[4px_4px_0px_#0f172a] mb-[16px]`}>
                    <span className="font-black text-[36px] text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>{person.avatar}</span>
                  </div>
                  <div className="bg-white border-[2px] border-slate-900 rounded-xl px-3 py-1 flex flex-col items-center shadow-[2px_2px_0px_#0f172a]">
                    <span className="font-black text-[20px] leading-none text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>{person.score}</span>
                    <span className="font-bold text-[8px] uppercase tracking-widest text-slate-500" style={{ fontFamily: 'var(--font-body)' }}>Skor AI</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{person.name}</h3>
                      <p className="font-bold text-[13px] text-[var(--text-muted)] mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>{person.headline}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-[8px] mt-[16px]">
                    {person.verifiedSkills.map(skill => (
                      <span key={skill} className="bg-blue-100 border-[2px] border-blue-600 text-blue-700 rounded-full px-[10px] py-[4px] font-black text-[9px] uppercase tracking-widest shadow-[1px_1px_0px_#2563EB] flex items-center gap-1" style={{ fontFamily: 'var(--font-body)' }}>
                        <CheckCircle2 className="w-3 h-3" /> {skill}
                      </span>
                    ))}
                    {person.otherSkills.map(skill => (
                      <span key={skill} className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] text-[var(--text-muted)] rounded-full px-[10px] py-[4px] font-black text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Top Project Snippet */}
                  <div className="mt-[20px] p-[16px] bg-blue-50/50 dark:bg-blue-900/10 border-[2px] border-dashed border-blue-300 rounded-[1rem] flex-1">
                    <span className="font-black text-[9px] uppercase tracking-widest text-blue-600 block mb-[4px]" style={{ fontFamily: 'var(--font-body)' }}>Proyek Unggulan</span>
                    <span className="font-bold text-[13px] text-[var(--text-color)] line-clamp-1" style={{ fontFamily: 'var(--font-body)' }}>{person.topProject}</span>
                  </div>

                  {/* Action */}
                  <button onClick={() => window.open(`/p/${person.name.toLowerCase().replace(/ /g, '-')}`, '_blank')} className="mt-[16px] w-full bg-slate-900 text-white rounded-[1rem] px-[20px] py-[12px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#64748B] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#64748B] transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                    Lihat Profil <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}
