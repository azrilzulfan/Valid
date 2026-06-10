// HALAMAN: komponen/professionals/ProfileSlideOver
// FUNGSI: Menampilkan detail profil profesional di slide-over modal
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { X, Star, MessageSquare, Coins } from 'lucide-react';

const slideOverVariants: Variants = {
  hidden: { x: '100%', opacity: 1 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

export function ProfileSlideOver({ isOpen, viewProf, onClose, onMintaReview }: { isOpen: boolean, viewProf: any, onClose: () => void, onMintaReview: (id: number) => void }) {
  return (
    <AnimatePresence>
      {isOpen && viewProf && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
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
              <button onClick={onClose} className="w-[36px] h-[36px] bg-white border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"><X className="w-5 h-5 text-slate-900" /></button>
            </div>

            <div className="p-[32px] flex-1">
              {/* Header Info */}
              <div className="flex gap-[20px] items-center mb-[32px]">
                <div className="w-[80px] h-[80px] rounded-[20px] border-[3px] border-slate-900 shadow-[4px_4px_0px_#0f172a] flex items-center justify-center font-black text-[36px] text-white shrink-0" style={{ background: viewProf.gradient, fontFamily: 'var(--font-impact)' }}>
                  {viewProf.name.split(' ').map((n: string) => n[0]).join('')}
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
                  {viewProf.experience.map((exp: any, i: number) => (
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
                  {viewProf.user_reviews.map((rev: any, i: number) => (
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
                onClick={() => onMintaReview(viewProf.id)}
                className="bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] rounded-[16px] px-[32px] py-[16px] font-black text-[14px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all" style={{ fontFamily: 'var(--font-body)' }}
              >
                Minta Review
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
