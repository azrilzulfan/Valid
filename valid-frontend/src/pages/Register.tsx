// HALAMAN: src/pages/Register.tsx
import { motion, AnimatePresence, Variants } from "framer-motion";
import { AuthLeftPanel } from "../components/auth/AuthLeftPanel";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { firebaseAuth } from "../lib/firebase";
import { authApi, verifierApi } from "../lib/api";
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
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<"pencari_kerja" | "pro">("pencari_kerja");

  // Form State Utama (Umum)
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [vocationField, setVocationField] = useState("Teknologi Informasi");

  // Form State Khusus Profesional Verifikator
  const [currentJob, setCurrentJob] = useState("");
  const [institution, setInstitution] = useState("");
  const [experienceYears, setExperienceYears] = useState("1");
  const [certifications, setCertifications] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [reviewFee, setReviewFee] = useState("50000");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !email || !password || !confirmPassword) {
      alert("Harap isi semua field wajib utama!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }
    if (password.length < 6) {
      alert("Password minimal harus 6 karakter!");
      return;
    }

    if (role === "pro") {
      if (!currentJob || !institution || !experienceYears || !reviewFee) {
        alert("Harap isi semua kompetensi dan data profesional Anda!");
        return;
      }
    }
    setStep(3);
  };

  const handleBackToForm = () => setStep(2);

  const handleSubmit = async () => {
    setIsLoading(false);
    let createdFirebaseUser: any = null;

    try {
      setIsLoading(true);

      // STEP 1: Buat user kredensial di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      createdFirebaseUser = userCredential.user;

      // Ambil ID Token Firebase untuk otentikasi Request Backend
      const token = await createdFirebaseUser.getIdToken();
      saveToken(token);

      // Pemetaan string role dari UI ke skema database backend
      // Jika di UI memilih 'pro', kirim 'verifier'. Jika tidak, kirim 'candidate'.
      const finalRole = role === "pro" ? "verifier" : "candidate";

      // STEP 2: Daftarkan profile dasar ke backend dengan menyertakan properti role secara eksplisit
      const dbUser = await authApi.register({
        uid: createdFirebaseUser.uid,
        email: email,
        displayName: nama,
        vocationField: vocationField,
        role: finalRole, // Mengesampingkan default value 'candidate' di database backend
      } as any); // di-cast as any jika interface bawaan api.ts kamu belum diupdate field role-nya

      // STEP 3: Jika mendaftar sebagai pro / verifier, lengkapi aplikasi detail profilnya
      if (role === "pro") {
        const certsArray = certifications
          ? certifications
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [];

        await verifierApi.apply({
          fullName: nama,
          vocationFields: [vocationField],
          currentJob,
          institution,
          experienceYears: parseInt(experienceYears) || 0,
          certifications: certsArray,
          linkedinUrl,
          portfolioUrl,
          reviewFee: parseInt(reviewFee) || 0,
        });

        // Simpan sesi terenkripsi lokal dengan role 'verifier'
        saveRole("verifier");
        saveUser({
          ...dbUser.user,
          role: "verifier",
          verifierStatus: "pending",
        });

        alert(
          "Pendaftaran Berhasil! Akun verifikator profesional Anda sedang menunggu proses persetujuan oleh Admin.",
        );
        navigate({ to: "/dashboard" });
      } else {
        // Alur reguler untuk pencari kerja
        saveRole("candidate");
        saveUser(dbUser.user);
        alert("Pendaftaran Berhasil! Selamat datang di platform Valid.");
        navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      console.error("Error saat pendaftaran:", err);

      // Kompensasi Rollback jika backend bermasalah agar Firebase tetap bersih
      if (createdFirebaseUser) {
        try {
          await deleteUser(createdFirebaseUser);
        } catch (rollbackErr) {
          console.error("Gagal membersihkan user dari Firebase Auth:", rollbackErr);
        }
      }
      alert(err.message || "Pendaftaran gagal. Silakan periksa kembali data Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--bg-color)] flex flex-col md:flex-row antialiased select-none selection:bg-blue-500 selection:text-white">
      <AuthLeftPanel />

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:px-16 lg:px-24 bg-[var(--bg-b)] relative overflow-y-auto max-h-screen">
        <div className="w-full max-w-[460px] flex flex-col min-h-[580px]">
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
                vocationField={vocationField}
                setVocationField={setVocationField}
                currentJob={currentJob}
                setCurrentJob={setCurrentJob}
                institution={institution}
                setInstitution={setInstitution}
                experienceYears={experienceYears}
                setExperienceYears={setExperienceYears}
                certifications={certifications}
                setCertifications={setCertifications}
                linkedinUrl={linkedinUrl}
                setLinkedinUrl={setLinkedinUrl}
                portfolioUrl={portfolioUrl}
                setPortfolioUrl={setPortfolioUrl}
                reviewFee={reviewFee}
                setReviewFee={setReviewFee}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
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
                vocationField={vocationField}
                currentJob={currentJob}
                institution={institution}
                experienceYears={experienceYears}
                reviewFee={reviewFee}
                isLoading={isLoading}
                onBack={handleBackToForm}
                onSubmit={handleSubmit}
              />
            )}
          </AnimatePresence>

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
