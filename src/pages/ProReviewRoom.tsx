// HALAMAN: C:\laragon\www\valid-react\src\pages\ProReviewRoom.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion } from 'framer-motion';
import { 
  X, Play, Clock, CheckCircle2, ChevronLeft, Star, Send, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

export function ProReviewRoom() {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F0F4F8] text-[var(--text-color)] font-sans">
      
      {/* TOP NAV */}
      <div className="flex items-center justify-between px-[24px] py-[16px] bg-white border-b-[3px] border-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => window.location.href = '/pro/dashboard'}
            className="w-[40px] h-[40px] rounded-[10px] border-[2.5px] border-slate-900 bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a]"
          >
            <ChevronLeft className="w-5 h-5 text-slate-900" />
          </button>
          <div>
            <div className="font-black text-[18px] text-slate-900 leading-tight uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>REVIEW ROOM</div>
            <div className="font-bold text-[10px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Kandidat: Budi Santoso</div>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 border-[2px] border-yellow-500 rounded-full">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="font-black text-[10px] text-yellow-700 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Batas Waktu: 2 Hari</span>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-[1400px] mx-auto p-[16px] lg:p-[32px] gap-[32px]">
        
        {/* LEFT PANEL: Candidate Profile & Portfolio */}
        <div className="flex-1 flex flex-col gap-[24px]">
          
          {/* Profile Overview */}
          <div className="bg-white rounded-[1.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] p-[24px]">
            <div className="flex items-start gap-4">
               <div className="w-[80px] h-[80px] rounded-[16px] border-[3px] border-slate-900 bg-blue-100 flex items-center justify-center shadow-[4px_4px_0px_#0f172a] shrink-0">
                 <span className="font-black text-[32px] text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>B</span>
               </div>
               <div>
                 <h3 className="font-black text-[24px] md:text-[28px] text-slate-900 uppercase tracking-tight leading-none mb-1" style={{ fontFamily: 'var(--font-impact)' }}>Budi Santoso</h3>
                 <p className="font-bold text-[12px] md:text-[13px] text-slate-500 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-body)' }}>Quality Control Inspector</p>
                 <div className="flex flex-wrap gap-2">
                   <span className="px-2 py-1 bg-slate-100 border-[2px] border-slate-900 rounded-md font-black text-[9px] uppercase tracking-widest text-slate-700" style={{ fontFamily: 'var(--font-body)' }}>Pengelasan</span>
                   <span className="px-2 py-1 bg-slate-100 border-[2px] border-slate-900 rounded-md font-black text-[9px] uppercase tracking-widest text-slate-700" style={{ fontFamily: 'var(--font-body)' }}>CNC Machining</span>
                   <span className="px-2 py-1 bg-slate-100 border-[2px] border-slate-900 rounded-md font-black text-[9px] uppercase tracking-widest text-slate-700" style={{ fontFamily: 'var(--font-body)' }}>AutoCAD</span>
                 </div>
               </div>
            </div>
            <p className="mt-5 font-bold text-[13px] text-slate-600 leading-relaxed border-t-[2.5px] border-dashed border-slate-200 pt-4" style={{ fontFamily: 'var(--font-body)' }}>
              "Saya adalah inspektur *quality control* dengan pengalaman 3 tahun di industri manufaktur, berfokus pada efisiensi proses produksi dan meminimalisir tingkat cacat produk."
            </p>
          </div>

          {/* AI Score Overview (Compact) */}
          <div className="bg-blue-600 rounded-[1.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] p-[24px] text-white">
            <div className="flex justify-between items-center mb-[20px]">
              <h3 className="font-black text-[16px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-impact)' }}>
                HASIL WAWANCARA AI
              </h3>
              <div className="px-3 py-1 bg-white border-[2px] border-slate-900 text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>Skor: 78/100</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
              {[
                { label: 'Kontak Mata', score: 84 },
                { label: 'Kepercayaan Diri', score: 71 },
                { label: 'Komunikasi', score: 79 }
              ].map((m, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-[10px] text-blue-200 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>{m.label}</span>
                    <span className="font-black text-[14px] text-white" style={{ fontFamily: 'var(--font-impact)' }}>{m.score}%</span>
                  </div>
                  <div className="w-full h-[6px] bg-blue-900/50 border border-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 border-r border-slate-900 rounded-r-full" style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portfolio Projects */}
          <div className="bg-white rounded-[1.5rem] border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] overflow-hidden flex flex-col flex-1">
            <div className="bg-yellow-300 px-[24px] py-[16px] border-b-[3px] border-slate-900 flex justify-between items-center">
               <h3 className="font-black text-[16px] text-slate-900 uppercase tracking-wider" style={{ fontFamily: 'var(--font-impact)' }}>PROYEK PORTFOLIO</h3>
               <span className="font-bold text-[10px] uppercase tracking-widest text-slate-800" style={{ fontFamily: 'var(--font-body)' }}>2 Proyek Diunggah</span>
            </div>
            <div className="p-[24px] flex flex-col gap-4 overflow-y-auto max-h-[350px]">
               {/* Project Item */}
               <div className="border-[2.5px] border-slate-900 rounded-xl p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                 <h4 className="font-black text-[14px] text-slate-900 uppercase group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'var(--font-impact)' }}>Sistem Inspeksi Otomatis</h4>
                 <p className="font-bold text-[11px] text-slate-500 uppercase tracking-widest mt-1 mb-2" style={{ fontFamily: 'var(--font-body)' }}>PT. Manufaktur Sukses • 2025</p>
                 <p className="font-bold text-[12px] text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>Merancang sistem inspeksi visual berbasis komputer untuk mendeteksi cacat mikro pada komponen mesin, mengurangi tingkat kecacatan produk hingga 15%.</p>
                 <div className="mt-3 flex flex-wrap gap-2">
                   <span className="text-[10px] bg-blue-100 border-[2px] border-blue-200 text-blue-700 px-2 py-1 rounded-md font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Computer Vision</span>
                   <span className="text-[10px] bg-blue-100 border-[2px] border-blue-200 text-blue-700 px-2 py-1 rounded-md font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>Quality Assurance</span>
                 </div>
               </div>

               {/* Project Item */}
               <div className="border-[2.5px] border-slate-900 rounded-xl p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                 <h4 className="font-black text-[14px] text-slate-900 uppercase group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'var(--font-impact)' }}>Optimasi Mesin CNC</h4>
                 <p className="font-bold text-[11px] text-slate-500 uppercase tracking-widest mt-1 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Proyek Mandiri • 2024</p>
                 <p className="font-bold text-[12px] text-slate-600 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>Menganalisis dan memprogram ulang jalur permesinan pada mesin CNC untuk mengurangi waktu pemotongan sebesar 10% tanpa mengorbankan kualitas.</p>
                 <div className="mt-3 flex flex-wrap gap-2">
                   <span className="text-[10px] bg-blue-100 border-[2px] border-blue-200 text-blue-700 px-2 py-1 rounded-md font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>CNC Programming</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Feedback Form */}
        <div className="flex-1 lg:max-w-[500px] flex flex-col bg-white rounded-[1.5rem] border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] overflow-hidden">
          <div className="bg-yellow-300 p-[24px] border-b-[3px] border-slate-900">
            <h2 className="font-black text-[24px] text-slate-900 uppercase tracking-tighter" style={{ fontFamily: 'var(--font-impact)' }}>FORMULIR REVIEW</h2>
            <p className="font-bold text-[12px] text-slate-800 tracking-wider mt-1" style={{ fontFamily: 'var(--font-body)' }}>
              Berikan feedback konstruktif untuk membantu kandidat berkembang.
            </p>
          </div>

          <div className="p-[24px] flex-1 overflow-y-auto flex flex-col gap-[20px]">
            {/* Rating */}
            <div>
              <label className="font-black text-[11px] text-slate-900 uppercase tracking-widest block mb-2" style={{ fontFamily: 'var(--font-body)' }}>Penilaian Keseluruhan</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className="w-[44px] h-[44px] rounded-xl border-[2.5px] border-slate-900 flex items-center justify-center hover:-translate-y-1 hover:shadow-[3px_3px_0px_#0f172a] transition-all bg-white"
                  >
                    <Star className={`w-6 h-6 ${rating >= star ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* General Feedback */}
            <div>
              <label className="font-black text-[11px] text-slate-900 uppercase tracking-widest block mb-2" style={{ fontFamily: 'var(--font-body)' }}>Feedback Utama</label>
              <textarea 
                className="w-full min-h-[120px] bg-slate-50 border-[2.5px] border-slate-900 rounded-xl p-4 font-bold text-[13px] text-slate-700 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all resize-none"
                placeholder="Tuliskan kesan umum dan saran utama Anda di sini..."
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Strengths */}
            <div>
              <label className="font-black text-[11px] text-slate-900 uppercase tracking-widest block mb-2" style={{ fontFamily: 'var(--font-body)' }}>Kekuatan Kandidat (Poin)</label>
              <textarea 
                className="w-full min-h-[80px] bg-slate-50 border-[2.5px] border-slate-900 rounded-xl p-4 font-bold text-[13px] text-slate-700 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all resize-none"
                placeholder="- Pemahaman teknis yang kuat..."
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            {/* Areas for Improvement */}
            <div>
              <label className="font-black text-[11px] text-slate-900 uppercase tracking-widest block mb-2" style={{ fontFamily: 'var(--font-body)' }}>Area Peningkatan (Poin)</label>
              <textarea 
                className="w-full min-h-[80px] bg-slate-50 border-[2.5px] border-slate-900 rounded-xl p-4 font-bold text-[13px] text-slate-700 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0px_#0f172a] transition-all resize-none"
                placeholder="- Kurangi penggunaan filler words..."
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>

            <div className="bg-yellow-50 border-[2px] border-dashed border-yellow-400 p-3 rounded-xl flex items-start gap-3 mt-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <p className="font-bold text-[10px] text-yellow-800 leading-relaxed uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
                Dengan menekan Kirim, review akan dikirim secara permanen ke dashboard kandidat dan Koin Anda akan bertambah.
              </p>
            </div>
          </div>

          <div className="p-[24px] border-t-[3px] border-slate-900 bg-slate-50">
            <button 
              onClick={() => window.location.href = '/pro/dashboard'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[1rem] px-[24px] py-[16px] font-black text-[14px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all flex items-center justify-center gap-2" 
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <Send className="w-5 h-5" /> Kirim Review Final
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
