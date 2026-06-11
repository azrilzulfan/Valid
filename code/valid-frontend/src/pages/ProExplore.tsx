// HALAMAN: C:\laragon\www\valid-react\src\pages\ProExplore.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from 'framer-motion';
import { 
  LayoutDashboard, FolderOpen, Coins, LogOut, MessageSquare, Compass, 
  Search, Star, Award, ShieldCheck, ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { portfolioApi } from '../lib/api';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const CANDIDATES = [
  { id: 4, username: "SitiAminah", name: "Siti Aminah", role: "Software Engineer", skills: ["React", "TypeScript", "Node.js"], match: 92, avatar: "S", bg: "bg-blue-100", text: "text-blue-600" },
  { id: 5, username: "AhmadR", name: "Ahmad Rizqi", role: "UI/UX Designer", skills: ["Figma", "Prototyping", "User Research"], match: 88, avatar: "A", bg: "bg-yellow-100", text: "text-yellow-600" },
  { id: 6, username: "DewiK", name: "Dewi Kirana", role: "Data Analyst", skills: ["Python", "SQL", "Tableau"], match: 85, avatar: "D", bg: "bg-green-100", text: "text-green-600" },
  { id: 7, username: "Kurniawan", name: "Budi Kurniawan", role: "Marketing Specialist", skills: ["SEO", "Content Marketing", "Analytics"], match: 79, avatar: "B", bg: "bg-purple-100", text: "text-purple-600" },
];

export function ProExplore() {
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    portfolioApi.getPendingReviews().then(res => {
      setCandidates(res.portfolios || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex w-full h-screen bg-[#F0F4F8] overflow-hidden text-[var(--text-color)] font-sans">
      
      {/* SIDEBAR */}
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--card-bg)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-slate-900 flex md:flex-col z-50 md:z-auto transition-all shrink-0">
        
        {/* TOP: Logo */}
        <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[3px] border-slate-900 bg-yellow-300 items-center justify-between">
          <img src="/logo.png" alt="VALID Logo" className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform" />
          <div className="w-[10px] h-[10px] bg-green-500 rounded-full border-[2px] border-slate-900"></div>
        </div>

        {/* USER INFO */}
        <div className="hidden md:flex items-center gap-3 py-[20px] px-[24px] border-b-[3px] border-slate-900 bg-[var(--bg-a)]">
          <div className="w-[44px] h-[44px] rounded-[14px] border-[2.5px] border-slate-900 bg-purple-200 flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
            <span className="font-black text-[20px] text-purple-700" style={{ fontFamily: 'var(--font-impact)' }}>I</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[15px] text-[var(--text-color)] leading-tight tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>Ibrahim H.</span>
            <span className="font-bold text-[9px] uppercase tracking-widest text-slate-500 mt-1" style={{ fontFamily: 'var(--font-body)' }}>Reviewer Ahli</span>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 flex md:flex-col flex-row w-full justify-around md:justify-start md:px-[16px] md:py-[24px] gap-0 md:gap-[10px] items-center md:items-stretch h-full overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: 'Beranda Pro', path: '/pro/dashboard' },
            { icon: Compass, label: 'Jelajah Kandidat', active: true, path: '/pro/explore' },
            { icon: MessageSquare, label: 'Permintaan Review', path: '/pro/requests' },
            { icon: Coins, label: 'Penghasilan', path: '/pro/earnings' },
            { icon: FolderOpen, label: 'Riwayat', path: '/pro/history' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => item.path && navigate({ to: item.path })}
              className={`group flex md:flex-row flex-col items-center gap-1 md:gap-[14px] px-3 md:px-[18px] py-2 md:py-[12px] rounded-[1rem] cursor-pointer transition-all duration-300 relative ${
                item.active 
                  ? 'md:bg-slate-900 text-slate-900 md:text-white md:border-[2.5px] md:border-slate-900 md:shadow-[4px_4px_0px_#FBBF24] md:-translate-y-0.5' 
                  : 'text-slate-500 hover:text-slate-900 md:border-[2.5px] md:border-transparent md:hover:border-slate-900 md:hover:shadow-[4px_4px_0px_#0f172a] md:hover:-translate-y-0.5 md:hover:bg-white'
              }`}
            >
              <item.icon className={`w-[22px] h-[22px] md:w-[20px] md:h-[20px] transition-transform ${item.active ? 'md:scale-110' : 'group-hover:scale-110'}`} strokeWidth={item.active ? 2.5 : 2} />
              <span className={`text-[9px] md:text-[13px] uppercase tracking-wider ${item.active ? 'font-black' : 'font-bold'}`} style={{ fontFamily: 'var(--font-body)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* BOTTOM: Logout */}
        <div className="hidden md:flex flex-col p-[24px] border-t-[3px] border-slate-900 bg-[var(--bg-a)]">
          <div onClick={() => window.location.href = '/'} className="flex items-center justify-center gap-2 cursor-pointer group px-3 py-3 border-[2.5px] border-transparent hover:border-slate-900 rounded-xl transition-all hover:bg-white hover:shadow-[4px_4px_0px_#0f172a]">
            <LogOut className="w-[18px] h-[18px] text-slate-500 group-hover:text-red-500 transition-colors" />
            <span className="font-black text-[12px] uppercase tracking-widest text-slate-500 group-hover:text-red-500 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>Keluar</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto relative pb-[100px] md:pb-[40px]">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

        <motion.div 
          className="p-[20px_16px] md:p-[40px_48px] max-w-[1200px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          {/* HEADER & SEARCH */}
          <motion.div variants={sectionVariants} className="mb-[40px] flex flex-col lg:flex-row lg:items-end justify-between gap-[24px]">
            <div>
              <div className="inline-flex px-3 py-1 bg-yellow-100 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 mb-[16px] shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>
                EKSPLORASI KANDIDAT
              </div>
              <h1 className="font-black text-[36px] md:text-[52px] text-slate-900 leading-[0.9] tracking-tighter uppercase mb-2" style={{ fontFamily: 'var(--font-impact)' }}>
                TEMUKAN BAKAT.
              </h1>
              <p className="font-bold text-[14px] md:text-[16px] text-slate-600 max-w-[600px] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Jelajahi profil pencari kerja dan berikan *Review Sukarela* untuk membantu mereka berkembang tanpa memungut koin.
              </p>
            </div>
            
            <div className="relative w-full lg:w-[400px]">
              <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari posisi, skill, atau nama..."
                className="w-full bg-white border-[3px] border-slate-900 rounded-[1rem] py-[14px] pl-[48px] pr-[16px] font-bold text-[14px] text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_#FBBF24] transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
          </motion.div>

          {/* CANDIDATES GRID */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
            {(candidates.length > 0 ? candidates : CANDIDATES).filter((c: any) => 
              (c.name || c.title || '').toLowerCase().includes(search.toLowerCase()) || 
              (c.role || c.vocationField || '').toLowerCase().includes(search.toLowerCase())
            ).map((candidate: any, idx) => (
              <div key={candidate.id || candidate._id || idx} className="bg-white border-[3px] border-slate-900 rounded-[1.5rem] p-[24px] shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0f172a] transition-all duration-300 flex flex-col group">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-[20px]">
                  <div className={`w-[64px] h-[64px] rounded-[16px] border-[2.5px] border-slate-900 ${candidate.bg || 'bg-blue-100'} flex items-center justify-center shadow-[3px_3px_0px_#0f172a] group-hover:scale-105 transition-transform`}>
                    <span className={`font-black text-[28px] ${candidate.text || 'text-blue-600'}`} style={{ fontFamily: 'var(--font-impact)' }}>{candidate.avatar || (candidate.title || candidate.name || 'U')[0].toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 border-[2px] border-yellow-400 rounded-full">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="font-black text-[10px] text-yellow-700 tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>{candidate.match || candidate.aiScores?.overall || 0}% MATCH</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-[20px]">
                  <h3 className="font-black text-[22px] text-slate-900 uppercase tracking-tight leading-none mb-1" style={{ fontFamily: 'var(--font-impact)' }}>{candidate.name || candidate.title}</h3>
                  <p className="font-bold text-[12px] text-slate-500 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-body)' }}>{candidate.role || candidate.vocationField}</p>
                  <div className="flex flex-wrap gap-2">
                    {(candidate.skills || ['Menunggu Data']).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 border-[2px] border-slate-200 rounded-md font-bold text-[9px] uppercase tracking-widest text-slate-600" style={{ fontFamily: 'var(--font-body)' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t-[2.5px] border-dashed border-slate-200">
                  <button 
                    onClick={() => navigate({ to: `/p/${candidate.username || candidate.uid || 'unknown'}` })}
                    className="flex-1 bg-[var(--bg-a)] hover:bg-slate-100 text-slate-900 rounded-xl py-[12px] px-2 font-black text-[10px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-all text-center" 
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Lihat Profil
                  </button>
                  <button 
                    onClick={() => navigate({ to: `/pro/review/${candidate.id || candidate.portfolioId || candidate._id}` })}
                    className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-[12px] px-2 font-black text-[10px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-1" 
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Review Sukarela <ChevronRight className="w-3 h-3" />
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
