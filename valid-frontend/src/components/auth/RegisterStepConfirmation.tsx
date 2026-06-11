// HALAMAN: komponen/auth/RegisterStepConfirmation
// FUNGSI: Menampilkan langkah ke-3 dari registrasi (konfirmasi data sebelum disubmit)

import { motion } from "framer-motion";

export function RegisterStepConfirmation({
  slideVariants,
  role,
  nama,
  email,
  vocationField,
  currentJob,
  institution,
  experienceYears,
  reviewFee,
  isLoading,
  onBack,
  onSubmit,
}: any) {
  return (
    <motion.div
      key="step3"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full pb-8"
    >
      <div>
        <h2
          className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--text-color)]"
          style={{ fontFamily: "var(--font-impact)" }}
        >
          Hampir
          <br />
          <span className="text-blue-600">{isLoading ? "Memproses..." : "Selesai!"}</span>
        </h2>
        <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
          Periksa kembali kebenaran data Anda sebelum mendaftar.
        </p>
      </div>

      <div className="bg-[var(--card-bg)] border-[3.5px] border-[var(--border-color)] rounded-[1.5rem] p-6 mt-8 shadow-[6px_6px_0px_var(--shadow-color)] flex flex-col gap-4">
        <div className="flex flex-col border-b-2 border-slate-100 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Peran Akun
          </span>
          <span className="text-sm font-black uppercase text-blue-600 tracking-wide mt-0.5">
            {role === "pro" ? "💼 Profesional BNSP / Verifikator" : "🎯 Pencari Kerja / Praktisi"}
          </span>
        </div>

        <div className="flex flex-col border-b-2 border-slate-100 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Nama Lengkap
          </span>
          <span className="text-base font-extrabold text-[var(--text-color)] mt-0.5">{nama}</span>
        </div>

        <div className="flex flex-col border-b-2 border-slate-100 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Email
          </span>
          <span className="text-sm font-bold text-[var(--text-color)] mt-0.5">{email}</span>
        </div>

        <div className="flex flex-col border-b-2 border-slate-100 pb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
            Kluster Vokasi Utama
          </span>
          <span className="text-sm font-bold text-[var(--text-color)] mt-0.5">{vocationField}</span>
        </div>

        {/* TAMPILKAN SUB-DETAIL JIKA ROLE ADALAH VERIFIKATOR PRO */}
        {role === "pro" && (
          <>
            <div className="flex flex-col border-b-2 border-slate-100 pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                Jabatan & Instansi
              </span>
              <span className="text-sm font-bold text-[var(--text-color)] mt-0.5">
                {currentJob} di{" "}
                <span className="underline decoration-blue-500 decoration-2">{institution}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                  Masa Kerja
                </span>
                <span className="text-sm font-extrabold text-[var(--text-color)] mt-0.5">
                  {experienceYears} Tahun
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                  Biaya Sertifikasi
                </span>
                <span className="text-sm font-extrabold text-green-600 mt-0.5">
                  Rp {Number(reviewFee).toLocaleString("id-ID")} / review
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Aksi Trigger */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="w-[30%] bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-2xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] flex items-center justify-center disabled:opacity-50"
        >
          ←
        </button>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl py-4 font-black uppercase text-sm tracking-wider text-white transition-all duration-300 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#0f172a] bg-blue-600 disabled:bg-blue-400 disabled:hover:translate-y-0"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mendaftarkan...
            </>
          ) : (
            "Konfirmasi & Buat Akun"
          )}
        </button>
      </div>
    </motion.div>
  );
}
