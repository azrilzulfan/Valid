// HALAMAN: komponen/reviews/ReviewListCard
// FUNGSI: Menampilkan satu item card untuk review di halaman Reviews
// API YANG DIBUTUHKAN: -
// DUMMY DATA: Menampilkan data review dummy

import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { BAR_COLORS, STATUS_COLORS } from './dummyData';

export function ReviewListCard({ review, onClick, onCancel }: any) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
      onClick={onClick}
      className="bg-[var(--card-bg)] border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[24px] overflow-hidden cursor-pointer hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all flex flex-col group"
    >
      {/* Status Bar */}
      <div className={`w-full h-[6px] ${BAR_COLORS[review.status as keyof typeof BAR_COLORS]}`} />
      
      <div className="p-[20px_24px] flex flex-col md:flex-row md:items-start justify-between gap-[16px]">
        {/* Left side */}
        <div>
          <div className="font-bold text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-[6px]" style={{ fontFamily: 'var(--font-body)' }}>PROYEK</div>
          <div className="font-black text-[20px] text-[var(--text-color)] uppercase leading-tight" style={{ fontFamily: 'var(--font-impact)' }}>{review.project}</div>
          
          <div className="flex items-center gap-[12px] mt-[16px] bg-[var(--bg-a)] p-[8px_12px] rounded-[12px] border-[2px] border-[var(--border-color)] inline-flex">
            <div className="w-[32px] h-[32px] rounded-[8px] border-[2px] border-slate-900 flex items-center justify-center font-black text-[14px] text-white" style={{ background: review.gradient, fontFamily: 'var(--font-impact)' }}>
              {review.reviewerName.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[10px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>Direview oleh</span>
              <span className="font-black text-[13px] text-slate-900" style={{ fontFamily: 'var(--font-body)' }}>{review.reviewerName}</span>
            </div>
            <div className="bg-blue-100 border-[2px] border-blue-500 rounded-md px-[6px] py-[2px] font-black text-[9px] text-blue-700 ml-2 shadow-[1px_1px_0px_#3b82f6]" style={{ fontFamily: 'var(--font-body)' }}>BNSP</div>
          </div>
        </div>

        {/* Right side status */}
        <div className="flex flex-col md:items-end">
          <div className={`px-[12px] py-[6px] rounded-lg border-[2.5px] font-black text-[11px] uppercase tracking-widest shadow-[2px_2px_0px_currentColor] ${STATUS_COLORS[review.status as keyof typeof STATUS_COLORS]}`} style={{ fontFamily: 'var(--font-body)' }}>
            {review.status}
          </div>
          <div className="font-bold text-[12px] text-[var(--text-muted)] mt-[10px]" style={{ fontFamily: 'var(--font-body)' }}>{review.date}</div>
        </div>
      </div>

      <div className="w-full border-t-[2.5px] border-dashed border-[var(--border-color)]" />

      <div className="p-[20px_24px] flex flex-wrap md:flex-nowrap justify-between items-end gap-[16px] bg-slate-50">
        {/* Coins */}
        <div>
          <div className="flex items-center gap-[6px]">
            <Coins className="w-[18px] h-[18px] text-yellow-500" />
            <span className="font-black text-[24px] text-[var(--text-color)] leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{review.price}</span>
            <span className="font-bold text-[12px] text-[var(--text-muted)] uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>koin</span>
          </div>
        </div>

        {/* Score */}
        {review.score && (
          <div className="flex flex-col items-center">
            <span className="font-black text-[11px] uppercase tracking-widest text-blue-600 mb-[4px]" style={{ fontFamily: 'var(--font-body)' }}>SKOR WAWANCARA</span>
            <div className="flex items-end gap-[2px]">
              <span className="font-black text-[28px] text-slate-900 leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{review.score}</span>
              <span className="font-bold text-[13px] text-[var(--text-muted)] pb-1" style={{ fontFamily: 'var(--font-body)' }}>/100</span>
            </div>
          </div>
        )}

        {/* Button */}
        <div>
          {review.status === 'MENUNGGU' && (
            <button onClick={(e) => { e.stopPropagation(); onCancel(review.id); }} className="border-[2.5px] border-red-500 bg-red-50 text-red-600 rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_#ef4444]" style={{ fontFamily: 'var(--font-body)' }}>BATALKAN</button>
          )}
          {review.status === 'DITERIMA' && (
            <button className="border-[2.5px] border-blue-600 bg-blue-50 text-blue-700 rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-[2px_2px_0px_#2563eb]" style={{ fontFamily: 'var(--font-body)' }}>LIHAT DETAIL →</button>
          )}
          {review.status === 'SELESAI' && (
            <button className="border-[2.5px] border-slate-900 bg-green-500 text-slate-900 rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest group-hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>LIHAT FEEDBACK →</button>
          )}
          {review.status === 'DITOLAK' && (
            <button className="border-[2.5px] border-[var(--border-color)] bg-white text-[var(--text-color)] rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest hover:border-slate-900 shadow-[2px_2px_0px_var(--shadow-color)]" style={{ fontFamily: 'var(--font-body)' }}>CARI LAIN →</button>
          )}
        </div>
      </div>
      
      {review.status === 'DITOLAK' && review.reason && (
        <div className="p-[16px_24px] bg-red-100 border-t-[2.5px] border-red-200">
          <span className="font-bold text-[11px] text-red-500 uppercase tracking-widest mr-2" style={{ fontFamily: 'var(--font-body)' }}>Alasan:</span>
          <span className="font-bold text-[13px] text-red-700 italic" style={{ fontFamily: 'var(--font-body)' }}>"{review.reason}"</span>
        </div>
      )}
    </motion.div>
  );
}
