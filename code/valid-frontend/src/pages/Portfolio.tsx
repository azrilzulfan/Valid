// HALAMAN: pages/Portfolio
// FUNGSI: Menampilkan halaman utama profil kandidat dan daftar portofolio/proyek mereka
// API YANG DIBUTUHKAN: usersApi.getProfile, portfolioApi.getMyPortfolios
// DUMMY DATA: -

import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  LayoutDashboard, FolderOpen, Mic, Star, Users, Coins, LogOut, ChevronRight, 
  CheckCircle2, Zap, Plus, Pencil, Trash2, X, UploadCloud, Compass 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { UserSidebar } from '../components/valid/UserSidebar';
import { portfolioApi, usersApi } from '../lib/api';
import { AddProjectModal } from '../components/portfolio/AddProjectModal';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const slideOverVariants: Variants = {
  hidden: { x: 400 },
  visible: { x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: 400, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

export function Portfolio() {
  const navigate = useNavigate();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await usersApi.getProfile();
        setProfile(profileRes);
      } catch (err) {
        console.error(err);
      }
      try {
        const portfolioRes = await portfolioApi.getMyPortfolios();
        setPortfolios(portfolioRes || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
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
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1000px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          
          {/* HEADER */}
          <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-[32px]">
            <div>
              <div className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_var(--shadow-color)] font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-[12px]" style={{ fontFamily: 'var(--font-body)' }}>
                PORTFOLIO
              </div>
              <div className="font-black text-[36px] md:text-[44px] text-[var(--text-color)] leading-[0.9] tracking-tighter mt-1 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>PROFIL & KARYA</div>
            </div>
            <button onClick={() => window.open('/p/rizky', '_blank')} className="bg-transparent hover:bg-[var(--card-bg)] transition-colors text-blue-600 rounded-[1rem] px-[20px] py-[12px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-blue-600 shadow-[3px_3px_0px_#2563EB] hover:shadow-[5px_5px_0px_#2563EB] hover:-translate-y-0.5 w-full sm:w-auto" style={{ fontFamily: 'var(--font-body)' }}>
              Lihat Profil Publik <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* SECTION 1: PROFILE HEADER */}
          <motion.div variants={sectionVariants} className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[28px] md:p-[32px] flex flex-col md:flex-row gap-[24px] items-center md:items-start shadow-[4px_4px_0px_var(--shadow-color)] mb-[24px]">
            {/* Avatar */}
            <div className="w-[80px] h-[80px] rounded-full border-[3px] border-slate-900 bg-blue-600 flex items-center justify-center shadow-[4px_4px_0px_#0f172a] shrink-0">
              <span className="font-black text-[36px] text-white" style={{ fontFamily: 'var(--font-impact)' }}>R</span>
            </div>
            
            {/* Info */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>
                {loading ? 'MEMUAT...' : (profile?.displayName || 'Lengkapi profil kamu')}
              </h2>
              <p className="font-bold text-[13px] md:text-[14px] text-[var(--text-muted)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
                {profile?.vocationField || 'Bidang Keahlian Belum Diatur'} — {profile?.location || 'Lokasi Belum Diatur'}
              </p>
              
              {/* Skills Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-[16px]">
                {profile?.skills?.length > 0 ? profile.skills.map((skill: string) => (
                  <span key={skill} className="bg-blue-100 dark:bg-blue-900/30 border-[2px] border-blue-600 text-blue-700 dark:text-blue-400 rounded-full px-[14px] py-[6px] font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_#2563EB]" style={{ fontFamily: 'var(--font-body)' }}>
                    {skill}
                  </span>
                )) : (
                  <span className="text-[11px] text-[var(--text-muted)] font-bold">Belum ada skill ditambahkan</span>
                )}
              </div>
            </div>

            {/* Action */}
            <button 
              onClick={() => setIsEditProfileOpen(true)}
              className="w-full md:w-auto bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-[1rem] px-[20px] py-[12px] font-black text-[12px] uppercase tracking-wider hover:-translate-y-1 hover:border-blue-600 hover:text-blue-600 shadow-[3px_3px_0px_var(--shadow-color)] transition-all" style={{ fontFamily: 'var(--font-body)' }}>
              Edit Profil
            </button>
          </motion.div>

          {/* SECTION 2: VERIFIED SKILLS */}
          <motion.div variants={sectionVariants} className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[28px] md:p-[32px] shadow-[4px_4px_0px_var(--shadow-color)] mb-[24px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-[20px]">
              <h3 className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>SKILL TERVERIFIKASI</h3>
              <span className="font-bold text-[11px] text-[var(--text-muted)] mt-1 sm:mt-0" style={{ fontFamily: 'var(--font-body)' }}>Dari Wawancara AI + Review Profesional</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[20px]">
              {profile?.verifiedSkills?.length > 0 ? profile.verifiedSkills.map((skill: any, i: number) => (
                <div key={i} className="flex items-center gap-[16px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] p-[16px_20px] shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--shadow-color)] transition-all cursor-default">
                  <div className={`w-[40px] h-[40px] shrink-0 rounded-full border-[2px] border-slate-900 flex items-center justify-center ${skill.verified ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {skill.verified ? <CheckCircle2 className="w-[20px] h-[20px]" /> : <Zap className="w-[20px] h-[20px]" />}
                  </div>
                  <div>
                    <div className="font-black text-[14px] text-[var(--text-color)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>{skill.name}</div>
                    <div className="font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-[2px]" style={{ fontFamily: 'var(--font-body)' }}>{skill.source}</div>
                  </div>
                </div>
              )) : (
                <div className="col-span-1 md:col-span-2 text-center p-6 text-[var(--text-muted)] text-[12px] font-bold">
                  Belum ada skill yang terverifikasi. Selesaikan wawancara AI terlebih dahulu.
                </div>
              )}
            </div>

            <button className="w-full bg-[var(--bg-a)] border-[2.5px] border-dashed border-[var(--border-color)] text-[var(--text-muted)] rounded-[1rem] p-[16px] font-black text-[12px] uppercase tracking-wider hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>
              + Tambah Skill Manual
            </button>
          </motion.div>

          {/* SECTION 3: INTERVIEW HISTORY */}
          <motion.div variants={sectionVariants} className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[28px] md:p-[32px] shadow-[4px_4px_0px_var(--shadow-color)] mb-[24px]">
            <div className="flex justify-between items-end mb-[24px]">
              <h3 className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>RIWAYAT WAWANCARA</h3>
              <span className="font-black text-[11px] uppercase tracking-widest text-blue-600 cursor-pointer hover:underline" style={{ fontFamily: 'var(--font-body)' }}>Lihat Semua →</span>
            </div>

            <div className="flex flex-col">
              {profile?.interviews?.length > 0 ? profile.interviews.map((sess: any, i: number) => (
                <div key={i} className="flex gap-[16px] sm:gap-[24px] py-[20px] border-b-[2px] border-dashed border-[var(--border-color)] last:border-0 group hover:bg-[var(--bg-a)] transition-colors -mx-[12px] px-[12px] rounded-xl">
                  {/* Date Column */}
                  <div className="w-[60px] sm:w-[80px] shrink-0 text-right pt-[2px]">
                    <div className="font-black text-[12px] text-[var(--text-color)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>{new Date(sess.date || Date.now()).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</div>
                    <div className="font-bold text-[10px] text-[var(--text-muted)] mt-[2px]" style={{ fontFamily: 'var(--font-body)' }}>{new Date(sess.date || Date.now()).getFullYear()}</div>
                  </div>
                  
                  {/* Timeline Line */}
                  <div className="relative w-[3px] bg-[var(--border-color)] shrink-0 rounded-full">
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full border-[2.5px] border-slate-900 bg-blue-500 shadow-[1px_1px_0px_#0f172a] group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-[8px]">
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-[28px] text-[var(--text-color)] leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{sess.score}</span>
                      <span className="font-black text-[11px] text-[var(--text-muted)] uppercase" style={{ fontFamily: 'var(--font-body)' }}>/100</span>
                    </div>
                    <div className="font-bold text-[10px] sm:text-[11px] text-[var(--text-muted)] uppercase tracking-widest mt-[8px] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {sess.metrics}
                    </div>
                    <div className="font-black text-[11px] text-blue-600 uppercase tracking-widest mt-[12px] cursor-pointer hover:underline" style={{ fontFamily: 'var(--font-body)' }}>
                      Lihat Detail →
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-6 text-[var(--text-muted)] text-[12px] font-bold">
                  Belum ada riwayat wawancara.
                </div>
              )}
            </div>
          </motion.div>

          {/* SECTION 4: PROJECTS */}
          <motion.div variants={sectionVariants}>
            <div className="flex justify-between items-end mb-[20px]">
              <h3 className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>PROYEK SAYA</h3>
              <button 
                onClick={() => setIsAddProjectOpen(true)}
                className="bg-blue-600 text-white rounded-[1rem] px-[16px] py-[10px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                <Plus className="w-4 h-4" /> Tambah Proyek
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {portfolios.length === 0 && !loading && (
                <div className="col-span-1 md:col-span-2 text-center py-12 border-[2.5px] border-dashed border-[var(--border-color)] rounded-[1.5rem]">
                  <p className="text-[var(--text-muted)] font-bold mb-4">Kamu belum memiliki proyek di portfolio.</p>
                  <button onClick={() => setIsAddProjectOpen(true)} className="bg-blue-600 text-white rounded-[1rem] px-[16px] py-[10px] font-black text-[12px] uppercase tracking-wider mx-auto border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a]">Tambah Proyek Pertama</button>
                </div>
              )}
              {portfolios.map((proj: any, i: number) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] overflow-hidden cursor-pointer shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)] flex flex-col"
                >
                  {/* Image Area */}
                  <div className="h-[140px] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/20 relative flex items-center justify-center border-b-[2.5px] border-[var(--border-color)]">
                    <span className="font-black text-[40px] text-blue-500/20 tracking-tighter" style={{ fontFamily: 'var(--font-impact)' }}>
                      {proj.title.substring(0,2).toUpperCase()}
                    </span>
                    <div className="absolute top-[12px] right-[12px] flex gap-[8px]">
                      <div className="bg-white dark:bg-slate-800 border-[2px] border-slate-900 rounded-lg p-[6px] shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-transform">
                        <Pencil className="w-[14px] h-[14px] text-slate-700 dark:text-slate-200" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 border-[2px] border-slate-900 rounded-lg p-[6px] shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 transition-transform">
                        <Trash2 className="w-[14px] h-[14px] text-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-[20px] flex flex-col flex-1">
                    <h4 className="font-black text-[16px] text-[var(--text-color)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>{proj.title}</h4>
                    
                    <div className="flex flex-wrap gap-[6px] mt-[12px]">
                      {(proj.tech || proj.vocationField ? [proj.vocationField] : []).map((t: string) => (
                        <span key={t} className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] text-[var(--text-muted)] rounded-md px-[8px] py-[4px] font-black text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="font-bold text-[12px] text-[var(--text-muted)] mt-[12px] line-clamp-2 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {proj.desc || proj.description}
                    </p>
                    <div className="font-bold text-[10px] text-[var(--text-muted)]/60 mt-[12px]" style={{ fontFamily: 'var(--font-body)' }}>
                      {proj.date || new Date(proj.createdAt || Date.now()).toLocaleDateString()}
                    </div>

                    <div className="mt-auto pt-[16px] border-t-[2px] border-dashed border-[var(--border-color)] flex items-center justify-between">
                      <span className="font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-widest border-[2px] border-[var(--border-color)] px-[8px] py-[4px] rounded-full" style={{ fontFamily: 'var(--font-body)' }}>
                        Belum diverifikasi
                      </span>
                      <span className="font-black text-[11px] text-blue-600 uppercase tracking-widest hover:underline" style={{ fontFamily: 'var(--font-body)' }}>
                        Minta Review →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* --- MODALS --- */}
      <AddProjectModal isOpen={isAddProjectOpen} onClose={() => setIsAddProjectOpen(false)} />

    </div>
  );
}
