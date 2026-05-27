import { motion, Variants } from "framer-motion";
import { AuthLeftPanel } from "../components/auth/AuthLeftPanel";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-[var(--bg-a)]">
      <AuthLeftPanel />

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[58%] flex items-center justify-center h-full p-6 md:p-12 bg-[var(--bg-a)] overflow-y-auto">
        <div className="w-full max-w-md my-auto pb-12 md:pb-0">
          <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2
                className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)]"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                Selamat Datang
                <br />
                <span className="text-blue-600">Kembali</span>
              </h2>
              <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
                Lanjutkan perjalanan verifikasi kamu.
              </p>
            </motion.div>

            {/* Form Container */}
            <motion.div
              variants={itemVariants}
              className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-6 sm:p-8 shadow-[8px_8px_0px_var(--shadow-color)] relative"
            >
              {/* Demo Role Selector */}
              <div className="mb-6">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">
                  Mode Demo — Pilih peran
                </div>
                <div className="flex flex-col gap-3">
                  {/* Pencari Kerja */}
                  <div
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="group flex items-center justify-between p-4 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl cursor-pointer transition-all duration-300 shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-blue-600 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <span className="font-bold text-[var(--text-color)] text-sm uppercase tracking-wide">
                        Pencari Kerja
                      </span>
                    </div>
                    <span className="font-black text-xl text-[var(--text-color)] transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>

                  {/* Profesional BNSP */}
                  <div
                    onClick={() => navigate({ to: "/pro/dashboard" as any })}
                    className="group flex items-center justify-between p-4 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl cursor-pointer transition-all duration-300 shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-yellow-100 border-2 border-yellow-500 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-400 group-hover:text-slate-900 group-hover:border-slate-900 transition-colors">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[var(--text-color)] text-sm uppercase tracking-wide">
                        Profesional BNSP
                      </span>
                    </div>
                    <span className="font-black text-xl text-[var(--text-color)] transform group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center my-6 gap-4">
                <div className="h-[2.5px] bg-[var(--border-color)] opacity-20 flex-1"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                  atau
                </span>
                <div className="h-[2.5px] bg-[var(--border-color)] opacity-20 flex-1"></div>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/dashboard" });
                }}
              >
                <div className="mb-5">
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">
                    Email
                  </label>
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
                  <label className="block text-[11px] uppercase tracking-wider font-black text-[var(--text-muted)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
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
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600"
                >
                  Masuk →
                </button>
              </form>
            </motion.div>

            {/* Footer */}
            <motion.div variants={itemVariants} className="text-center mt-6">
              <span className="text-[var(--text-muted)] font-semibold text-sm">
                Belum punya akun?{" "}
              </span>
              <Link
                to="/register"
                className="font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2"
              >
                Daftar Gratis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
