// src/pages/PublicProfile.tsx
// FUNGSI: Halaman Profil Publik — Data dari API berdasarkan username slug di URL

import { motion, Variants } from "framer-motion";
import { CheckCircle2, Zap, ArrowRight, ArrowLeft, ExternalLink, Loader2, AlertCircle, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { usersApi, portfolioApi } from "../lib/api";

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function ScoreRing({ score }: { score: number }) {
  const [offset, setOffset] = useState(251.2);

  useEffect(() => {
    setTimeout(() => {
      setOffset(251.2 - (251.2 * score) / 100);
    }, 100);
  }, [score]);

  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      <svg
        className="w-full h-full transform -rotate-90 drop-shadow-[4px_4px_0px_#0f172a]"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" fill="white" stroke="#0f172a" strokeWidth="3" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="var(--border-color)"
          strokeWidth="8"
          className="opacity-20"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          stroke="#2563EB"
          strokeWidth="8"
          strokeDasharray="251.2"
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-black text-[36px] leading-none text-slate-900"
          style={{ fontFamily: "var(--font-impact)" }}
        >
          {score}
        </span>
        <span
          className="font-bold text-[12px] text-slate-500 uppercase"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Rata-rata
        </span>
      </div>
    </div>
  );
}

export function PublicProfile() {
  const { username } = useParams({ from: "/p/$username" });

  const [profile, setProfile] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Ambil profil berdasarkan username slug
        const profileRes = await usersApi.getPublicUserProfile(username);
        const fetchedProfile = profileRes.profile;
        setProfile(fetchedProfile);

        // 2. Ambil portofolio approved milik user tersebut berdasarkan UID
        if (fetchedProfile?.uid) {
          const portRes = await portfolioApi.getPortfoliosByUid(fetchedProfile.uid).catch(() => null);
          if (portRes) setPortfolios(portRes.portfolios || []);
        }
      } catch (err: any) {
        setError(err.message || "Pengguna tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchAll();
  }, [username]);

  // Hitung rata-rata skor dari semua portofolio yang punya verifiedScore
  const scoredPortfolios = portfolios.filter((p) => p.verifiedScore != null);
  const avgScore = scoredPortfolios.length > 0
    ? Math.round(scoredPortfolios.reduce((sum, p) => sum + p.verifiedScore, 0) / scoredPortfolios.length)
    : null;

  // Kumpulkan semua tags/skills unik dari portofolio
  const allSkills = Array.from(
    new Set(portfolios.flatMap((p) => p.tags || p.skills || []))
  ).slice(0, 10);

  // Info untuk display
  const displayName = profile?.displayName || username.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[var(--bg-a)] text-[var(--text-color)] font-sans flex flex-col">
      {/* PUBLIC NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-[70px] bg-white border-b-[3px] border-slate-900 shadow-[0_4px_0px_#0f172a] z-50 flex items-center justify-between px-[20px] md:px-[40px]">
        <div className="flex items-center gap-[12px]">
          <img
            src="/logo.png"
            alt="VALID Logo"
            className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform"
          />
          <span
            className="hidden sm:block font-bold text-[13px] text-slate-500 uppercase tracking-widest mt-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Platform Portofolio Terverifikasi
          </span>
        </div>

        <button
          onClick={() => {
            const hasUser = !!localStorage.getItem("valid_user");
            if (hasUser) {
              window.location.href = "/dashboard/portfolio";
            } else {
              window.location.href = "/#jelajah";
            }
          }}
          className="bg-blue-600 border-[2.5px] border-slate-900 text-white rounded-[1rem] px-[16px] py-[10px] font-black text-[11px] sm:text-[13px] uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-1 transition-all"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft className="w-4 h-4" /> <span>Kembali</span>
        </button>
      </nav>

      {/* FLOATING BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[100px] left-[-100px] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[100px] right-[-100px] w-[400px] h-[400px] bg-yellow-400/20 rounded-full blur-[80px]" />
      </div>

      <div className="flex-1 w-full pt-[100px] pb-[80px] overflow-y-auto">
        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            <p className="font-bold text-[14px] text-slate-500 uppercase tracking-widest" style={{ fontFamily: "var(--font-body)" }}>
              Memuat profil...
            </p>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
            <div className="bg-white border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] p-[48px] flex flex-col items-center text-center max-w-[400px]">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="font-black text-[28px] text-slate-900 uppercase tracking-tight mb-2" style={{ fontFamily: "var(--font-impact)" }}>
                Tidak Ditemukan
              </h2>
              <p className="font-bold text-[14px] text-slate-500 mb-6" style={{ fontFamily: "var(--font-body)" }}>
                Pengguna dengan username <strong>"{username}"</strong> tidak ada di platform VALID.
              </p>
              <button
                onClick={() => window.location.href = "/"}
                className="bg-blue-600 text-white border-[2.5px] border-slate-900 rounded-[12px] px-[24px] py-[12px] font-black text-[13px] uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] hover:-translate-y-1 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}

        {/* MAIN CONTENT — hanya tampil jika profil berhasil dimuat */}
        {!loading && !error && profile && (
          <motion.div
            className="max-w-[800px] mx-auto px-[20px] relative z-10 flex flex-col gap-[32px]"
            variants={pageVariants as any}
            initial="hidden"
            animate="visible"
          >
            {/* HERO PROFILE CARD */}
            <motion.div
              variants={sectionVariants as any}
              className="bg-white border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] p-[32px] md:p-[48px] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[90px] bg-gradient-to-r from-blue-600 to-indigo-600 border-b-[3px] border-slate-900" />

              <div className="relative flex flex-col md:flex-row gap-[32px] items-center md:items-start pt-[50px]">
                {/* Avatar Inisial */}
                <div className="w-[140px] h-[140px] rounded-full border-[4px] border-slate-900 bg-yellow-400 flex items-center justify-center shadow-[6px_6px_0px_#0f172a] shrink-0 z-10">
                  <span
                    className="font-black text-[64px] text-slate-900"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    {initial}
                  </span>
                </div>

                <div className="flex-1 text-center md:text-left z-10 mt-[20px] md:mt-[45px]">
                  <h1
                    className="font-black text-[40px] md:text-[48px] text-slate-900 uppercase leading-none tracking-tighter"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    {displayName}
                  </h1>
                  <h2
                    className="font-bold text-[16px] md:text-[18px] text-slate-600 mt-[8px]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {profile.vocationField || "Kandidat VALID"}
                    {profile.location ? ` — ${profile.location}` : ""}
                  </h2>

                  {/* Badge & Poin */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-[16px]">
                    {profile.badgeLevel && (
                      <span
                        className={`px-[14px] py-[5px] rounded-full border-[2px] font-black text-[10px] uppercase tracking-widest ${
                          profile.badgeLevel === "gold"
                            ? "bg-yellow-300 border-yellow-500 text-yellow-900"
                            : profile.badgeLevel === "silver"
                            ? "bg-slate-200 border-slate-400 text-slate-800"
                            : "bg-orange-200 border-orange-400 text-orange-800"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        🏅 Badge {profile.badgeLevel.toUpperCase()}
                      </span>
                    )}
                    <span
                      className="bg-blue-50 border-[2px] border-blue-300 text-blue-700 rounded-full px-[14px] py-[5px] font-black text-[10px] uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      ⭐ {profile.reputationPoints || 0} Poin Reputasi
                    </span>
                    <span
                      className="bg-green-50 border-[2px] border-green-300 text-green-700 rounded-full px-[14px] py-[5px] font-black text-[10px] uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      ✅ {portfolios.length} Proyek Terverifikasi
                    </span>
                    {profile.behavioralScore != null && (
                      <span
                        className="bg-purple-50 border-[2px] border-purple-300 text-purple-700 rounded-full px-[14px] py-[5px] font-black text-[10px] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        🤖 Skor AI: {profile.behavioralScore}
                      </span>
                    )}
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p
                      className="font-bold text-[14px] text-slate-700 leading-relaxed mt-[20px] bg-blue-50 border-[2px] border-blue-200 p-[16px] rounded-[16px]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {profile.bio}
                    </p>
                  )}

                  {!profile.bio && (
                    <p
                      className="font-bold text-[14px] text-slate-400 leading-relaxed mt-[20px] italic"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Pengguna ini belum menambahkan bio.
                    </p>
                  )}

                  {/* Button Hubungi Saya */}
                  {profile.email && (
                    <div className="mt-[20px] flex justify-center md:justify-start">
                      <a
                        href={`mailto:${profile.email}`}
                        className="bg-slate-900 border-[2.5px] border-slate-900 text-white rounded-[1rem] px-[24px] py-[12px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all cursor-pointer"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Hubungi Saya
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* SKILLS & SKOR SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[32px]">
              {/* Skills dari tags portofolio */}
              <motion.div
                variants={sectionVariants as any}
                className="md:col-span-2 bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-[24px] p-[32px] md:p-[40px]"
              >
                <div
                  className="inline-flex px-3 py-1 bg-green-100 border-[2px] border-green-500 rounded-full shadow-[2px_2px_0px_#22c55e] font-black text-[10px] uppercase tracking-widest text-green-700 mb-[16px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  TERDETEKSI DARI PORTOFOLIO
                </div>
                <h3
                  className="font-black text-[24px] md:text-[28px] text-slate-900 uppercase tracking-tight mb-[24px]"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  KOMPETENSI & SKILL
                </h3>

                {allSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-[12px]">
                    {allSkills.map((skill: string, i: number) => (
                      <div
                        key={i}
                        className="bg-slate-50 border-[2.5px] border-slate-900 rounded-[12px] px-[16px] py-[10px] flex items-center gap-[10px] shadow-[3px_3px_0px_#0f172a]"
                      >
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        <span
                          className="font-bold text-[14px] text-slate-800"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-bold text-[13px] text-slate-400 italic" style={{ fontFamily: "var(--font-body)" }}>
                    Belum ada skill yang terdeteksi dari portofolio.
                  </p>
                )}
              </motion.div>

              {/* Skor Terverifikasi */}
              <motion.div
                variants={sectionVariants as any}
                className="bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-[24px] p-[32px] flex flex-col items-center justify-center text-center"
              >
                {avgScore !== null ? (
                  <>
                    <ScoreRing score={avgScore} />
                    <div className="mt-[24px]">
                      <div
                        className="font-black text-[18px] text-slate-900 uppercase tracking-tighter"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        Skor Terverifikasi
                      </div>
                      <div
                        className="font-bold text-[12px] text-slate-500 mt-[4px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Dari {scoredPortfolios.length} proyek dinilai
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-[80px] h-[80px] rounded-full border-[3px] border-dashed border-slate-300 flex items-center justify-center">
                      <span className="font-black text-[28px] text-slate-300" style={{ fontFamily: "var(--font-impact)" }}>?</span>
                    </div>
                    <div
                      className="font-bold text-[12px] text-slate-400 uppercase tracking-widest text-center"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Belum ada proyek yang terverifikasi
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Skor Wawancara AI */}
              <motion.div
                variants={sectionVariants as any}
                className="bg-white border-[3px] border-slate-900 shadow-[6px_6px_0px_#0f172a] rounded-[24px] p-[32px] flex flex-col items-center justify-center text-center"
              >
                {profile.behavioralScore !== null && profile.behavioralScore !== undefined ? (
                  <>
                    <ScoreRing score={profile.behavioralScore} />
                    <div className="mt-[24px]">
                      <div
                        className="font-black text-[18px] text-slate-900 uppercase tracking-tighter"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        Skor Wawancara AI
                      </div>
                      <div
                        className="font-bold text-[12px] text-slate-500 mt-[4px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Analisis Performa AI
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-[80px] h-[80px] rounded-full border-[3px] border-dashed border-slate-300 flex items-center justify-center">
                      <span className="font-black text-[28px] text-slate-300" style={{ fontFamily: "var(--font-impact)" }}>?</span>
                    </div>
                    <div
                      className="font-bold text-[12px] text-slate-400 uppercase tracking-widest text-center"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Belum ada wawancara AI
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* PROYEK TIMELINE */}
            <motion.div
              variants={sectionVariants as any}
              className="bg-white border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[24px] p-[32px] md:p-[48px]"
            >
              <div className="flex items-center gap-[12px] mb-[32px]">
                <div className="w-[48px] h-[48px] bg-yellow-400 border-[3px] border-slate-900 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
                  <Zap className="w-6 h-6 text-slate-900" />
                </div>
                <h3
                  className="font-black text-[28px] md:text-[32px] text-slate-900 uppercase tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  BUKTI KARYA
                </h3>
              </div>

              {portfolios.length === 0 ? (
                <div className="text-center py-12 border-[2.5px] border-dashed border-slate-200 rounded-[16px]">
                  <p className="font-bold text-[14px] text-slate-400 italic" style={{ fontFamily: "var(--font-body)" }}>
                    Pengguna ini belum memiliki proyek.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                  {portfolios.map((project: any, i: number) => {
                    const submissionDate = project.submittedAt
                      ? new Date(project.submittedAt)
                      : new Date();
                    const verifiedScore = project.verifiedScore;
                    const headerFile = project.fileUrls?.find(
                      (f: any) => f.fileType?.startsWith("image/") || f.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i)
                    );
                    const headerUrl = headerFile?.fileUrl;

                    // Siapa pemberi review
                    let reviewerText = "";
                    if (project.status === "approved") {
                      if (project.verifierReview?.reviewerName) {
                        reviewerText = `Verifikator: ${project.verifierReview.reviewerName}`;
                      } else if (project.peerReviews && project.peerReviews.length > 0) {
                        const names = project.peerReviews.map((r: any) => r.reviewerName).join(", ");
                        reviewerText = `Rekan: ${names}`;
                      } else {
                        reviewerText = "Sistem VALID";
                      }
                    }

                    return (
                      <motion.div
                        key={project.portfolioId || i}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        onClick={() => {
                          const url = project.repositoryUrl || project.fileUrls?.[0]?.fileUrl;
                          if (url) window.open(url, "_blank", "noopener,noreferrer");
                        }}
                        className="bg-white border-[2.5px] border-slate-900 rounded-[1.5rem] overflow-hidden shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] flex flex-col relative cursor-pointer"
                      >
                        {/* Header — gambar jika ada, inisial biru jika tidak */}
                        <div
                          className="h-[140px] border-b-[2.5px] border-slate-900 overflow-hidden relative flex items-center justify-center"
                          style={headerUrl ? {} : { background: "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 50%, #bfdbfe 100%)" }}
                        >
                          {headerUrl ? (
                            <img src={headerUrl} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <span
                              className="font-black text-[52px] tracking-tighter select-none"
                              style={{
                                fontFamily: "var(--font-impact)",
                                color: "rgba(59,130,246,0.35)",
                                letterSpacing: "-0.04em",
                              }}
                            >
                              {project.title
                                ? project.title
                                    .split(" ")
                                    .slice(0, 3)
                                    .map((w: string) => w[0])
                                    .join("")
                                    .toUpperCase()
                                : "?"}
                            </span>
                          )}

                          {/* Verified Score overlay */}
                          {verifiedScore != null && (
                            <div className="absolute top-[14px] left-[14px] bg-white border-[2px] border-slate-900 rounded-lg px-[10px] py-[4px] shadow-[2px_2px_0px_#0f172a]">
                              <span className="font-black text-[14px] text-blue-600" style={{ fontFamily: "var(--font-impact)" }}>
                                {verifiedScore}
                              </span>
                              <span className="font-bold text-[9px] text-slate-500 ml-1">/100</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-[20px] flex flex-col flex-1 justify-between">
                          <div>
                            <h4
                              className="font-black text-[16px] text-slate-900 uppercase tracking-wide line-clamp-1"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {project.title}
                            </h4>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-[6px] mt-[10px]">
                              <span
                                className="bg-transparent border-[2px] border-slate-200 text-slate-500 rounded-full px-[10px] py-[3px] font-black text-[9px] uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                {project.vocationField || "Teknis"}
                              </span>
                              {(project.tags || project.skills || []).map((tag: string, tagIdx: number) => (
                                <span
                                  key={tagIdx}
                                  className="bg-transparent border-[2px] border-slate-200 text-slate-500 rounded-full px-[10px] py-[3px] font-black text-[9px] uppercase tracking-widest"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            {/* Description */}
                            <p
                              className="font-bold text-[12px] text-slate-600 mt-[12px] line-clamp-2 leading-relaxed"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {project.description || "Tidak ada deskripsi proyek."}
                            </p>
                          </div>

                          <div>
                            {/* Date */}
                            <div
                              className="font-bold text-[11px] text-slate-400 mt-[12px]"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {submissionDate.toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
                            </div>

                            {/* Footer / Status Verification */}
                            <div className="mt-[16px] pt-[14px] border-t-[2px] border-dashed border-slate-200 flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-black text-[10px] uppercase tracking-widest border-[2px] px-[12px] py-[5px] rounded-full shrink-0 ${
                                    project.status === "approved"
                                      ? "bg-green-100 border-green-500 text-green-700"
                                      : project.status === "under_review"
                                        ? "bg-blue-100 border-blue-500 text-blue-700"
                                        : "bg-yellow-100 border-yellow-500 text-yellow-700"
                                  }`}
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {project.status === "approved"
                                    ? "Terverifikasi"
                                    : project.status === "under_review"
                                      ? "Sedang Direview"
                                      : "Belum Direview"}
                                </span>
                              </div>
                              {reviewerText && (
                                <span
                                  className="font-bold text-[10px] text-slate-500 italic block mt-1"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  Diverifikasi oleh: <span className="font-extrabold text-blue-600 not-italic">{reviewerText}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* FOOTER VALID BADGE */}
            <motion.div
              variants={sectionVariants as any}
              className="flex justify-center mt-[40px] pb-[40px]"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex items-center gap-[12px] bg-slate-900 text-white px-[20px] py-[12px] rounded-full border-[3px] border-slate-900 shadow-[4px_4px_0px_#64748B]">
                  <span
                    className="font-bold text-[11px] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Divalidasi menggunakan AI & Reviewer Manusia
                  </span>
                  <div className="w-[6px] h-[6px] rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span
                    className="font-black text-[12px] text-slate-400 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Powered by
                  </span>
                  <img
                    src="/logo.png"
                    alt="VALID Logo"
                    className="h-[24px] object-contain opacity-50 grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
