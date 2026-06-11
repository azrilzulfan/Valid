// HALAMAN: src/pages/Login.tsx
import { motion, Variants } from "framer-motion";
import { AuthLeftPanel } from "../components/auth/AuthLeftPanel";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { authApi } from "../lib/api";
import { saveToken, saveRole, saveUser } from "../lib/auth";

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Verifikasi kredensial ke Firebase Auth
      const result = await signInWithEmailAndPassword(firebaseAuth, email, password);

      // 2. Ambil token Firebase & simpan (agar getHeaders di api.ts bisa membacanya)
      const token = await result.user.getIdToken();
      saveToken(token);

      // 3. Hit Endpoint Backend (GET /api/auth/login)
      const response = await authApi.login();

      // 4. Simpan data lengkap ke LocalStorage
      if (response.user) {
        saveUser(response.user);
        saveRole(response.user.role || "user");

        // 5. Routing otomatis berdasarkan Role
        switch (response.user.role) {
          case "admin":
            navigate({ to: "/admin" as any });
            break;

          case "reviewer":
          case "verifier":
            navigate({ to: "/pro/dashboard" as any });
            break;

          case "candidate":
          default:
            navigate({ to: "/dashboard" as any });
            break;
        }
      }
    } catch (err: any) {
      console.error("Kesalahan Login:", err);
      alert(err.message || "Gagal masuk. Cek kembali email dan password Anda.");
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
              className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[2rem] p-6 sm:p-8 shadow-[8px_8px_0px_var(--shadow-color)]"
            >
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-[var(--text-color)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-[var(--bg-b)] border-[2.5px] border-[var(--border-color)] rounded-xl text-sm font-bold text-[var(--text-color)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                    placeholder="Masukkan email kamu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-[var(--text-color)] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-[var(--bg-b)] border-[2.5px] border-[var(--border-color)] rounded-xl text-sm font-bold text-[var(--text-color)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500 transition-all duration-300"
                      placeholder="Masukkan password kamu"
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
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Memproses..." : "Masuk →"}
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
                Daftar sekarang
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
