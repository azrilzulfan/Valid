// HALAMAN: komponen/reviews/ReviewDetailPanel
// FUNGSI: Menampilkan panel detail review (slide-over)
// API YANG DIBUTUHKAN: -
// DUMMY DATA: Menampilkan detail review dummy

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Hourglass, XCircle, Download, Coins, Star } from 'lucide-react';
import { STATUS_COLORS } from './dummyData';
import { ScoreRing } from './ScoreRing';

export function ReviewDetailPanel({ 
  isOpen, 
  onClose, 
  selectedReview, 
  slideOverVariants,
  onCancel
}: any) {
  if (!isOpen || !selectedReview) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
      />

      {/* Slide-over Panel */}
      <motion.div 
        variants={slideOverVariants}
        initial="hidden" animate="visible" exit="exit"
        className="fixed top-0 right-0 w-full md:w-[500px] h-screen bg-[var(--bg-a)] border-l-[3.5px] border-slate-900 shadow-[-12px_0_0_rgba(0,0,0,0.1)] z-50 overflow-y-auto flex flex-col"
      >
        <div className="flex justify-between items-center p-[24px_32px] border-b-[3.5px] border-slate-900 bg-white sticky top-0 z-20">
          <div>
            <div className="font-black text-[24px] uppercase text-slate-900 leading-none" style={{ fontFamily: 'var(--font-impact)' }}>DETAIL REVIEW</div>
            <div className={`mt-[12px] inline-block px-[12px] py-[4px] rounded-lg border-[2px] font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_currentColor] ${STATUS_COLORS[selectedReview.status as keyof typeof STATUS_COLORS]}`} style={{ fontFamily: 'var(--font-body)' }}>
              {selectedReview.status}
            </div>
          </div>
          <button onClick={onClose} className="w-[36px] h-[36px] bg-white border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"><X className="w-5 h-5 text-slate-900" /></button>
        </div>

        <div className="p-[32px] flex flex-col gap-[24px]">
          {/* General Info Card */}
          <div className="bg-white border-[3px] border-slate-900 rounded-[20px] p-[20px] shadow-[6px_6px_0px_#0f172a]">
            <div className="flex flex-col gap-[12px]">
              <div className="flex justify-between items-center pb-[12px] border-b-[2px] border-dashed border-slate-200">
                <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>PROYEK</span>
                <span className="font-black text-[14px] text-slate-900 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{selectedReview.project}</span>
              </div>
              <div className="flex justify-between items-center pb-[12px] border-b-[2px] border-dashed border-slate-200">
                <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>REVIEWER</span>
                <div className="flex items-center gap-[8px]">
                  <span className="font-black text-[14px] text-slate-900" style={{ fontFamily: 'var(--font-body)' }}>{selectedReview.reviewerName}</span>
                  <div className="bg-blue-100 border-[2px] border-blue-500 rounded-md px-[6px] py-[2px] font-black text-[9px] text-blue-700 shadow-[1px_1px_0px_#3b82f6]" style={{ fontFamily: 'var(--font-body)' }}>BNSP</div>
                </div>
              </div>
              <div className="flex justify-between items-center pb-[12px] border-b-[2px] border-dashed border-slate-200">
                <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>KOIN</span>
                <span className="font-black text-[16px] text-yellow-600" style={{ fontFamily: 'var(--font-impact)' }}>{selectedReview.price} koin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>TANGGAL</span>
                <span className="font-black text-[13px] text-slate-700" style={{ fontFamily: 'var(--font-body)' }}>{selectedReview.date}</span>
              </div>
            </div>
          </div>

          {/* Conditional Content */}
          {selectedReview.status === 'MENUNGGU' && (
            <>
              <div className="bg-yellow-100 border-[3px] border-yellow-500 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#eab308] text-center">
                <Hourglass className="w-[40px] h-[40px] text-yellow-600 mx-auto mb-[12px]" />
                <div className="font-black text-[20px] text-yellow-900 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Menunggu Respons</div>
                <div className="font-bold text-[13px] text-yellow-800 mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Profesional biasanya merespons dalam 24 jam.</div>
                
                <div className="mt-[24px] flex flex-col gap-[16px] text-left relative pl-[8px]">
                  <div className="absolute left-[13px] top-[10px] bottom-[10px] w-[2px] bg-yellow-300" />
                  <div className="flex items-center gap-[16px] relative z-10">
                    <div className="w-[12px] h-[12px] rounded-full bg-green-500 border-[2px] border-slate-900" />
                    <div className="flex justify-between w-full">
                      <span className="font-black text-[12px] text-slate-900 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Request Terkirim</span>
                      <span className="font-bold text-[11px] text-slate-600">{selectedReview.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[16px] relative z-10">
                    <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-yellow-400" />
                    <div className="flex justify-between w-full">
                      <span className="font-bold text-[12px] text-slate-500 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Profesional Merespons</span>
                      <span className="font-bold text-[11px] text-slate-400">Menunggu...</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[16px] relative z-10">
                    <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-yellow-400" />
                    <div className="flex justify-between w-full">
                      <span className="font-bold text-[12px] text-slate-500 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Review Selesai</span>
                      <span className="font-bold text-[11px] text-slate-400">-</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => {
                  onCancel(selectedReview.id);
                  onClose();
                }}
                className="w-full bg-red-100 border-[3px] border-red-500 rounded-[16px] p-[16px] font-black text-[14px] uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_#ef4444]" style={{ fontFamily: 'var(--font-body)' }}
              >
                BATALKAN REQUEST
              </button>
            </>
          )}

          {selectedReview.status === 'DITERIMA' && (
            <>
              <div className="bg-blue-100 border-[3px] border-blue-500 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#3b82f6] text-center">
                <CheckCircle2 className="w-[40px] h-[40px] text-blue-600 mx-auto mb-[12px]" />
                <div className="font-black text-[20px] text-blue-900 uppercase leading-none" style={{ fontFamily: 'var(--font-impact)' }}>Profesional Menerima Request</div>
                <div className="font-bold text-[13px] text-blue-800 mt-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Review sedang dalam proses.</div>
                
                <div className="mt-[24px] flex flex-col gap-[16px] text-left relative pl-[8px]">
                  <div className="absolute left-[13px] top-[10px] bottom-[10px] w-[2px] bg-blue-300" />
                  <div className="flex items-center gap-[16px] relative z-10">
                    <div className="w-[12px] h-[12px] rounded-full bg-green-500 border-[2px] border-slate-900" />
                    <div className="flex justify-between w-full">
                      <span className="font-black text-[12px] text-slate-900 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Request Terkirim</span>
                      <span className="font-bold text-[11px] text-slate-600">Selesai</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[16px] relative z-10">
                    <div className="w-[12px] h-[12px] rounded-full bg-blue-500 border-[2px] border-slate-900" />
                    <div className="flex justify-between w-full">
                      <span className="font-black text-[12px] text-slate-900 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Profesional Menerima</span>
                      <span className="font-bold text-[11px] text-blue-700">Hari ini</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-[16px] relative z-10">
                    <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-blue-300" />
                    <div className="flex justify-between w-full">
                      <span className="font-bold text-[12px] text-slate-500 uppercase" style={{ fontFamily: 'var(--font-body)' }}>Review Selesai</span>
                      <span className="font-bold text-[11px] text-slate-400">Dalam Proses</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white border-[2.5px] border-slate-900 rounded-[16px] p-[16px] text-center shadow-[4px_4px_0px_#0f172a]">
                <span className="font-bold text-[13px] text-slate-700" style={{ fontFamily: 'var(--font-body)' }}>Kamu akan mendapat notifikasi ketika review selesai.</span>
              </div>
            </>
          )}

          {selectedReview.status === 'SELESAI' && (
            <>
              <div className="mb-[16px]">
                <ScoreRing score={selectedReview.score || 0} />
                
                <div className="mt-[32px] flex flex-col gap-[16px]">
                  {['KONTAK MATA', 'KEPERCAYAAN DIRI', 'KOMUNIKASI'].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-[6px]">
                        <span className="font-black text-[11px] text-slate-700 uppercase" style={{ fontFamily: 'var(--font-body)' }}>{metric}</span>
                      </div>
                      <div className="w-full h-[12px] bg-white border-[2px] border-slate-900 rounded-full overflow-hidden shadow-[2px_2px_0px_#0f172a]">
                        <div className="h-full bg-blue-500" style={{ width: `${70 + Math.random() * 20}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full border-t-[3px] border-dashed border-slate-300" />

              <div>
                <div className="font-black text-[16px] uppercase text-slate-900 mb-[16px] inline-block bg-yellow-300 px-3 py-1 border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-impact)' }}>FEEDBACK PROFESIONAL</div>
                
                <div className="bg-white border-[3px] border-slate-900 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#0f172a]">
                  <div className="flex items-center gap-[12px] mb-[16px]">
                    <div className="w-[40px] h-[40px] rounded-[10px] border-[2px] border-slate-900 flex items-center justify-center font-black text-[16px] text-white" style={{ background: selectedReview.gradient, fontFamily: 'var(--font-impact)' }}>
                      {selectedReview.reviewerName.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-black text-[14px] text-slate-900" style={{ fontFamily: 'var(--font-body)' }}>{selectedReview.reviewerName}</div>
                      <div className="font-black text-[9px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-sm inline-block border-[1px] border-blue-400 mt-1" style={{ fontFamily: 'var(--font-body)' }}>BNSP VERIFIED</div>
                    </div>
                  </div>
                  
                  <div className="font-bold text-[14px] text-slate-800 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                    "{selectedReview.feedback}"
                  </div>

                  <div className="flex flex-wrap gap-[8px] mt-[20px]">
                    {selectedReview.verifiedSkills?.map((skill: string, idx: number) => (
                      <div key={idx} className="border-[2px] border-blue-500 text-blue-700 bg-blue-50 rounded-[8px] px-[10px] py-[6px] font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0px_#3b82f6]" style={{ fontFamily: 'var(--font-body)' }}>
                        {skill}
                      </div>
                    ))}
                  </div>

                  <div className="mt-[20px] pt-[20px] border-t-[2px] border-dashed border-slate-200">
                    <span className="font-bold text-[12px] text-[var(--text-muted)] mr-[8px]" style={{ fontFamily: 'var(--font-body)' }}>Rating kamu:</span>
                    <div className="inline-flex gap-[4px] align-middle">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} className={`w-[16px] h-[16px] ${idx < (selectedReview.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 border-[3px] border-slate-900 rounded-[16px] p-[16px] font-black text-[14px] uppercase tracking-widest text-white hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-[6px_6px_0px_#0f172a] flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-body)' }}>
                <Download className="w-5 h-5" /> UNDUH LAPORAN PDF
              </button>
            </>
          )}

          {selectedReview.status === 'DITOLAK' && (
            <>
              <div className="bg-red-100 border-[3px] border-red-500 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#ef4444] text-center">
                <XCircle className="w-[48px] h-[48px] text-red-600 mx-auto mb-[12px]" />
                <div className="font-black text-[24px] text-red-900 uppercase leading-none" style={{ fontFamily: 'var(--font-impact)' }}>Request Ditolak</div>
                <div className="font-bold text-[14px] text-red-700 mt-[12px] italic bg-red-50 border-[2px] border-red-300 p-[12px] rounded-xl" style={{ fontFamily: 'var(--font-body)' }}>
                  "{selectedReview.reason}"
                </div>
              </div>
              
              <div className="bg-green-100 border-[2.5px] border-green-500 rounded-[16px] p-[16px] text-center shadow-[4px_4px_0px_#22c55e] flex items-center justify-center gap-[8px]">
                <Coins className="w-[18px] h-[18px] text-green-700" />
                <span className="font-bold text-[13px] text-green-800" style={{ fontFamily: 'var(--font-body)' }}>Koin sebesar <span className="font-black text-green-900">{selectedReview.price} koin</span> telah dikembalikan.</span>
              </div>

              <button 
                onClick={() => window.location.href = '/dashboard/professionals'}
                className="w-full bg-blue-600 border-[3px] border-slate-900 rounded-[16px] p-[16px] font-black text-[14px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all shadow-[6px_6px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}
              >
                CARI REVIEWER LAIN →
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
