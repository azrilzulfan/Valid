// HALAMAN: komponen/auth/RegisterStepFillDetails
// FUNGSI: Menampilkan form data pendaftaran berdasarkan peran (pencari kerja atau pro)
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { motion, AnimatePresence } from 'framer-motion';

export function RegisterStepFillDetails({
  slideVariants, role, 
  nama, setNama, 
  email, setEmail, 
  password, setPassword, 
  confirmPassword, setConfirmPassword, 
  showPassword, setShowPassword, 
  showConfirmPassword, setShowConfirmPassword, 
  sertifikat, setSertifikat, 
  onBack, onNext
}: any) {
  return (
    <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="w-full pb-8">
      <div>
        <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)]" style={{ fontFamily: "var(--font-impact)" }}>
          Isi Data<br />
          <span className="text-blue-600">Kamu</span>
        </h2>
        <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
          {role === 'pencari_kerja' ? 'Lengkapi profil pencari kerjamu.' : 'Lengkapi data profesional BNSP kamu.'}
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-6 sm:p-8 shadow-[8px_8px_0px_var(--shadow-color)] relative mt-8">
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Nama Lengkap</label>
            <input 
              type="text" value={nama} onChange={e => setNama(e.target.value)} placeholder="Rizky Pratama"
              className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Email</label>
            <input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com"
              className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 pr-12 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-color)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Konfirmasi Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 pr-12 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-color)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {showConfirmPassword ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                </svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {role === 'pro' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-col gap-5 overflow-hidden">
                <div className="pt-2">
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Nomor Sertifikat BNSP</label>
                  <input 
                    type="text" value={sertifikat} onChange={e => setSertifikat(e.target.value)} placeholder="BNSP-XXXXX-XXXX"
                    className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>
                <div className="group border-[2.5px] border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-a)] p-8 text-center cursor-pointer transition-colors duration-300 hover:border-yellow-500 hover:bg-yellow-500/5">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[var(--text-muted)] group-hover:text-yellow-500 transition-colors"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 16 4-4 4 4"/></svg>
                  <div className="text-[13px] font-bold text-[var(--text-color)] mt-4">Klik atau seret dokumen BNSP ke sini</div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)] mt-2">PDF, JPG, PNG hingga 5MB</div>
                </div>
                <div className="flex items-start gap-3 bg-yellow-100 dark:bg-yellow-900/30 border-[2.5px] border-[var(--border-color)] rounded-xl p-4 mt-1 shadow-[4px_4px_0px_var(--shadow-color)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 text-yellow-600"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span className="text-[13px] font-bold text-[var(--text-color)]">Akun profesional memerlukan verifikasi admin sebelum dapat digunakan.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={onBack}
          className="w-[30%] bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-2xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all duration-300"
        >
          ← Back
        </button>
        <button 
          onClick={onNext}
          className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600"
        >
          Lanjut →
        </button>
      </div>
    </motion.div>
  );
}
