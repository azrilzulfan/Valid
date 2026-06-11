// HALAMAN: pages/Register
// FUNGSI: Menangani proses pendaftaran akun (pencari kerja / profesional)
// API YANG DIBUTUHKAN: authApi.register
// DUMMY DATA: -

import { motion, AnimatePresence, Variants } from "framer-motion";
import { AuthLeftPanel } from "../components/auth/AuthLeftPanel";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { authApi } from "../lib/api";
import { RegisterStepChooseRole } from "../components/auth/RegisterStepChooseRole";
import { RegisterStepFillDetails } from "../components/auth/RegisterStepFillDetails";
import { RegisterStepConfirmation } from "../components/auth/RegisterStepConfirmation";

const slideVariants: Variants = {
  enter: { x: 30, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { x: -30, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
};

export function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<"pencari_kerja" | "pro">("pencari_kerja");

  // Form state
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sertifikat, setSertifikat] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleToConfirm = () => setStep(3);
  const handleBackToForm = () => setStep(2);

  const handleSubmit = async () => {
    setIsLoading(true);
    let firebaseUser = null;
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      firebaseUser = result.user;

      const token = await result.user.getIdToken();
      localStorage.setItem("valid_firebase_token", token);

      const response = await authApi.register({
        uid: result.user.uid,
        email: email,
        displayName: nama,
        vocationField: role === "pro" ? "Profesional" : "Umum",
      });
      localStorage.setItem("valid_user", JSON.stringify(response.user));
      localStorage.setItem("valid_role", response.user.role);

      navigate({ to: "/dashboard" });
    } catch (err: any) {
      console.error(err);

      if (firebaseUser) {
        try {
          await deleteUser(firebaseUser);
          console.log("Rollback: Akun Firebase berhasil dihapus karena backend gagal.");
        } catch (rollbackErr) {
          console.error("Gagal melakukan rollback akun Firebase:", rollbackErr);
        }
      }

      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar. Silakan gunakan email lain atau masuk.");
      } else {
        setError("Pendaftaran gagal. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

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
              style={{
                width: progressWidth,
                transition: "width 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
          <div className="flex justify-between mt-4 px-2">
            {[
              { id: 1, label: "Pilih Peran" },
              { id: 2, label: "Isi Data" },
              { id: 3, label: "Konfirmasi" },
            ].map((s) => {
              const isActive = step === s.id;
              const isPast = step > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 w-20">
                  <div
                    className="w-3 h-3 rounded-full border-[2px] transition-colors duration-300 shadow-[1px_1px_0px_var(--shadow-color)]"
                    style={{
                      background: isActive || isPast ? "#2563eb" : "var(--card-bg)",
                      borderColor: "var(--border-color)",
                    }}
                  />
                  <div
                    className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black transition-colors duration-300 text-center ${isActive || isPast ? "text-blue-600 dark:text-blue-400" : "text-[var(--text-muted)]"}`}
                  >
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
              <RegisterStepChooseRole
                slideVariants={slideVariants}
                role={role}
                setRole={setRole}
                onNext={handleNext}
              />
            )}

            {/* STEP 2: Fill Details */}
            {step === 2 && (
              <RegisterStepFillDetails
                slideVariants={slideVariants}
                role={role}
                nama={nama}
                setNama={setNama}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                sertifikat={sertifikat}
                setSertifikat={setSertifikat}
                onBack={handleBack}
                onNext={handleToConfirm}
              />
            )}

            {/* STEP 3: Confirmation */}
            {step === 3 && (
              <div className="w-full">
                {error && (
                  <div className="mb-4 bg-red-100 dark:bg-red-900/30 border-[2px] border-red-500 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                    {error}
                  </div>
                )}
                <RegisterStepConfirmation 
                  slideVariants={slideVariants}
                  role={role}
                  nama={nama}
                  email={email}
                  sertifikat={sertifikat}
                  isLoading={isLoading}
                  onBack={handleBackToForm}
                  onSubmit={handleSubmit}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-auto text-center pt-8">
            <span className="text-[var(--text-muted)] font-semibold text-sm">
              Sudah punya akun?{" "}
            </span>
            <Link
              to="/login"
              className="font-black text-blue-600 hover:text-blue-700 underline underline-offset-4 decoration-2"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
