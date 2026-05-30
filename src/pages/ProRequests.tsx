// HALAMAN: C:\laragon\www\valid-react\src\pages\ProRequests.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from 'framer-motion';
import { 
  LayoutDashboard, FolderOpen, Coins, LogOut, MessageSquare, Compass, 
  Search, ChevronRight, CheckCircle2, Briefcase, Filter
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const INCOMING_REQUESTS = [
  { id: 1, name: "Budi Santoso", role: "Quality Control", date: "25 Mei 2026", status: "Menunggu", message: "Mohon direview fokus pada detail komunikasi saya ya pak, terima kasih." },
  { id: 2, name: "Ayu Lestari", role: "Teknisi Mesin", date: "24 Mei 2026", status: "Menunggu", message: "Saya baru mencoba wawancara pertama kali." },
  { id: 8, name: "Dimas Anggara", role: "Welder 3G", date: "25 Mei 2026", status: "Menunggu", message: "Portofolio pengelasan saya sudah diupdate." },
  { id: 3, name: "Fajar Nugraha", role: "Drafter AutoCAD", date: "23 Mei 2026", status: "Selesai", score: 85, message: "Terima kasih atas reviewnya." },
];

export function ProRequests() {
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

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
            { icon: Compass, label: 'Jelajah Kandidat', path: '/pro/explore' },
            { icon: MessageSquare, label: 'Permintaan Review', active: true, path: '/pro/requests' },
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
          {/* HEADER */}
          <motion.div variants={sectionVariants} className="mb-[40px] flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[24px]">
            <div>
              <div className="inline-flex px-3 py-1 bg-blue-100 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 mb-[16px] shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>
                DAFTAR ANTREAN
              </div>
              <h1 className="font-black text-[36px] md:text-[52px] text-slate-900 leading-[0.9] tracking-tighter uppercase mb-2" style={{ fontFamily: 'var(--font-impact)' }}>
                PERMINTAAN REVIEW.
              </h1>
              <p className="font-bold text-[14px] md:text-[16px] text-slate-600 max-w-[600px] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Kandidat-kandidat ini sedang menunggu *feedback* darimu. Selesaikan review untuk mendapatkan koin.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau posisi..."
                  className="w-full bg-white border-[3px] border-slate-900 rounded-[1rem] py-[12px] pl-[48px] pr-[16px] font-bold text-[13px] text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_#0f172a] transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                />
              </div>
              <button className="bg-white border-[3px] border-slate-900 rounded-[1rem] px-[16px] py-[12px] flex items-center gap-2 hover:bg-slate-50 transition-colors w-full sm:w-auto shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a]">
                <Filter className="w-4 h-4" />
                <span className="font-black text-[11px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Filter</span>
              </button>
            </div>
          </motion.div>

          {/* TABS */}
          <motion.div variants={sectionVariants} className="flex bg-white border-[3px] border-slate-900 rounded-[1rem] p-1.5 shadow-[4px_4px_0px_#0f172a] mb-[24px] max-w-fit">
            {['Semua', 'Menunggu', 'Selesai'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-[0.5rem] font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {tab}
              </button>
            ))}
          </motion.div>

          {/* LIST */}
          <motion.div variants={sectionVariants} className="bg-white border-[3px] border-slate-900 rounded-[1.5rem] shadow-[6px_6px_0px_#0f172a] overflow-hidden">
            <div className="divide-y-[3px] divide-slate-900 flex flex-col">
              {INCOMING_REQUESTS.filter(req => (activeTab === 'Semua' || req.status === activeTab) && req.name.toLowerCase().includes(search.toLowerCase())).map((req) => (
                <div key={req.id} className="p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-[56px] h-[56px] rounded-[16px] border-[3px] border-slate-900 bg-blue-100 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#0f172a]">
                      <span className="font-black text-[24px] text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>{req.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                        <h3 className="font-black text-[18px] text-slate-900 uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>{req.name}</h3>
                        {req.status === 'Menunggu' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 border-[2px] border-yellow-500 text-yellow-700 rounded-full font-black text-[9px] uppercase tracking-widest self-start" style={{ fontFamily: 'var(--font-body)' }}>
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            Menunggu
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 border-[2px] border-green-600 text-green-700 rounded-full font-black text-[9px] uppercase tracking-widest self-start" style={{ fontFamily: 'var(--font-body)' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            Selesai
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="font-bold text-[11px] text-slate-600 tracking-widest flex items-center gap-1 uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                          <Briefcase className="w-3 h-3" /> {req.role}
                        </span>
                        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                        <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Diminta: {req.date}</span>
                      </div>
                      
                      <div className="bg-blue-50 border-[2px] border-dashed border-blue-200 rounded-lg p-3 inline-block w-full max-w-2xl">
                        <p className="font-bold text-[12px] text-slate-700 italic leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                          "{req.message}"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col items-center justify-end gap-3 shrink-0 mt-4 md:mt-0">
                    {req.status === 'Menunggu' ? (
                      <button 
                        onClick={() => navigate({ to: `/pro/review/${req.id}` })}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-[24px] py-[14px] font-black text-[12px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center" 
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Mulai Review <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate({ to: `/pro/review/${req.id}` })}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl px-[24px] py-[14px] font-black text-[12px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-1 transition-all flex items-center gap-2 w-full md:w-auto justify-center" 
                        style={{ fontFamily: 'var(--font-body)' }}
                      >
                        Lihat Ulasan
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {INCOMING_REQUESTS.filter(req => (activeTab === 'Semua' || req.status === activeTab) && req.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                <div className="p-[60px] text-center bg-slate-50">
                  <div className="w-[80px] h-[80px] bg-white rounded-full border-[3px] border-slate-200 mx-auto flex items-center justify-center mb-4 shadow-[4px_4px_0px_#f1f5f9]">
                    <MessageSquare className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="font-black text-[20px] text-slate-400 uppercase tracking-tighter mb-1" style={{ fontFamily: 'var(--font-impact)' }}>KOSONG</h3>
                  <div className="font-bold text-[12px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Tidak ada permintaan review ditemukan</div>
                </div>
              )}
            </div>
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
}
