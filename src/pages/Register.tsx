import { motion, AnimatePresence, Variants } from 'framer-motion';
import { AuthLeftPanel } from '../components/auth/AuthLeftPanel';
import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';

const slideVariants: Variants = {
  enter: { x: 30, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { x: -30, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
};

export function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<'pencari_kerja' | 'pro'>('pencari_kerja');
  
  // Form state
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sertifikat, setSertifikat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleToConfirm = () => setStep(3);
  const handleBackToForm = () => setStep(2);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate({ to: (role === 'pencari_kerja' ? '/dashboard' : '/pro/dashboard') as any });
    }, 1200);
  };

  const progressWidth = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-[var(--bg-a)]">
      <AuthLeftPanel />
      
      {/* RIGHT PANEL */}
      <div className="w-full md:w-[58%] flex flex-col h-full bg-[var(--bg-a)] relative overflow-y-auto">
        
        {/* Progress Bar & Dots */}
        <div className="w-full px-8 pt-8 md:px-16 md:pt-12 max-w-[500px] mx-auto shrink-0">
          <div className="relative w-full h-[6px] bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full overflow-hidden shadow-[2px_2px_0px_var(--shadow-color)]">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-600 border-r-[2px] border-[var(--border-color)]"
              style={{ width: progressWidth, transition: 'width 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            />
          </div>
          <div className="flex justify-between mt-4 px-2">
            {[
              { id: 1, label: 'Pilih Peran' },
              { id: 2, label: 'Isi Data' },
              { id: 3, label: 'Konfirmasi' }
            ].map((s) => {
              const isActive = step === s.id;
              const isPast = step > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 w-20">
                  <div 
                    className="w-3 h-3 rounded-full border-[2px] transition-colors duration-300 shadow-[1px_1px_0px_var(--shadow-color)]"
                    style={{
                      background: isActive || isPast ? '#2563eb' : 'var(--card-bg)',
                      borderColor: 'var(--border-color)',
                    }}
                  />
                  <div className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black transition-colors duration-300 text-center ${isActive || isPast ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--text-muted)]'}`}>
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col pt-8 pb-12 px-6 md:px-12 w-full max-w-[500px] mx-auto relative overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Choose Role */}
            {step === 1 && (
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
                  onClick={handleNext}
                  className="w-full mt-8 inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600"
                >
                  Lanjut →
                </button>
              </motion.div>
            )}

            {/* STEP 2: Fill Details */}
            {step === 2 && (
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
                    onClick={handleBack}
                    className="w-[30%] bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-2xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button 
                    onClick={handleToConfirm}
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600"
                  >
                    Lanjut →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
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
                    onClick={handleBackToForm}
                    disabled={isLoading}
                    className="w-[25%] bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-2xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_var(--shadow-color)] flex items-center justify-center"
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleSubmit}
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
            )}

          </AnimatePresence>

          {/* Footer */}
          <div className="mt-auto text-center pt-8">
            <span className="text-[var(--text-muted)] font-semibold text-sm">
              Sudah punya akun?{' '}
            </span>
            <Link to="/login" className="font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2">
              Masuk
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
