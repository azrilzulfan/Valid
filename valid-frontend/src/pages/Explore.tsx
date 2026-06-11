// HALAMAN: src/pages/Explore.tsx
// FUNGSI: Komponen/Halaman Eksplorasi Portofolio Kandidat Secara Publik Terintegrasi Murni Real API
// API YANG DIBUTUHKAN: dashboardApi.getStats, portfolioApi.getPublicPortfolios

import { motion, Variants } from "framer-motion";
import { Search, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { UserSidebar } from "../components/valid/UserSidebar";
import { dashboardApi, portfolioApi } from "../lib/api";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const AVATAR_COLORS = [
  "bg-blue-400",
  "bg-pink-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-purple-400",
  "bg-orange-400",
];

export function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(false);

  // 1. Fetch Statistik Platform dari Backend
  useEffect(() => {
    dashboardApi
      .getStats()
      .then((res) => {
        setStats(res?.stats || res?.data || res);
      })
      .catch((err) => console.error("Gagal mengambil statistik platform:", err));
  }, []);

  // 2. Debounce Mekanisme untuk Pencarian Otomatis saat mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 3. Fetch Data Portofolio Publik (Murni Real API Response)
  const fetchPublicPortfolios = async (query: string) => {
    setIsLoadingPortfolios(true);
    try {
      const res = await portfolioApi.getPublicPortfolios(query);
      console.log("=== RESPONS REAL BACKEND PORTFOLIO ===", res);

      let extractedPortfolios: any[] = [];

      if (Array.isArray(res)) {
        extractedPortfolios = res;
      } else if (res?.portfolios && Array.isArray(res.portfolios)) {
        extractedPortfolios = res.portfolios;
      } else if (res?.data && Array.isArray(res.data)) {
        extractedPortfolios = res.data;
      } else if (res?.results && Array.isArray(res.results)) {
        extractedPortfolios = res.results;
      }

      setPortfolios(extractedPortfolios);
    } catch (err) {
      console.error("Gagal mengambil data portofolio publik:", err);
      setPortfolios([]);
    } finally {
      setIsLoadingPortfolios(false);
    }
  };

  useEffect(() => {
    fetchPublicPortfolios(debouncedQuery);
  }, [debouncedQuery]);

  // Handler tombol manual cari portofolio
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPublicPortfolios(searchQuery);
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1200px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          {/* HEADER */}
          <motion.div variants={sectionVariants} className="mb-[32px]">
            <div
              className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_var(--shadow-color)] font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-[12px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              EKSPLORASI
            </div>
            <div
              className="font-black text-[36px] md:text-[44px] text-[var(--text-color)] leading-[0.9] tracking-tighter mt-1 uppercase"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              JELAJAH PORTOFOLIO
            </div>
            <p
              className="font-bold text-[14px] text-[var(--text-muted)] mt-[12px] max-w-[500px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Temukan dan lihat karya dari ribuan pencari kerja lainnya yang telah diverifikasi oleh
              AI dan Profesional.
            </p>

            {stats && (
              <div className="flex gap-4 mt-6">
                <div className="bg-[var(--card-bg)] border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-xl px-4 py-2">
                  <div
                    className="font-black text-[20px] text-blue-600"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    {stats.totalCandidates || stats.candidatesCount || stats.totalUsers || 0}
                  </div>
                  <div
                    className="font-bold text-[10px] text-slate-500 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Kandidat Kerja
                  </div>
                </div>
                <div className="bg-[var(--card-bg)] border-[2px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-xl px-4 py-2">
                  <div
                    className="font-black text-[20px] text-green-600"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    {stats.approvedPortfolios || stats.totalPortfolios || 0}
                  </div>
                  <div
                    className="font-bold text-[10px] text-slate-500 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Portofolio
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* SEARCH & FILTERS */}
          <motion.div variants={sectionVariants} className="mb-[40px]">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-[16px]">
              <div className="flex-1 relative">
                <div className="absolute left-[20px] top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari skill atau judul proyek (contoh: AutoCAD, React, Copywriting)..."
                  className="w-full bg-[var(--card-bg)] border-[3px] border-slate-900 rounded-[1.5rem] pl-[54px] pr-[20px] py-[16px] font-bold text-[15px] text-[var(--text-color)] focus:outline-none focus:shadow-[6px_6px_0px_#0f172a] shadow-[4px_4px_0px_var(--shadow-color)] transition-all placeholder:text-slate-400"
                  style={{ fontFamily: "var(--font-body)" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-300 border-[3px] border-slate-900 text-slate-900 rounded-[1.5rem] px-[32px] py-[16px] font-black text-[13px] uppercase tracking-widest shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all whitespace-nowrap"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cari Portofolio
              </button>
            </form>
          </motion.div>

          {/* GRID GALLERY */}
          <motion.div variants={sectionVariants} className="relative min-h-[300px]">
            {isLoadingPortfolios ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 py-12">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <span className="font-bold text-sm text-[var(--text-muted)]">
                  Memuat karya terverifikasi...
                </span>
              </div>
            ) : portfolios.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-[3px] border-dashed border-[var(--border-color)] rounded-[2rem] p-12 text-center bg-[var(--card-bg)] shadow-[4px_4px_0px_var(--shadow-color)]">
                <p
                  className="font-black text-xl uppercase tracking-tight text-[var(--text-color)]"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  Tidak Ada Portofolio Ditemukan
                </p>
                <p className="font-medium text-sm text-[var(--text-muted)] mt-2">
                  Pastikan dokumen di database Firestore Anda memiliki status publik atau disetujui
                  agar lolos kriteria saringan API backend.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                {portfolios.map((portfolio, idx) => {
                  const ownerName =
                    portfolio.userDisplayName ||
                    portfolio.ownerName ||
                    portfolio.name ||
                    portfolio.fullName ||
                    "Kandidat Valid";

                  const initialLetter = ownerName.charAt(0).toUpperCase();
                  const avatarBgColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const tags = portfolio.skills || portfolio.tags || [];
                  const scoreAI = portfolio.aiScore || portfolio.score || 0;

                  return (
                    <div
                      key={portfolio.id || portfolio._id}
                      className="bg-[var(--card-bg)] border-[3px] border-slate-900 rounded-[2rem] p-[24px] md:p-[32px] shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 transition-all flex flex-col md:flex-row gap-[24px]"
                    >
                      {/* Avatar & Score */}
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={`w-[80px] h-[80px] rounded-full border-[3px] border-slate-900 ${avatarBgColor} flex items-center justify-center shadow-[4px_4px_0px_#0f172a] mb-[16px]`}
                        >
                          <span
                            className="font-black text-[36px] text-slate-900"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {initialLetter}
                          </span>
                        </div>
                        <div className="bg-white border-[2px] border-slate-900 rounded-xl px-3 py-1 flex flex-col items-center shadow-[2px_2px_0px_#0f172a]">
                          <span
                            className="font-black text-[20px] leading-none text-blue-600"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {scoreAI > 0 ? scoreAI : "-"}
                          </span>
                          <span
                            className="font-bold text-[8px] uppercase tracking-widest text-slate-500"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Skor AI
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col">
                        <div>
                          <h3
                            className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight leading-none"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {ownerName}
                          </h3>
                          <p
                            className="font-bold text-[13px] text-[var(--text-muted)] mt-[8px]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {portfolio.vocationField || portfolio.role || "Kandidat Umum"}
                          </p>
                        </div>

                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-[8px] mt-[16px]">
                          {tags.slice(0, 4).map((skill: string) => (
                            <span
                              key={skill}
                              className="bg-blue-100 border-[2px] border-blue-600 text-blue-700 rounded-full px-[10px] py-[4px] font-black text-[9px] uppercase tracking-widest shadow-[1px_1px_0px_#2563EB] flex items-center gap-1"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              <CheckCircle2 className="w-3 h-3" /> {skill.toUpperCase()}
                            </span>
                          ))}
                        </div>

                        {/* Project Details */}
                        <div className="mt-[20px] p-[16px] bg-blue-50/50 dark:bg-blue-900/10 border-[2px] border-dashed border-blue-300 rounded-[1rem] flex-1">
                          <span
                            className="font-black text-[9px] uppercase tracking-widest text-blue-600 block mb-[4px]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Proyek Unggulan
                          </span>
                          <span
                            className="font-bold text-[13px] text-[var(--text-color)] line-clamp-1"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {portfolio.title || "Judul Portofolio"}
                          </span>
                          {portfolio.description && (
                            <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-1 font-medium">
                              {portfolio.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() =>
                            window.open(
                              `/portfolio/${portfolio.id || portfolio._id || portfolio.uid}`,
                              "_blank",
                            )
                          }
                          className="mt-[16px] w-full bg-slate-900 text-white rounded-[1rem] px-[20px] py-[12px] font-black text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#64748B] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#64748B] transition-all"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Lihat Profil <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
