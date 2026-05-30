// HALAMAN: C:\laragon\www\valid-react\src\pages\ProDashboard.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from 'framer-motion';
import { 
  LayoutDashboard, FolderOpen, Star, Coins, LogOut, ChevronRight, 
  Activity, Clock, CheckCircle2, MoreHorizontal, MessageSquare, Briefcase, Compass
} from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../components/valid/ThemeToggle';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const INCOMING_REQUESTS = [
  { id: 1, name: "Budi Santoso", role: "Quality Control", date: "25 Mei 2026", status: "Menunggu" },
  { id: 2, name: "Ayu Lestari", role: "Teknisi Mesin", date: "24 Mei 2026", status: "Menunggu" },
  { id: 3, name: "Fajar Nugraha", role: "Drafter AutoCAD", date: "23 Mei 2026", status: "Selesai", score: 85 },
];

export function ProDashboard() {
  const [activeTab, setActiveTab] = useState('Semua');

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      
      {/* SIDEBAR */}
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--card-bg)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-[var(--border-color)] flex md:flex-col z-50 md:z-auto transition-all shrink-0">
        
        {/* TOP: Logo */}
        <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[3px] border-[var(--border-color)] bg-yellow-300 items-center justify-between">
          <img src="/logo.png" alt="VALID Logo" className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform" />
          <div className="w-[10px] h-[10px] bg-green-500 rounded-full border-[2px] border-[var(--border-color)]"></div>
        </div>

        {/* USER INFO */}
        <div className="hidden md:flex items-center gap-3 py-[20px] px-[24px] border-b-[3px] border-[var(--border-color)] bg-[var(--bg-a)]">
          <div className="w-[44px] h-[44px] rounded-[14px] border-[2.5px] border-[var(--border-color)] bg-purple-200 flex items-center justify-center shadow-[3px_3px_0px_var(--shadow-color)]">
            <span className="font-black text-[20px] text-purple-700" style={{ fontFamily: 'var(--font-impact)' }}>I</span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[15px] text-[var(--text-color)] leading-tight tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>Ibrahim H.</span>
            <span className="font-bold text-[9px] uppercase tracking-widest text-[var(--text-muted)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>Reviewer Ahli</span>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 flex md:flex-col flex-row w-full justify-around md:justify-start md:px-[16px] md:py-[24px] gap-0 md:gap-[10px] items-center md:items-stretch h-full overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: 'Beranda Pro', active: true, path: '/pro/dashboard' },
            { icon: Compass, label: 'Jelajah Kandidat', path: '/pro/explore' },
            { icon: MessageSquare, label: 'Permintaan Review', path: '/pro/requests' },
            { icon: Coins, label: 'Penghasilan', path: '/pro/earnings' },
            { icon: FolderOpen, label: 'Riwayat', path: '/pro/history' }
          ].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => item.path && (window.location.href = item.path)}
              className={`group flex md:flex-row flex-col items-center gap-1 md:gap-[14px] px-3 md:px-[18px] py-2 md:py-[12px] rounded-[1rem] cursor-pointer transition-all duration-300 relative ${
                item.active 
                  ? 'md:bg-[var(--text-color)] text-[var(--text-color)] md:text-[var(--bg-a)] md:border-[2.5px] md:border-[var(--border-color)] md:shadow-[4px_4px_0px_#FBBF24] md:-translate-y-0.5' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-color)] md:border-[2.5px] md:border-transparent md:hover:border-[var(--border-color)] md:hover:shadow-[4px_4px_0px_var(--shadow-color)] md:hover:-translate-y-0.5 md:hover:bg-[var(--card-bg)]'
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
        <div className="hidden md:flex flex-col p-[24px] border-t-[3px] border-[var(--border-color)] bg-[var(--bg-a)]">
          <div onClick={() => window.location.href = '/'} className="flex items-center justify-center gap-2 cursor-pointer group px-3 py-3 border-[2.5px] border-transparent hover:border-[var(--border-color)] rounded-xl transition-all hover:bg-[var(--card-bg)] hover:shadow-[4px_4px_0px_var(--shadow-color)]">
            <LogOut className="w-[18px] h-[18px] text-[var(--text-muted)] group-hover:text-red-500 transition-colors" />
            <span className="font-black text-[12px] uppercase tracking-widest text-[var(--text-muted)] group-hover:text-red-500 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>Keluar</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto relative pb-[100px] md:pb-[40px]">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--shadow-color) 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

        <motion.div 
          className="p-[20px_16px] md:p-[40px_48px] max-w-[1100px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6"><ThemeToggle /></div>
          {/* HEADER */}
          <motion.div variants={sectionVariants} className="mb-[40px]">
            <div className="inline-flex px-3 py-1 bg-purple-100 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 mb-[16px] shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>
              MODE PROFESIONAL
            </div>
            <h1 className="font-black text-[36px] md:text-[52px] text-[var(--text-color)] leading-[0.9] tracking-tighter uppercase mb-2" style={{ fontFamily: 'var(--font-impact)' }}>
              OVERVIEW REVIEWER.
            </h1>
            <p className="font-bold text-[14px] md:text-[16px] text-[var(--text-muted)] max-w-[600px] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              Kelola permintaan ulasan wawancara, berikan feedback membangun, dan tarik penghasilan dari kontribusimu.
            </p>
          </motion.div>

          {/* STAT CARDS ROW */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[40px]">
            {/* Card 1 */}
            <div className="bg-yellow-300 border-[3px] border-slate-900 rounded-[1.5rem] p-[28px] shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0f172a] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[48px] h-[48px] bg-white border-[3px] border-slate-900 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
                  <Clock className="w-6 h-6 text-slate-900" />
                </div>
              </div>
              <div className="font-black text-[48px] text-slate-900 leading-[0.8] tracking-tighter mb-2" style={{ fontFamily: 'var(--font-impact)' }}>
                5
              </div>
              <div className="font-black text-[12px] text-slate-800 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                Permintaan Menunggu
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] rounded-[1.5rem] p-[28px] shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[48px] h-[48px] bg-blue-100 border-[3px] border-[var(--border-color)] rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_var(--shadow-color)]">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="font-black text-[48px] text-[var(--text-color)] leading-[0.8] tracking-tighter mb-2" style={{ fontFamily: 'var(--font-impact)' }}>
                24
              </div>
              <div className="font-black text-[12px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                Review Selesai
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-900 text-white border-[3px] border-slate-900 rounded-[1.5rem] p-[28px] shadow-[6px_6px_0px_#FBBF24] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FBBF24] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[48px] h-[48px] bg-slate-800 border-[3px] border-slate-700 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_#000000]">
                  <Coins className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div className="font-black text-[48px] text-white leading-[0.8] tracking-tighter mb-2" style={{ fontFamily: 'var(--font-impact)' }}>
                1200
              </div>
              <div className="font-black text-[12px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                Total Koin Terkumpul
              </div>
            </div>
          </motion.div>

          {/* MAIN CONTENT SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
            
            {/* INCOMING REQUESTS (Left 2/3) */}
            <motion.div variants={sectionVariants} className="lg:col-span-2">
              <div className="flex justify-between items-end mb-[20px]">
                <h2 className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>PERMINTAAN REVIEW</h2>
                
                {/* Tabs */}
                <div className="hidden sm:flex bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-lg p-1 shadow-[2px_2px_0px_#0f172a]">
                  {['Semua', 'Menunggu', 'Selesai'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-md font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[var(--text-color)] text-[var(--bg-a)]' : 'text-[var(--text-muted)] hover:text-[var(--text-color)]'}`}
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] rounded-[1.5rem] shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden">
                <div className="divide-y-[3px] divide-slate-900">
                  {INCOMING_REQUESTS.filter(req => activeTab === 'Semua' || req.status === activeTab).map((req) => (
                    <div key={req.id} className="p-[20px] md:p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-[48px] h-[48px] rounded-[12px] border-[2.5px] border-[var(--border-color)] bg-blue-100 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a]">
                          <span className="font-black text-[20px] text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>{req.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-black text-[16px] text-[var(--text-color)] uppercase tracking-tight mb-1" style={{ fontFamily: 'var(--font-impact)' }}>{req.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[11px] text-[var(--text-muted)] tracking-wider flex items-center gap-1" style={{ fontFamily: 'var(--font-body)' }}>
                              <Briefcase className="w-3 h-3" /> {req.role}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>{req.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 justify-between md:justify-end border-t-[2px] border-dashed border-slate-200 md:border-0 pt-4 md:pt-0">
                        {req.status === 'Menunggu' ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 border-[2px] border-yellow-500 text-yellow-700 rounded-full font-black text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            Menunggu
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 border-[2px] border-green-600 text-green-700 rounded-full font-black text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                            <CheckCircle2 className="w-3 h-3" />
                            Selesai ({req.score})
                          </div>
                        )}
                        
                        {req.status === 'Menunggu' ? (
                          <button 
                            onClick={() => window.location.href = `/pro/review/${req.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest border-[2.5px] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all flex items-center gap-1 shrink-0" 
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            Mulai Review <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            className="bg-[var(--card-bg)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-color)] rounded-lg p-[10px] border-[2.5px] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all shrink-0" 
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {INCOMING_REQUESTS.filter(req => activeTab === 'Semua' || req.status === activeTab).length === 0 && (
                    <div className="p-[40px] text-center">
                      <div className="w-[64px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-full border-[3px] border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center mb-4">
                        <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                      </div>
                      <div className="font-black text-[16px] text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Tidak ada permintaan</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* EARNINGS CHART (Right 1/3) */}
            <motion.div variants={sectionVariants} className="lg:col-span-1">
              <h2 className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight mb-[20px]" style={{ fontFamily: 'var(--font-impact)' }}>TREN PENGHASILAN</h2>
              
              <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] rounded-[1.5rem] shadow-[6px_6px_0px_var(--shadow-color)] p-[24px]">
                <div className="font-bold text-[12px] text-[var(--text-muted)] uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-body)' }}>Pendapatan 7 Hari Terakhir</div>
                <div className="font-black text-[32px] text-[var(--text-color)] tracking-tighter mb-6" style={{ fontFamily: 'var(--font-impact)' }}>+320 KOIN</div>
                
                {/* Custom CSS Bar Chart */}
                <div className="h-[180px] flex items-end justify-between gap-2 border-b-[2.5px] border-[var(--border-color)] pb-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute top-0 w-full border-t-[2px] border-dashed border-slate-200" />
                  <div className="absolute top-1/2 w-full border-t-[2px] border-dashed border-slate-200" />
                  
                  {/* Bars */}
                  {[
                    { day: 'Sen', h: '30%' },
                    { day: 'Sel', h: '45%' },
                    { day: 'Rab', h: '25%' },
                    { day: 'Kam', h: '60%' },
                    { day: 'Jum', h: '85%' },
                    { day: 'Sab', h: '50%' },
                    { day: 'Min', h: '70%' },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 z-10 group">
                      <div 
                        className={`w-full max-w-[24px] border-[2.5px] border-[var(--border-color)] rounded-t-sm shadow-[2px_0px_0px_var(--shadow-color)] transition-all duration-500 group-hover:brightness-110 ${i === 6 ? 'bg-yellow-400' : 'bg-blue-600'}`}
                        style={{ height: bar.h }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* X Axis Labels */}
                <div className="flex justify-between mt-2 px-1">
                  {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((day, i) => (
                    <span key={i} className={`font-black text-[10px] w-[24px] text-center uppercase tracking-widest ${i === 6 ? 'text-[var(--text-color)]' : 'text-slate-400'}`} style={{ fontFamily: 'var(--font-body)' }}>{day}</span>
                  ))}
                </div>
                
                <button className="w-full mt-6 bg-[var(--bg-a)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-color)] rounded-xl py-[12px] font-black text-[11px] uppercase tracking-widest border-[2.5px] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                  Tarik Saldo Koin
                </button>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}
