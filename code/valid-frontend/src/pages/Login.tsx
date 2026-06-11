// HALAMAN: C:\laragon\www\valid-react\src\pages\Login.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from 'framer-motion';
import { AuthLeftPanel } from '../components/auth/AuthLeftPanel';
import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '../lib/firebase';
import { authApi } from '../lib/api';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const token = await result.user.getIdToken();
      
      // Temporary token for authApi.login to use
      localStorage.setItem('valid_firebase_token', token);
      
      try {
        const response = await authApi.login();
        localStorage.setItem('valid_user', JSON.stringify(response.user));
        localStorage.setItem('valid_role', response.user.role);
        
        if (response.user.role === 'reviewer' || response.user.role === 'verifier') {
          navigate({ to: '/pro/dashboard' as any });
        } else {
          navigate({ to: '/dashboard' });
        }
      } catch (loginErr) {
        // If the backend doesn't recognize the user, clear the token and throw
        localStorage.removeItem('valid_firebase_token');
        throw loginErr;
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('User tidak ditemukan')) {
         setError("Akun belum lengkap di database. Silakan daftar ulang dengan email ini.");
      } else {
         setError("Email atau password salah.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-[var(--bg-a)]">
      <AuthLeftPanel />
      
      {/* RIGHT PANEL */}
      <div className="w-full md:w-[58%] flex items-center justify-center h-full p-6 md:p-12 bg-[var(--bg-a)] overflow-y-auto">
        <div className="w-full max-w-md my-auto pb-12 md:pb-0">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)]" style={{ fontFamily: "var(--font-impact)" }}>
                Selamat Datang<br/>
                <span className="text-blue-600">Kembali</span>
              </h2>
              <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
                Lanjutkan perjalanan verifikasi kamu.
              </p>
            </motion.div>

            {/* Form Container */}
            <motion.div variants={itemVariants} className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-6 sm:p-8 shadow-[8px_8px_0px_var(--shadow-color)] relative">
              

              {/* Form */}
              <form onSubmit={handleLogin}>
                {error && (
                  <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-[2px] border-red-500 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                    {error}
                  </div>
                )}
                <div className="mb-5">
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Email</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 pr-12 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Memuat...' : 'Masuk →'}
                </button>
              </form>

            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              <span className="text-[var(--text-muted)] font-semibold text-sm">
                Belum punya akun?{' '}
              </span>
              <Link to="/register" className="font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2">
                Daftar Gratis
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
