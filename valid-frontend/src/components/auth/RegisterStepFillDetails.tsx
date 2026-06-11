// HALAMAN: komponen/auth/RegisterStepFillDetails
// FUNGSI: Menampilkan form data pendaftaran berdasarkan peran (pencari kerja atau pro)

import { motion, AnimatePresence } from "framer-motion";

export function RegisterStepFillDetails({
  slideVariants,
  role,
  nama,
  setNama,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  vocationField,
  setVocationField,

  currentJob,
  setCurrentJob,
  institution,
  setInstitution,
  experienceYears,
  setExperienceYears,
  certifications,
  setCertifications,
  linkedinUrl,
  setLinkedinUrl,
  portfolioUrl,
  setPortfolioUrl,
  reviewFee,
  setReviewFee,

  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  onBack,
  onNext,
}: any) {
  const bidangVokasi = [
    "Teknologi Informasi",
    "Teknik Mesin & Otomotif",
    "Bisnis & Manajemen",
    "Kreatif & Desain",
    "Kesehatan & Keperawatan",
    "Pariwisata & Perhotelan",
  ];

  return (
    <motion.div
      key="step2"
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
          Isi Data
          <br />
          <span className="text-blue-600">{role === "pro" ? "Profesional" : "Kamu"}</span>
        </h2>
        <p className="mt-4 text-[var(--text-muted)] font-semibold text-sm">
          {role === "pro"
            ? "Lengkapi kompetensi industri Anda untuk proses verifikasi."
            : "Lengkapi data diri dasar Anda untuk mulai simulasi."}
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-8 w-full max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Nama Lengkap */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--text-color)]">
            Nama Lengkap *
          </label>
          <input
            type="text"
            required
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Budi Santoso, M.T."
            className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--text-color)]">
            Alamat Email *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="budi@domain.com"
            className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
          />
        </div>

        {/* Bidang Vokasi */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--text-color)]">
            Bidang Keahlian / Vokasi *
          </label>
          <select
            value={vocationField}
            onChange={(e) => setVocationField(e.target.value)}
            className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-bold focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)] appearance-none cursor-pointer"
          >
            {bidangVokasi.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* DINAMIS INPUT: HANYA JIKA PERAN ADALAH PROFESIONAL/VERIFIER */}
        {role === "pro" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 border-t-2 border-dashed border-[var(--border-color)] pt-4 mt-2"
          >
            {/* Pekerjaan Saat Ini */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                Pekerjaan / Jabatan Saat Ini *
              </label>
              <input
                type="text"
                required
                value={currentJob}
                onChange={(e) => setCurrentJob(e.target.value)}
                placeholder="Contoh: Senior Software Architect / Assessor BNSP"
                className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
              />
            </div>

            {/* Institusi / Perusahaan */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                Instansi / Perusahaan Tempat Bekerja *
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Contoh: PT Technology Indonesia / LSP Informatika"
                className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Pengalaman Kerja */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Pengalaman (Tahun) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  placeholder="5"
                  className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
                />
              </div>

              {/* Tarif Review */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Tarif Review (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  required
                  value={reviewFee}
                  onChange={(e) => setReviewFee(e.target.value)}
                  placeholder="50000"
                  className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
                />
              </div>
            </div>

            {/* Sertifikasi (Pisahkan Koma) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                Sertifikasi Keahlian (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                placeholder="Contoh: CCNA, Certified Assessor BNSP, Scrum Master"
                className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
              />
            </div>

            {/* LinkedIn URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                URL Profil LinkedIn
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
              />
            </div>

            {/* Portfolio URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-blue-600">
                URL Portfolio Digital
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/username atau website pribadi"
                className="bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
              />
            </div>
          </motion.div>
        )}

        {/* Password */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--text-color)]">
            Kata Sandi *
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 pr-12 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-tight text-[var(--text-muted)] hover:text-[var(--text-color)]"
            >
              {showPassword ? "Sembunyi" : "Lihat"}
            </button>
          </div>
        </div>

        {/* Konfirmasi Password */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-xs font-black uppercase tracking-wider text-[var(--text-color)]">
            Konfirmasi Kata Sandi *
          </label>
          <div className="relative w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-2xl px-4 py-3 pr-12 outline-none text-[var(--text-color)] font-medium focus:border-blue-500 shadow-[3px_3px_0px_var(--shadow-color)]"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-tight text-[var(--text-muted)] hover:text-[var(--text-color)]"
            >
              {showConfirmPassword ? "Sembunyi" : "Lihat"}
            </button>
          </div>
        </div>

        {/* Notifikasi Warning untuk Akun Profesional */}
        <AnimatePresence>
          {role === "pro" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-2"
            >
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-2xl shadow-[3px_3px_0px_rgba(234,179,8,0.3)]">
                <svg
                  className="shrink-0 mt-0.5 text-yellow-600 h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span className="text-[12px] font-bold text-yellow-900 leading-tight">
                  Akun ahli industri memerlukan peninjauan dan persetujuan portofolio oleh Admin
                  sebelum dapat menguji berkas kandidat.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Button Navigation */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onBack}
          className="w-[30%] bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-2xl py-4 font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all duration-300"
        >
          ← Kembali
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
