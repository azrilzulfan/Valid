// HALAMAN: pages/Professionals
// FUNGSI: Menampilkan daftar profesional/asesor untuk diminta review portofolionya
// API YANG DIBUTUHKAN: professionalsApi.getAll, professionalsApi.requestReview (nantinya)
// DUMMY DATA: DUMMY_PROFESSIONALS, DUMMY_PROJECTS

import { motion, Variants } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Mic, Star, Users, Coins, LogOut, ChevronRight, Search, CheckCircle2, X, AlertCircle, FileText, MessageSquare, Compass } from 'lucide-react';
import { useState } from 'react';
import { UserSidebar } from '../components/valid/UserSidebar';
import { DUMMY_PROFESSIONALS, DUMMY_PROJECTS } from '../components/professionals/dummyData';
import { ProfileSlideOver } from '../components/professionals/ProfileSlideOver';
import { ReviewModal } from '../components/professionals/ReviewModal';
import { paymentApi } from '../lib/api';

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export function Professionals() {
  const [balance, setBalance] = useState(125);
  
  // Minta Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [selectedProfId, setSelectedProfId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number>(DUMMY_PROJECTS[0].id);
  const [customNote, setCustomNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Slide-over State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileViewId, setProfileViewId] = useState<number | null>(null);

  const activeProf = DUMMY_PROFESSIONALS.find(p => p.id === selectedProfId);
  const viewProf = DUMMY_PROFESSIONALS.find(p => p.id === profileViewId);

  const handleMintaReview = (profId?: number) => {
    if (profId) setSelectedProfId(profId);
    setModalStep(1);
    setIsModalOpen(true);
    setIsProfileOpen(false); // Close profile if open
  };

  const handleLihatProfil = (profId: number) => {
    setProfileViewId(profId);
    setIsProfileOpen(true);
  };

  const handleConfirmReview = async () => {
    setIsSubmitting(true);
    try {
      if (activeProf && selectedProjectId) {
         await paymentApi.createPayment({ 
            verifierUid: activeProf.id.toString(), 
            portfolioId: selectedProjectId.toString() 
         });
      }
      setBalance(prev => prev - (activeProf?.price || 0));
      setModalStep(3);
    } catch (e) {
      console.error(e);
      setModalStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setModalStep(1);
      setSelectedProfId(null);
      setCustomNote('');
    }, 300);
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        <motion.div 
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1200px] mx-auto relative z-10"
          variants={pageVariants as any}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <motion.div variants={sectionVariants as any} className="mb-[32px]">
            <div className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_var(--shadow-color)] font-black text-[9px] uppercase tracking-widest text-blue-600 mb-[12px]" style={{ fontFamily: 'var(--font-body)' }}>PROFESIONAL</div>
            <div className="font-black text-[32px] md:text-[40px] text-[var(--text-color)] tracking-tighter mt-[4px] leading-tight uppercase" style={{ fontFamily: 'var(--font-impact)' }}>CARI REVIEWER</div>
            <div className="font-bold text-[14px] md:text-[15px] text-[var(--text-muted)] mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>
              Pilih ahli BNSP yang akan memverifikasi kemampuanmu.
            </div>
          </motion.div>

          {/* FILTER BAR - NEO BRUTALISM */}
          <motion.div variants={sectionVariants as any} className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1.5rem] p-[20px] flex flex-col md:flex-row gap-[16px] items-stretch md:items-center mb-[32px]">
            <div className="flex-1 relative">
              <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Cari nama atau keahlian..." 
                className="w-full bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] rounded-[12px] py-[12px] pl-[46px] pr-[16px] font-bold text-[14px] text-[var(--text-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-600 focus:shadow-[2px_2px_0px_#2563EB] transition-all"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
            {['Semua Keahlian', 'Semua Harga', 'Rating Tertinggi'].map((label, i) => (
              <select key={i} className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] rounded-[12px] py-[12px] px-[16px] font-bold text-[14px] text-[var(--text-color)] min-w-[160px] focus:outline-none focus:border-blue-600 focus:shadow-[2px_2px_0px_#2563EB] cursor-pointer appearance-none transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                <option>{label}</option>
              </select>
            ))}
          </motion.div>

          {/* GRID */}
          <motion.div variants={sectionVariants as any} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
            {DUMMY_PROFESSIONALS.map((prof) => (
              <motion.div 
                key={prof.id}
                whileHover={{ y: -5, boxShadow: '6px 6px 0px var(--shadow-color)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1.5rem] p-[24px] cursor-pointer group flex flex-col"
              >
                {/* Top Row */}
                <div className="flex gap-[16px] items-center">
                  <div className="w-[56px] h-[56px] rounded-[14px] border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-black text-[24px] text-white shrink-0" style={{ background: prof.gradient, fontFamily: 'var(--font-impact)' }}>
                    {prof.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[18px] text-[var(--text-color)] truncate uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{prof.name}</div>
                    <div className="font-bold text-[12px] text-[var(--text-muted)] mt-[4px] truncate" style={{ fontFamily: 'var(--font-body)' }}>{prof.headline}</div>
                  </div>
                  <div className="bg-blue-100 border-[2px] border-blue-600 rounded-lg px-[10px] py-[4px] font-black text-[10px] tracking-widest text-blue-700 shrink-0 shadow-[2px_2px_0px_#2563eb]" style={{ fontFamily: 'var(--font-body)' }}>
                    BNSP
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full border-t-[2px] border-dashed border-[var(--border-color)] my-[20px]" />

                {/* Skills */}
                <div className="flex flex-wrap gap-[8px] mb-auto">
                  {prof.skills.map((skill: string, idx: number) => (
                    <div key={idx} className="bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] rounded-[8px] px-[12px] py-[6px] font-black text-[10px] text-[var(--text-muted)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                      {skill}
                    </div>
                  ))}
                </div>

                {/* Bottom Row */}
                <div className="mt-[24px] flex justify-between items-end">
                  <div className="flex flex-col gap-[4px]">
                    <div className="flex items-center gap-[6px]">
                      <Star className="w-[16px] h-[16px] text-yellow-400 fill-yellow-400" />
                      <span className="font-black text-[16px] text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>{prof.rating}</span>
                    </div>
                    <span className="font-bold text-[11px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>({prof.reviews} review)</span>
                  </div>
                  <div className="flex flex-col items-end gap-[2px]">
                    <div className="flex items-center gap-[6px]">
                      <Coins className="w-[18px] h-[18px] text-yellow-500" />
                      <span className="font-black text-[24px] text-[var(--text-color)] leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{prof.price}</span>
                    </div>
                    <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>koin</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-[24px] flex gap-[12px]">
                  <button 
                    onClick={() => handleLihatProfil(prof.id)}
                    className="flex-1 bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[12px] py-[10px] font-black text-[11px] uppercase tracking-widest text-[var(--text-color)] text-center hover:bg-[var(--text-color)] hover:text-white transition-all shadow-[2px_2px_0px_var(--shadow-color)]" style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Lihat Profil
                  </button>
                  <button 
                    onClick={() => handleMintaReview(prof.id)}
                    className="flex-1 bg-blue-600 border-[2.5px] border-slate-900 rounded-[12px] py-[10px] font-black text-[11px] uppercase tracking-widest text-white text-center hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}
                  >
                    Minta Review
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <ProfileSlideOver 
        isOpen={isProfileOpen} 
        viewProf={viewProf} 
        onClose={() => setIsProfileOpen(false)} 
        onMintaReview={handleMintaReview} 
      />

      <ReviewModal 
        isOpen={isModalOpen}
        modalStep={modalStep}
        setModalStep={setModalStep}
        activeProf={activeProf}
        balance={balance}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
        customNote={customNote}
        setCustomNote={setCustomNote}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirmReview}
        onClose={closeModal}
      />
    </div>
  );
}
