// HALAMAN: komponen/professionals/ReviewModal
// FUNGSI: Menampilkan modal untuk proses "Minta Review" dari profesional (pilih proyek, bayar koin)
// API YANG DIBUTUHKAN: -
// DUMMY DATA: DUMMY_PROJECTS

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { X, FileText, MessageSquare, Coins, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DUMMY_PROJECTS } from './dummyData';

const modalVariants: Variants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { x: -40, opacity: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }
};

interface ReviewModalProps {
  isOpen: boolean;
  modalStep: number;
  setModalStep: (step: number) => void;
  activeProf: any;
  balance: number;
  selectedProjectId: number;
  setSelectedProjectId: (id: number) => void;
  customNote: string;
  setCustomNote: (note: string) => void;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ReviewModal({
  isOpen, modalStep, setModalStep, activeProf, balance, 
  selectedProjectId, setSelectedProjectId, customNote, setCustomNote, 
  isSubmitting, onConfirm, onClose
}: ReviewModalProps) {
  const selectedProject = DUMMY_PROJECTS.find(p => p.id === selectedProjectId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
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
                      <button onClick={onClose} className="w-[32px] h-[32px] bg-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"><X className="w-5 h-5 text-slate-900" /></button>
                    </div>

                    {/* Info Reviewer (Selected) */}
                    {activeProf ? (
                      <div className="p-[16px_28px] bg-blue-50 border-b-[2.5px] border-[var(--border-color)] flex gap-[12px] items-center">
                        <div className="w-[40px] h-[40px] rounded-[10px] border-[2px] border-slate-900 flex items-center justify-center font-black text-[14px] text-white shadow-[2px_2px_0px_#0f172a]" style={{ background: activeProf.gradient, fontFamily: 'var(--font-impact)' }}>
                          {activeProf.name.split(' ').map((n: string) => n[0]).join('')}
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
                      <button onClick={onClose} className="w-[32px] h-[32px] bg-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] rounded-lg flex items-center justify-center"><X className="w-5 h-5 text-slate-900" /></button>
                    </div>

                    <div className="p-[24px_28px] flex-1 overflow-y-auto bg-[var(--bg-a)]">
                      <div className="bg-white border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[16px] p-[24px]">
                        <div className="flex gap-[16px] items-center mb-[20px]">
                          <div className="w-[48px] h-[48px] rounded-[12px] border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a] flex items-center justify-center font-black text-[18px] text-white shrink-0" style={{ background: activeProf.gradient, fontFamily: 'var(--font-impact)' }}>
                            {activeProf.name.split(' ').map((n: string) => n[0]).join('')}
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
                        onClick={onConfirm}
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
                      onClick={onClose}
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
  );
}
