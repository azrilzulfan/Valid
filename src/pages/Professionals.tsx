import { motion, AnimatePresence, Variants } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Mic, Star, Users, Coins, LogOut, ChevronRight, Search, CheckCircle2, X, AlertCircle, FileText, MessageSquare, Compass } from 'lucide-react';
import { useState } from 'react';
import { UserSidebar } from '../components/valid/UserSidebar';

const DUMMY_PROFESSIONALS = [
  {
    id: 1,
    name: 'Budi Santoso',
    headline: 'Ahli Teknik Mesin · 12 Tahun Pengalaman',
    skills: ['PENGELASAN', 'CNC', 'QUALITY CONTROL'],
    rating: 4.8,
    reviews: 23,
    price: 50,
    gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    about: 'Saya adalah praktisi teknik mesin dengan lebih dari 12 tahun pengalaman di industri manufaktur otomotif. Fokus utama saya adalah optimasi proses produksi dan memastikan standar mutu (QA/QC) sesuai spesifikasi ISO. Saya juga asesor tersertifikasi BNSP untuk bidang pengelasan dan permesinan dasar.',
    experience: [
      { role: 'QA/QC Manager', company: 'PT Astra Otoparts', year: '2018 - Sekarang' },
      { role: 'Senior CNC Engineer', company: 'PT Toyota Motor', year: '2012 - 2018' }
    ],
    verified_projects: 145,
    user_reviews: [
      { name: 'Andi M.', text: 'Review yang diberikan sangat detail, terutama di bagian efisiensi material. Sangat membantu!' },
      { name: 'Rina S.', text: 'Feedback nya membangun dan langsung bisa diimplementasikan di proyek akhir kuliah saya.' }
    ]
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    headline: 'Senior Desainer Grafis · Bersertifikasi Adobe',
    skills: ['DESAIN GRAFIS', 'BRANDING', 'UI DESIGN'],
    rating: 4.6,
    reviews: 17,
    price: 40,
    gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    about: 'Desainer multi-disiplin yang berfokus pada perancangan identitas merek visual (Branding) dan pengalaman pengguna (UI/UX). Telah menangani lebih dari 50 klien UMKM hingga perusahaan multinasional. Tersertifikasi Adobe Creative Professional.',
    experience: [
      { role: 'Art Director', company: 'Matahari Creative Agency', year: '2020 - Sekarang' },
      { role: 'UI/UX Designer', company: 'Gojek Indonesia', year: '2017 - 2020' }
    ],
    verified_projects: 89,
    user_reviews: [
      { name: 'Dion W.', text: 'Sangat jeli melihat komposisi warna. Portofolio saya jadi terlihat lebih profesional berkat masukan Kak Siti.' },
      { name: 'Fani K.', text: 'Penjelasan mengenai hierarki tipografi sangat mudah dipahami.' }
    ]
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    headline: 'Full-Stack Developer · 8 Tahun Pengalaman',
    skills: ['REACT', 'LARAVEL', 'POSTGRESQL'],
    rating: 4.9,
    reviews: 31,
    price: 60,
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    about: 'Software engineer spesialis pengembangan aplikasi web berskala enterprise. Berpengalaman merancang arsitektur microservices dan integrasi API yang kompleks. Aktif berkontribusi di komunitas open-source dan bersertifikasi arsitek cloud AWS.',
    experience: [
      { role: 'Lead Developer', company: 'Traveloka', year: '2021 - Sekarang' },
      { role: 'Backend Engineer', company: 'Tokopedia', year: '2016 - 2021' }
    ],
    verified_projects: 210,
    user_reviews: [
      { name: 'Kevin O.', text: 'Code review nya tajam! Bugs yang selama ini ga kelihatan berhasil ditemukan.' },
      { name: 'Yusuf A.', text: 'Sangat direkomendasikan untuk mereview struktur database relasional.' }
    ]
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    headline: 'Akuntan Publik Bersertifikasi',
    skills: ['AKUNTANSI', 'AUDIT', 'PERPAJAKAN'],
    rating: 4.7,
    reviews: 19,
    price: 35,
    gradient: 'linear-gradient(135deg, #DC2626, #B91C1C)',
    about: 'Lulusan terbaik jurusan Akuntansi yang kini menjabat sebagai auditor eksternal. Membantu berbagai startup dalam merapikan laporan keuangan dan memastikan kepatuhan pajak sesuai regulasi terbaru di Indonesia.',
    experience: [
      { role: 'Senior Auditor', company: 'PwC Indonesia', year: '2019 - Sekarang' },
      { role: 'Tax Consultant', company: 'KPMG', year: '2015 - 2019' }
    ],
    verified_projects: 112,
    user_reviews: [
      { name: 'Sinta P.', text: 'Membantu saya memahami kesalahan dalam pencatatan arus kas. Terima kasih banyak!' },
      { name: 'Bimo T.', text: 'Review mengenai perpajakan PPh 21 nya sangat komprehensif.' }
    ]
  }
];

const DUMMY_PROJECTS = [
  { id: 1, name: 'Redesign Dashboard B2B' },
  { id: 2, name: 'Aplikasi Kasir UMKM' },
  { id: 3, name: 'Website Portofolio Fotografer' }
];

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const modalVariants: Variants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: -40, opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
};

const slideOverVariants: Variants = {
  hidden: { x: '100%', opacity: 1 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
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
  const selectedProject = DUMMY_PROJECTS.find(p => p.id === selectedProjectId);

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

  const handleConfirmReview = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBalance(prev => prev - (activeProf?.price || 0));
      setModalStep(3);
    }, 1200);
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
                    {prof.name.split(' ').map(n => n[0]).join('')}
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
                  {prof.skills.map((skill, idx) => (
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

      {/* ========================================= */}
      {/* PROFILE SLIDE-OVER MODAL                  */}
      {/* ========================================= */}
      <AnimatePresence>
        {isProfileOpen && viewProf && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />

            {/* Slide-over Panel */}
            <motion.div 
              variants={slideOverVariants as any}
              initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 right-0 w-full md:w-[600px] h-screen bg-[var(--bg-a)] border-l-[3px] border-slate-900 shadow-[-8px_0_20px_rgba(0,0,0,0.1)] z-50 overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center p-[24px_32px] border-b-[3px] border-slate-900 bg-yellow-300 sticky top-0 z-10">
                <div className="font-black text-[24px] uppercase text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>PROFIL REVIEWER</div>
                <button onClick={() => setIsProfileOpen(false)} className="w-[36px] h-[36px] bg-white border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"><X className="w-5 h-5 text-slate-900" /></button>
              </div>

              <div className="p-[32px] flex-1">
                {/* Header Info */}
                <div className="flex gap-[20px] items-center mb-[32px]">
                  <div className="w-[80px] h-[80px] rounded-[20px] border-[3px] border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-center font-black text-[36px] text-white shrink-0" style={{ background: viewProf.gradient, fontFamily: 'var(--font-impact)' }}>
                    {viewProf.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-black text-[28px] text-[var(--text-color)] uppercase leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{viewProf.name}</div>
                    <div className="font-bold text-[14px] text-[var(--text-muted)] mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>{viewProf.headline}</div>
                    <div className="bg-blue-100 border-[2px] border-blue-600 rounded-lg px-[10px] py-[4px] font-black text-[10px] tracking-widest text-blue-700 shadow-[2px_2px_0px_#2563eb] inline-block mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>
                      ASAL ASESOR BNSP
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-[16px] mb-[32px]">
                  <div className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[16px] text-center">
                    <div className="font-black text-[28px] text-[var(--text-color)] flex justify-center items-center gap-[4px]" style={{ fontFamily: 'var(--font-impact)' }}>
                      {viewProf.rating} <Star className="w-[18px] h-[18px] text-yellow-400 fill-yellow-400 -mt-1" />
                    </div>
                    <div className="font-bold text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-[4px]" style={{ fontFamily: 'var(--font-body)' }}>RATING</div>
                  </div>
                  <div className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[16px] text-center">
                    <div className="font-black text-[28px] text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>{viewProf.verified_projects}</div>
                    <div className="font-bold text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-[4px]" style={{ fontFamily: 'var(--font-body)' }}>PROYEK VERIF</div>
                  </div>
                  <div className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[16px] text-center">
                    <div className="font-black text-[28px] text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>{viewProf.reviews}</div>
                    <div className="font-bold text-[10px] uppercase tracking-widest text-[var(--text-muted)] mt-[4px]" style={{ fontFamily: 'var(--font-body)' }}>TOTAL REVIEW</div>
                  </div>
                </div>

                {/* Tentang */}
                <div className="mb-[32px]">
                  <div className="font-black text-[18px] uppercase text-[var(--text-color)] mb-[12px] flex items-center gap-[8px]" style={{ fontFamily: 'var(--font-impact)' }}>
                    <div className="w-[8px] h-[8px] bg-blue-500 rounded-full border-[2px] border-slate-900 shadow-[1px_1px_0px_#0f172a]" />
                    TENTANG
                  </div>
                  <div className="font-bold text-[14px] text-[var(--text-muted)] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    {viewProf.about}
                  </div>
                </div>

                {/* Pengalaman */}
                <div className="mb-[32px]">
                  <div className="font-black text-[18px] uppercase text-[var(--text-color)] mb-[16px] flex items-center gap-[8px]" style={{ fontFamily: 'var(--font-impact)' }}>
                    <div className="w-[8px] h-[8px] bg-yellow-400 rounded-full border-[2px] border-slate-900 shadow-[1px_1px_0px_#0f172a]" />
                    PENGALAMAN KERJA
                  </div>
                  <div className="flex flex-col gap-[16px]">
                    {viewProf.experience.map((exp, i) => (
                      <div key={i} className="flex gap-[16px]">
                        <div className="w-[12px] h-[12px] rounded-full bg-slate-200 border-[2.5px] border-[var(--border-color)] mt-[4px] shrink-0" />
                        <div>
                          <div className="font-black text-[14px] uppercase text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>{exp.role}</div>
                          <div className="font-bold text-[13px] text-blue-600 mt-[2px]" style={{ fontFamily: 'var(--font-body)' }}>{exp.company}</div>
                          <div className="font-bold text-[11px] text-[var(--text-muted)] mt-[2px]" style={{ fontFamily: 'var(--font-body)' }}>{exp.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ulasan */}
                <div className="mb-[40px]">
                  <div className="font-black text-[18px] uppercase text-[var(--text-color)] mb-[16px] flex items-center gap-[8px]" style={{ fontFamily: 'var(--font-impact)' }}>
                    <div className="w-[8px] h-[8px] bg-green-400 rounded-full border-[2px] border-slate-900 shadow-[1px_1px_0px_#0f172a]" />
                    ULASAN PENGGUNA ({viewProf.reviews})
                  </div>
                  <div className="flex flex-col gap-[16px]">
                    {viewProf.user_reviews.map((rev, i) => (
                      <div key={i} className="bg-white border-[2.5px] border-[var(--border-color)] rounded-[16px] p-[16px] shadow-[4px_4px_0px_var(--shadow-color)] relative">
                        <MessageSquare className="absolute top-[16px] right-[16px] w-[20px] h-[20px] text-slate-200" />
                        <div className="flex items-center gap-[4px] mb-[8px]">
                          {[...Array(5)].map((_, idx) => (
                            <Star key={idx} className="w-[12px] h-[12px] text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <div className="font-bold text-[13px] text-[var(--text-color)] leading-relaxed italic" style={{ fontFamily: 'var(--font-body)' }}>"{rev.text}"</div>
                        <div className="font-black text-[11px] uppercase text-[var(--text-muted)] mt-[12px]" style={{ fontFamily: 'var(--font-body)' }}>— {rev.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Footer for Action */}
              <div className="p-[24px_32px] border-t-[3px] border-slate-900 bg-white sticky bottom-0 z-10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[10px] uppercase tracking-widest text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>TARIF REVIEW</div>
                  <div className="flex items-center gap-[6px] mt-[4px]">
                    <Coins className="w-[20px] h-[20px] text-yellow-500" />
                    <span className="font-black text-[28px] text-[var(--text-color)] leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{viewProf.price}</span>
                    <span className="font-bold text-[12px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>koin</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleMintaReview(viewProf.id)}
                  className="bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] rounded-[16px] px-[32px] py-[16px] font-black text-[14px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all" style={{ fontFamily: 'var(--font-body)' }}
                >
                  Minta Review
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ========================================= */}
      {/* EXPANDED MINTA REVIEW MODAL               */}
      {/* ========================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
              exit={{ opacity: 0, scale: 0.95, y: '-50%', x: '-50%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 w-[90%] max-w-[560px] bg-[var(--card-bg)] border-[2.5px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[1.5rem] z-[60] overflow-hidden"
            >
              <div className="relative overflow-hidden w-full" style={{ minHeight: modalStep === 3 ? '400px' : '560px' }}>
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: PILIH PROYEK & TULIS PESAN */}
                  {modalStep === 1 && (
                    <motion.div key="step1" variants={modalVariants as any} initial="enter" animate="center" exit="exit" className="absolute inset-0 flex flex-col">
                      <div className="p-[24px_28px] border-b-[2.5px] border-[var(--border-color)] flex justify-between items-start bg-yellow-300">
                        <div>
                          <div className="font-black text-[24px] uppercase text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>DETAIL REVIEW</div>
                          <div className="font-bold text-[13px] text-slate-800 mt-[4px]" style={{ fontFamily: 'var(--font-body)' }}>Isi informasi apa yang ingin direview oleh ahli.</div>
                        </div>
                        <button onClick={closeModal} className="w-[32px] h-[32px] bg-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"><X className="w-5 h-5 text-slate-900" /></button>
                      </div>

                      {/* Info Reviewer (Selected) */}
                      {activeProf ? (
                        <div className="p-[16px_28px] bg-blue-50 border-b-[2.5px] border-[var(--border-color)] flex gap-[12px] items-center">
                          <div className="w-[40px] h-[40px] rounded-[10px] border-[2px] border-slate-900 flex items-center justify-center font-black text-[14px] text-white shadow-[2px_2px_0px_#0f172a]" style={{ background: activeProf.gradient, fontFamily: 'var(--font-impact)' }}>
                            {activeProf.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-[11px] uppercase text-blue-600 tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Reviewer Terpilih:</span>
                            <span className="font-black text-[16px] uppercase text-[var(--text-color)] leading-tight mt-1" style={{ fontFamily: 'var(--font-impact)' }}>{activeProf.name}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-[16px_28px] bg-red-50 border-b-[2.5px] border-[var(--border-color)]">
                          <span className="font-bold text-[13px] text-red-600">Error: Pilih reviewer terlebih dahulu dari halaman utama.</span>
                        </div>
                      )}

                      <div className="p-[20px_28px] flex-1 overflow-y-auto bg-white">
                        {/* Pilih Proyek */}
                        <div className="mb-[20px]">
                          <label className="font-black text-[12px] uppercase text-[var(--text-color)] mb-[8px] flex items-center gap-[8px]" style={{ fontFamily: 'var(--font-impact)' }}>
                            <FileText className="w-[14px] h-[14px] text-blue-600" />
                            PILIH PROYEK PORTOFOLIO
                          </label>
                          <select 
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
                            className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[12px] p-[12px_16px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] cursor-pointer appearance-none transition-all" style={{ fontFamily: 'var(--font-body)' }}
                          >
                            {DUMMY_PROJECTS.map(proj => (
                              <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Catatan untuk reviewer */}
                        <div>
                          <label className="font-black text-[12px] uppercase text-[var(--text-color)] mb-[8px] flex items-center gap-[8px]" style={{ fontFamily: 'var(--font-impact)' }}>
                            <MessageSquare className="w-[14px] h-[14px] text-yellow-500" />
                            CATATAN UNTUK REVIEWER
                          </label>
                          <textarea 
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder="Contoh: Tolong cek bagian alur routing database dan keamanannya ya pak..."
                            className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[12px] p-[16px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all min-h-[120px] resize-none"
                            style={{ fontFamily: 'var(--font-body)' }}
                          />
                        </div>
                      </div>

                      <div className="p-[20px_28px] border-t-[2.5px] border-[var(--border-color)] bg-[var(--bg-a)] flex justify-between items-center">
                        <div className="flex items-center gap-[6px]">
                          <Coins className="w-[16px] h-[16px] text-yellow-500" />
                          <span className="font-black text-[20px] text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>{activeProf?.price || 0}</span>
                          <span className="font-bold text-[10px] uppercase text-slate-600 tracking-widest mt-1" style={{ fontFamily: 'var(--font-body)' }}>koin</span>
                        </div>
                        <button 
                          disabled={!activeProf}
                          onClick={() => setModalStep(2)}
                          className={`rounded-[12px] px-[32px] py-[12px] font-black text-[14px] uppercase tracking-widest text-white transition-all ${
                            activeProf ? 'bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#0f172a]' : 'bg-slate-300 border-[2.5px] border-slate-400 cursor-not-allowed'
                          }`} style={{ fontFamily: 'var(--font-body)' }}
                        >
                          Lanjut Bayar →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: KONFIRMASI */}
                  {modalStep === 2 && activeProf && (
                    <motion.div key="step2" variants={modalVariants as any} initial="enter" animate="center" exit="exit" className="absolute inset-0 flex flex-col">
                      <div className="p-[24px_28px] border-b-[2.5px] border-[var(--border-color)] flex justify-between items-start bg-blue-600 text-white">
                        <div>
                          <div className="font-black text-[24px] uppercase" style={{ fontFamily: 'var(--font-impact)' }}>KONFIRMASI BAYAR</div>
                          <div className="font-bold text-[13px] text-blue-100 mt-[4px]" style={{ fontFamily: 'var(--font-body)' }}>Periksa rincian sebelum menyelesaikan pesanan.</div>
                        </div>
                        <button onClick={closeModal} className="w-[32px] h-[32px] bg-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] rounded-lg flex items-center justify-center"><X className="w-5 h-5 text-slate-900" /></button>
                      </div>

                      <div className="p-[24px_28px] flex-1 overflow-y-auto bg-[var(--bg-a)]">
                        <div className="bg-white border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[16px] p-[24px]">
                          <div className="flex gap-[16px] items-center mb-[20px]">
                            <div className="w-[48px] h-[48px] rounded-[12px] border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-black text-[18px] text-white shrink-0" style={{ background: activeProf.gradient, fontFamily: 'var(--font-impact)' }}>
                              {activeProf.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="font-black text-[18px] uppercase text-[var(--text-color)] flex-1" style={{ fontFamily: 'var(--font-impact)' }}>{activeProf.name}</div>
                          </div>

                          <div className="flex flex-col gap-[16px]">
                            <div>
                              <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest block mb-[4px]" style={{ fontFamily: 'var(--font-body)' }}>PROYEK YANG DIREVIEW</span>
                              <div className="font-black text-[15px] uppercase text-blue-600 bg-blue-50 border-[2px] border-blue-200 p-[10px_12px] rounded-lg" style={{ fontFamily: 'var(--font-impact)' }}>{selectedProject?.name}</div>
                            </div>

                            {customNote && (
                              <div>
                                <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest block mb-[4px]" style={{ fontFamily: 'var(--font-body)' }}>CATATAN TAMBAHAN</span>
                                <div className="font-bold text-[13px] text-slate-700 bg-slate-50 border-[2px] border-slate-200 p-[12px] rounded-lg italic" style={{ fontFamily: 'var(--font-body)' }}>"{customNote}"</div>
                              </div>
                            )}

                            <div className="w-full border-t-[2.5px] border-dashed border-[var(--border-color)] my-[4px]" />

                            <div className="flex justify-between items-center">
                              <span className="font-black text-[14px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-impact)' }}>TOTAL BIAYA</span>
                              <div className="flex items-center gap-[6px] bg-yellow-300 border-[2px] border-slate-900 px-[12px] py-[4px] rounded-lg shadow-[2px_2px_0px_#0f172a]">
                                <Coins className="w-[14px] h-[14px] text-slate-900" />
                                <span className="font-black text-[16px] text-slate-900" style={{ fontFamily: 'var(--font-impact)' }}>{activeProf.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-[24px] bg-white border-[2.5px] border-[var(--border-color)] rounded-[16px] p-[16px]">
                          <div className="flex justify-between items-center mb-[12px]">
                            <span className="font-bold text-[11px] uppercase tracking-widest text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>SALDO KAMU</span>
                            <span className="font-black text-[16px] text-[var(--text-color)]" style={{ fontFamily: 'var(--font-impact)' }}>{balance} koin</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[11px] uppercase tracking-widest text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>SISA SETELAH TRANSAKSI</span>
                            <span className={`font-black text-[18px] ${balance - activeProf.price < 0 ? 'text-red-500' : 'text-green-600'}`} style={{ fontFamily: 'var(--font-impact)' }}>
                              {balance - activeProf.price} koin
                            </span>
                          </div>
                        </div>

                        {balance - activeProf.price < 0 && (
                          <div className="bg-orange-100 border-[2.5px] border-orange-500 rounded-[12px] p-[16px] mt-[16px] flex items-center justify-between shadow-[4px_4px_0px_#f97316]">
                            <div className="flex items-center gap-[8px]">
                              <AlertCircle className="w-[20px] h-[20px] text-orange-600" />
                              <span className="font-black text-[12px] uppercase text-orange-600" style={{ fontFamily: 'var(--font-body)' }}>Koin tidak cukup!</span>
                            </div>
                            <span onClick={() => window.location.href = '/dashboard/coins'} className="font-black text-[11px] uppercase bg-orange-500 text-white px-[12px] py-[6px] rounded-md cursor-pointer border-[2px] border-orange-700 hover:-translate-y-0.5 transition-transform" style={{ fontFamily: 'var(--font-body)' }}>TAMBAH KOIN</span>
                          </div>
                        )}
                      </div>

                      <div className="p-[20px_28px] border-t-[2.5px] border-[var(--border-color)] bg-white flex gap-[12px]">
                        <button 
                          onClick={() => setModalStep(1)}
                          disabled={isSubmitting}
                          className="flex-[2] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[12px] py-[14px] font-black text-[13px] uppercase tracking-widest text-[var(--text-color)] hover:bg-[var(--text-color)] hover:text-white transition-colors shadow-[2px_2px_0px_var(--shadow-color)]" style={{ fontFamily: 'var(--font-body)' }}
                        >
                          KEMBALI
                        </button>
                        <button 
                          onClick={handleConfirmReview}
                          disabled={balance - activeProf.price < 0 || isSubmitting}
                          className="flex-[3] bg-yellow-400 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[12px] py-[14px] font-black text-[13px] uppercase tracking-widest text-slate-900 hover:-translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-[8px]" style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {isSubmitting ? 'MENGIRIM...' : 'BAYAR & KIRIM'}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: SUCCESS */}
                  {modalStep === 3 && activeProf && (
                    <motion.div key="step3" variants={modalVariants as any} initial="enter" animate="center" exit="exit" className="absolute inset-0 flex flex-col items-center justify-center p-[40px_28px] bg-green-50">
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.6, times: [0, 0.6, 1], ease: "backOut" }}
                        className="w-[100px] h-[100px] bg-green-400 border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-full flex items-center justify-center mb-[24px]"
                      >
                        <CheckCircle2 className="w-[48px] h-[48px] text-slate-900" />
                      </motion.div>
                      
                      <div className="font-black text-[32px] text-slate-900 text-center uppercase leading-none" style={{ fontFamily: 'var(--font-impact)' }}>REQUEST BERHASIL!</div>
                      <div className="font-bold text-[14px] text-green-800 text-center mt-[12px] max-w-[300px]" style={{ fontFamily: 'var(--font-body)' }}>
                        Review untuk <span className="font-black">{selectedProject?.name}</span> telah diteruskan ke {activeProf.name}.
                      </div>

                      <button 
                        onClick={closeModal}
                        className="w-full max-w-[300px] bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 rounded-[12px] py-[14px] font-black text-[13px] uppercase tracking-widest text-white mt-[40px] transition-all" style={{ fontFamily: 'var(--font-body)' }}
                      >
                        SELESAI
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
