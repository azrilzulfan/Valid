// HALAMAN: komponen/auth/RegisterStepChooseRole
// FUNGSI: Menampilkan langkah 1 registrasi (pilih peran)
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { motion } from 'framer-motion';

export function RegisterStepChooseRole({ slideVariants, role, setRole, onNext }: any) {
  return (
    <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="w-full pb-8">
      <div>
        <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)]" style={{ fontFamily: "var(--font-impact)" }}>
          Mulai<br />
          <span className="text-blue-600">Bergabung</span>
        </h2>
        <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
          Pilih peran yang sesuai denganmu.
        </p>
      </div>

      <div className="flex flex-col gap-5 mt-8 w-full">
        {/* Card 1 */}
        <div 
          onClick={() => setRole('pencari_kerja')}
          className={`relative border-[3px] rounded-[1.5rem] p-6 cursor-pointer bg-[var(--card-bg)] transition-all duration-300 ${
            role === 'pencari_kerja' ? 'border-blue-600 shadow-[6px_6px_0px_#2563eb] -translate-y-1' : 'border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)]'
          }`}
        >
          {role === 'pencari_kerja' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[var(--card-bg)] shadow-[2px_2px_0px_#0f172a]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
          <div className={`w-12 h-12 rounded-xl border-[2.5px] border-[var(--border-color)] flex items-center justify-center shadow-[2px_2px_0px_var(--border-color)] ${role === 'pencari_kerja' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </div>
          <div className="text-xl font-black text-[var(--text-color)] uppercase tracking-tight mt-4" style={{ fontFamily: "var(--font-impact)" }}>Pencari Kerja</div>
          <div className="text-[13px] font-bold text-[var(--text-muted)] mt-2 leading-relaxed">
            Buat portfolio terverifikasi dan ikuti wawancara AI.
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['AI Interview', 'Portfolio', 'Gratis'].map(p => (
              <div key={p} className="px-3 py-1 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-a)] text-[10px] font-black uppercase tracking-widest text-[var(--text-color)] shadow-[2px_2px_0px_var(--border-color)]">{p}</div>
            ))}
          </div>
        </div>

        {/* Card 2 */}
        <div 
          onClick={() => setRole('pro')}
          className={`relative border-[3px] rounded-[1.5rem] p-6 cursor-pointer bg-[var(--card-bg)] transition-all duration-300 ${
            role === 'pro' ? 'border-yellow-500 shadow-[6px_6px_0px_#eab308] -translate-y-1' : 'border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)]'
          }`}
        >
          {role === 'pro' && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-[var(--card-bg)] shadow-[2px_2px_0px_#0f172a]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          )}
          <div className={`w-12 h-12 rounded-xl border-[2.5px] border-[var(--border-color)] flex items-center justify-center shadow-[2px_2px_0px_var(--border-color)] ${role === 'pro' ? 'bg-yellow-400 text-slate-900' : 'bg-yellow-100 text-yellow-600'}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div className="text-xl font-black text-[var(--text-color)] uppercase tracking-tight mt-4" style={{ fontFamily: "var(--font-impact)" }}>Profesional BNSP</div>
          <div className="text-[13px] font-bold text-[var(--text-muted)] mt-2 leading-relaxed">
            Verifikasi keahlian lulusan dan dapatkan penghasilan dari review.
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Review Berbayar', 'Koin', 'Sertifikasi'].map(p => (
              <div key={p} className="px-3 py-1 rounded-lg border-2 border-[var(--border-color)] bg-[var(--bg-a)] text-[10px] font-black uppercase tracking-widest text-[var(--text-color)] shadow-[2px_2px_0px_var(--border-color)]">{p}</div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full mt-8 inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600"
      >
        Lanjut →
      </button>
    </motion.div>
  );
}
