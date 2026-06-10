// HALAMAN: komponen/auth/RegisterStepConfirmation
// FUNGSI: Menampilkan langkah ke-3 dari registrasi (konfirmasi data yang sudah diisi)
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { motion } from 'framer-motion';

export function RegisterStepConfirmation({
  slideVariants, role, 
  nama, email, sertifikat, 
  isLoading, onBack, onSubmit
}: any) {
  return (
    <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" className="w-full pb-8">
      <div>
        <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)]" style={{ fontFamily: "var(--font-impact)" }}>
          Hampir<br />
          <span className="text-blue-600">Selesai!</span>
        </h2>
        <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
          Periksa data kamu sebelum mendaftar.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-6 sm:p-8 shadow-[8px_8px_0px_var(--shadow-color)] mt-8">
        <div className="flex justify-between items-center py-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">Nama</span>
          <span className="text-sm font-bold text-[var(--text-color)]">{nama || '-'}</span>
        </div>
        <div className="h-[2px] bg-[var(--border-color)] opacity-10 my-1" />
        <div className="flex justify-between items-center py-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">Email</span>
          <span className="text-sm font-bold text-[var(--text-color)]">{email || '-'}</span>
        </div>
        <div className="h-[2px] bg-[var(--border-color)] opacity-10 my-1" />
        <div className="flex justify-between items-center py-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">Peran</span>
          <span className="text-sm font-bold text-[var(--text-color)]">{role === 'pencari_kerja' ? 'Pencari Kerja' : 'Profesional BNSP'}</span>
        </div>
        {role === 'pro' && (
          <>
            <div className="h-[2px] bg-[var(--border-color)] opacity-10 my-1" />
            <div className="flex justify-between items-center py-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">No. Sertifikat</span>
              <span className="text-sm font-bold text-[var(--text-color)]">{sertifikat || '-'}</span>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-center mt-6">
        {role === 'pencari_kerja' ? (
          <div className="px-4 py-2 rounded-xl border-[2.5px] border-[var(--border-color)] bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_var(--shadow-color)]">
            Pencari Kerja
          </div>
        ) : (
          <div className="px-4 py-2 rounded-xl border-[2.5px] border-[var(--border-color)] bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_var(--shadow-color)]">
            Profesional BNSP &middot; Menunggu Verifikasi
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={onBack}
          disabled={isLoading}
          className="w-[25%] bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-2xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_var(--shadow-color)] flex items-center justify-center"
        >
          ←
        </button>
        <button 
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#0f172a]"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : (
            'Daftar VALID'
          )}
        </button>
      </div>
    </motion.div>
  );
}
