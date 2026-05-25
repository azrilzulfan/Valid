import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  LayoutDashboard, FolderOpen, Mic, Star, Users, Coins, LogOut, ChevronRight, 
  CheckCircle2, Zap, Plus, Pencil, Trash2, X, UploadCloud, Compass 
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { UserSidebar } from '../components/valid/UserSidebar';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
};

const slideOverVariants: Variants = {
  hidden: { x: 400 },
  visible: { x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: 400, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

export function Portfolio() {
  const navigate = useNavigate();
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);

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
              <h2 className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>RIZKY PRATAMA</h2>
              <p className="font-bold text-[13px] md:text-[14px] text-[var(--text-muted)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>Fresh Graduate Teknik Mesin — SMK Negeri 1 Bandung</p>
              
              {/* Skills Row */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-[16px]">
                {['PENGELASAN', 'CNC MACHINING'].map(skill => (
                  <span key={skill} className="bg-blue-100 dark:bg-blue-900/30 border-[2px] border-blue-600 text-blue-700 dark:text-blue-400 rounded-full px-[14px] py-[6px] font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_#2563EB]" style={{ fontFamily: 'var(--font-body)' }}>
                    {skill}
                  </span>
                ))}
                {['AUTOCAD', 'QUALITY CONTROL'].map(skill => (
                  <span key={skill} className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] text-[var(--text-color)] rounded-full px-[14px] py-[6px] font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_var(--shadow-color)]" style={{ fontFamily: 'var(--font-body)' }}>
                    {skill}
                  </span>
                ))}
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
              {[
                { name: 'Pengelasan', source: 'Terverifikasi · Wawancara AI + Budi Santoso', verified: true },
                { name: 'CNC Machining', source: 'Terverifikasi · Wawancara AI', verified: true },
                { name: 'Quality Control', source: 'Terdeteksi · Wawancara AI', verified: false },
                { name: 'AutoCAD', source: 'Terdeteksi · Wawancara AI', verified: false },
              ].map((skill, i) => (
                <div key={i} className="flex items-center gap-[16px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] p-[16px_20px] shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--shadow-color)] transition-all cursor-default">
                  <div className={`w-[40px] h-[40px] shrink-0 rounded-full border-[2px] border-slate-900 flex items-center justify-center ${skill.verified ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {skill.verified ? <CheckCircle2 className="w-[20px] h-[20px]" /> : <Zap className="w-[20px] h-[20px]" />}
                  </div>
                  <div>
                    <div className="font-black text-[14px] text-[var(--text-color)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>{skill.name}</div>
                    <div className="font-bold text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-[2px]" style={{ fontFamily: 'var(--font-body)' }}>{skill.source}</div>
                  </div>
                </div>
              ))}
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
              {[
                { date: '10 Apr', year: '2026', score: 78, metrics: 'KONTAK MATA 84% · KEPERCAYAAN DIRI 71% · KOMUNIKASI 79%' },
                { date: '22 Mar', year: '2026', score: 65, metrics: 'KONTAK MATA 70% · KEPERCAYAAN DIRI 58% · KOMUNIKASI 68%' },
                { date: '15 Feb', year: '2026', score: 55, metrics: 'KONTAK MATA 60% · KEPERCAYAAN DIRI 48% · KOMUNIKASI 57%' },
              ].map((sess, i) => (
                <div key={i} className="flex gap-[16px] sm:gap-[24px] py-[20px] border-b-[2px] border-dashed border-[var(--border-color)] last:border-0 group hover:bg-[var(--bg-a)] transition-colors -mx-[12px] px-[12px] rounded-xl">
                  {/* Date Column */}
                  <div className="w-[60px] sm:w-[80px] shrink-0 text-right pt-[2px]">
                    <div className="font-black text-[12px] text-[var(--text-color)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>{sess.date}</div>
                    <div className="font-bold text-[10px] text-[var(--text-muted)] mt-[2px]" style={{ fontFamily: 'var(--font-body)' }}>{sess.year}</div>
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
              ))}
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
              {[
                { title: "Mesin Las MIG Otomatis", tech: ["CNC", "PENGELASAN"], desc: "Merancang sistem otomasi mesin las MIG untuk meningkatkan presisi dan efisiensi produksi.", date: "Mei 2026" },
                { title: "Sistem Quality Control", tech: ["AUTOCAD", "QC"], desc: "Membangun prosedur quality control untuk lini produksi komponen otomotif.", date: "Apr 2026" },
                { title: "Desain Jig & Fixture", tech: ["AUTOCAD", "CNC"], desc: "Mendesain jig dan fixture untuk proses manufaktur presisi tinggi.", date: "Feb 2026" },
                { title: "Laporan Magang Industri", tech: ["DOKUMENTASI"], desc: "Dokumentasi lengkap pengalaman magang di PT Astra Manufacturing.", date: "Jan 2026" }
              ].map((proj, i) => (
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
                      {proj.tech.map(t => (
                        <span key={t} className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] text-[var(--text-muted)] rounded-md px-[8px] py-[4px] font-black text-[9px] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="font-bold text-[12px] text-[var(--text-muted)] mt-[12px] line-clamp-2 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {proj.desc}
                    </p>
                    <div className="font-bold text-[10px] text-[var(--text-muted)]/60 mt-[12px]" style={{ fontFamily: 'var(--font-body)' }}>{proj.date}</div>

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
      
      {/* Add Project Modal */}
      <AnimatePresence>
        {isAddProjectOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsAddProjectOpen(false)}
            />
            <motion.div 
              variants={modalVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[540px] max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[2rem] p-[32px] sm:p-[40px] z-[101]"
            >
              <div className="flex justify-between items-center mb-[24px]">
                <h2 className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>TAMBAH PROYEK</h2>
                <button onClick={() => setIsAddProjectOpen(false)} className="p-2 hover:bg-[var(--bg-a)] rounded-full transition-colors">
                  <X className="w-6 h-6 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="flex flex-col gap-[20px]">
                <div>
                  <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>JUDUL PROYEK</label>
                  <input type="text" placeholder="Nama proyek kamu" className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
                </div>
                
                <div>
                  <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>DESKRIPSI</label>
                  <textarea rows={3} placeholder="Jelaskan proyek ini secara singkat" className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all resize-none placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
                </div>

                <div>
                  <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>TECH STACK</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {/* Dummy tags */}
                    <span className="bg-blue-100 border-[2px] border-blue-600 text-blue-700 rounded-full px-[12px] py-[6px] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-[2px_2px_0px_#2563EB]" style={{ fontFamily: 'var(--font-body)' }}>
                      CNC <X className="w-3 h-3 cursor-pointer" />
                    </span>
                  </div>
                  <input type="text" placeholder="Ketik dan tekan Enter" className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
                </div>

                <div>
                  <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>UPLOAD MEDIA</label>
                  <div className="w-full bg-[var(--bg-a)] border-[2.5px] border-dashed border-[var(--border-color)] rounded-[1.5rem] p-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group">
                    <div className="w-[64px] h-[64px] rounded-full bg-white dark:bg-slate-800 border-[2.5px] border-[var(--border-color)] flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)] group-hover:scale-110 transition-transform mb-[16px]">
                      <UploadCloud className="w-[28px] h-[28px] text-[var(--text-muted)] group-hover:text-blue-600" />
                    </div>
                    <span className="font-black text-[13px] text-[var(--text-color)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>Klik atau seret file ke sini</span>
                    <span className="font-bold text-[11px] text-[var(--text-muted)] mt-[6px]" style={{ fontFamily: 'var(--font-body)' }}>JPG, PNG, MP4 hingga 20MB</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-[16px] mt-[32px]">
                <button onClick={() => setIsAddProjectOpen(false)} className="flex-1 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-[1rem] py-[14px] font-black text-[13px] uppercase tracking-wider hover:border-slate-900 hover:shadow-[3px_3px_0px_#0f172a] transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                  Batal
                </button>
                <button className="flex-1 bg-blue-600 border-[2.5px] border-slate-900 text-white rounded-[1rem] py-[14px] font-black text-[13px] uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                  Simpan Proyek
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



    </div>
  );
}
