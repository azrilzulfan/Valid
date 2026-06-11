// HALAMAN: src/pages/Register.tsx
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
import { saveToken, saveRole, saveUser } from "../lib/auth";

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

  const navigate = useNavigate();

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);
  const handleToConfirm = () => setStep(3);
  const handleBackToForm = () => setStep(2);

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      alert("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);
    let firebaseUser = null;

    try {
      // 1. Buat Autentikasi di Firebase
      const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      firebaseUser = result.user;

      // 2. Ambil token dari firebase untuk menembus proteksi middleware backend
      const token = await result.user.getIdToken();
      saveToken(token);

      // 3. Tembak Endpoint Registrasi di backend (POST /api/auth/register)
      const response = await authApi.register({
        uid: result.user.uid,
        email: email,
        displayName: nama,
        vocationField: role === "pro" ? "Profesional" : "Umum",
      });

      // 4. Simpan ke local storage
      if (response.user) {
        saveUser(response.user);
        saveRole(response.user.role || "user");
      }

      alert("Registrasi berhasil!");
      navigate({ to: "/dashboard" as any });
    } catch (err: any) {
      console.error("Kesalahan Register:", err);

      // Mekanisme Rollback (Mencegah Orphan Account di Firebase)
      if (firebaseUser) {
        try {
          await deleteUser(firebaseUser);
          console.log(
            "Rollback: Akun Firebase telah dibersihkan karena backend gagal membuat profil.",
          );
        } catch (rollbackErr) {
          console.error("Gagal melakukan rollback akun Firebase:", rollbackErr);
        }
      }

      alert(err.message || "Pendaftaran gagal. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

  return (
    <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden bg-[var(--bg-a)]">
      <AuthLeftPanel />

      {/* RIGHT PANEL */}
      <div className="w-full md:w-[58%] flex flex-col h-full bg-[var(--bg-a)] overflow-y-auto relative">
        {/* Progress Bar */}
        <div className="w-full px-8 pt-8 md:px-16 md:pt-12 max-w-[500px] mx-auto shrink-0">
          <div className="relative w-full h-[6px] bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full overflow-hidden shadow-[2px_2px_0px_var(--shadow-color)]">
            <motion.div
              className="absolute top-0 left-0 h-full bg-blue-600 border-r-[2px] border-[var(--border-color)]"
              initial={{ width: 0 }}
              animate={{ width: progressWidth }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex-1 w-full max-w-[500px] mx-auto flex flex-col px-8 pb-12 pt-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <RegisterStepChooseRole
                slideVariants={slideVariants}
                role={role}
                setRole={setRole}
                onNext={handleNext}
              />
            )}

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

            {step === 3 && (
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
