// HALAMAN: C:\laragon\www\valid-react\src\pages\ProExplore.tsx
// FUNGSI: Menampilkan portofolio yang sudah disetujui (approved) oleh verifikator yang sedang login
// API YANG DIBUTUHKAN: portfolioApi.getAssignedToMe(), dashboardApi.getReviewerDashboard()

import { motion, Variants } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Coins,
  LogOut,
  MessageSquare,
  Compass,
  Search,
  Star,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../components/valid/ThemeToggle";
import { portfolioApi, dashboardApi } from "../lib/api";
import { clearAuth } from "../lib/auth";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function ProExplore() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [verifierUid, setVerifierUid] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        setLoading(true);

        // 1. Ambil data dashboard & portfolio secara paralel
        const [portRes, dashRes] = await Promise.all([
          portfolioApi.getAssignedToMe(),
          dashboardApi.getReviewerDashboard(),
        ]);

        setStats(dashRes);

        const dataPortfolios = portRes.portfolios || portRes || [];
        setCandidates(dataPortfolios);

        // 2. FIX SINKRONISASI UID: Cari UID verifikator dari data ulasan yang ada di database atau fallback local storage
        if (dataPortfolios.length > 0) {
          // Cari berkas yang memiliki assignedVerifier riil
          const foundVerifier = dataPortfolios.find((p: any) => p.assignedVerifier);
          if (foundVerifier) {
            setVerifierUid(foundVerifier.assignedVerifier);
          }
        }

        // Jika dataPortfolios kosong atau tidak ada assignedVerifier, ambil fallback dari localStorage user session data
        if (!verifierUid) {
          try {
            const sessionStr = localStorage.getItem("auth_user") || localStorage.getItem("user");
            if (sessionStr) {
              const sessionObj = JSON.parse(sessionStr);
              setVerifierUid(sessionObj.uid || sessionObj.id || null);
            }
          } catch (e) {
            console.error("Gagal membaca fallback session UID:", e);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data eksplorasi kandidat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, [verifierUid]);

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  // 📊 JARING PENYARING DATA (FILTER & SEARCH LOGIC)
  const filteredCandidates = candidates.filter((c: any) => {
    // 1. Validasi Status Khusus: Hanya tampilkan portofolio yang sukses dinilai (approved)
    if (c.status !== "approved") return false;

    // 2. Filter Pencarian Kata Kunci Dinamis (Mendukung Judul Proyek & Bidang Keahlian)
    const titleLower = (c.title || "").toLowerCase();
    const fieldLower = (c.vocationField || "").toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesSearch = titleLower.includes(searchLower) || fieldLower.includes(searchLower);

    if (!matchesSearch) return false;

    // 3. Verifikasi Kepemilikan: Jika verifierUid ditemukan, pastikan portofolio ini memang milik Anda
    if (verifierUid) {
      const isMyReview =
        c.assignedVerifier === verifierUid || c.verifierReview?.reviewerId === verifierUid;
      return isMyReview;
    }

    // Jika UID belum ter-load sempurna, loloskan sementara agar halaman tidak kosong hampa
    return true;
  });

  return (
    <div className="flex w-full h-screen bg-[var(--bg-b)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--bg-a)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-slate-900 flex md:flex-col z-50 md:z-auto transition-all shrink-0">
        <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[3px] border-slate-900 bg-yellow-400 items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="font-black text-[20px] tracking-tighter text-slate-900 uppercase"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              VALID <span className="text-blue-600">PRO</span>
            </span>
          </div>
          <div className="w-[10px] h-[10px] bg-green-500 rounded-full border-[2px] border-slate-900"></div>
        </div>

        <div className="hidden md:flex items-center gap-3 py-[20px] px-[24px] border-b-[3px] border-slate-900 bg-[var(--bg-b)]">
          <div className="w-[44px] h-[44px] rounded-[14px] border-[2.5px] border-slate-900 bg-purple-200 flex items-center justify-center shadow-[3px_3px_0px_var(--shadow-color)]">
            <span
              className="font-black text-[20px] text-purple-700"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              {stats?.profile?.displayName?.charAt(0) || "P"}
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-black text-[15px] text-[var(--text-color)] leading-tight tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {loading ? "..." : stats?.profile?.displayName || "Reviewer"}
            </span>
            <span
              className="font-bold text-[9px] uppercase tracking-widest text-slate-400 mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Asesor / Verifikator
            </span>
          </div>
        </div>

        <div className="flex-1 flex md:flex-col flex-row w-full justify-around md:justify-start md:px-[16px] md:py-[24px] gap-0 md:gap-[10px] items-center md:items-stretch h-full overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Beranda Pro", path: "/pro/dashboard" },
            { icon: Compass, label: "Jelajah Proyek", active: true, path: "/pro/explore" },
            { icon: MessageSquare, label: "Antrean Portofolio", path: "/pro/requests" },
            { icon: Coins, label: "Keuangan", path: "/pro/earnings" },
            { icon: FolderOpen, label: "Riwayat Ulasan", path: "/pro/history" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate({ to: item.path })}
              className={`group flex md:flex-row flex-col items-center gap-1 md:gap-[14px] px-3 md:px-[18px] py-2 md:py-[12px] rounded-[1rem] cursor-pointer transition-all duration-300 relative ${
                item.active
                  ? "md:bg-blue-600 text-[var(--text-color)] md:text-white md:border-[2.5px] md:border-slate-900 md:shadow-[4px_4px_0px_#0f172a] md:-translate-y-0.5"
                  : "text-slate-400 hover:text-[var(--text-color)] md:border-[2.5px] md:border-transparent md:hover:border-slate-900 md:hover:shadow-[4px_4px_0px_var(--shadow-color)] md:hover:-translate-y-0.5 md:hover:bg-[var(--bg-b)]"
              }`}
            >
              <item.icon
                className={`w-[22px] h-[22px] md:w-[20px] md:h-[20px] transition-transform ${item.active ? "md:scale-110" : "group-hover:scale-110"}`}
                strokeWidth={item.active ? 2.5 : 2}
              />
              <span
                className={`text-[9px] md:text-[12px] uppercase tracking-wider ${item.active ? "font-black" : "font-bold"}`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden md:flex flex-col p-[24px] border-t-[3px] border-slate-900 bg-[var(--bg-b)]">
          <div
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 cursor-pointer group px-3 py-3 border-[2.5px] border-transparent hover:border-slate-900 rounded-xl transition-all hover:bg-[var(--bg-a)] hover:shadow-[4px_4px_0px_var(--shadow-color)]"
          >
            <LogOut className="w-[18px] h-[18px] text-slate-400 group-hover:text-red-500 transition-colors" />
            <span
              className="font-black text-[12px] uppercase tracking-widest text-slate-400 group-hover:text-red-500 transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Keluar
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto relative pb-[100px] md:pb-[40px]">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(var(--shadow-color) 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        />

        <motion.div
          className="p-[20px_16px] md:p-[40px_48px] max-w-[1200px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          <div className="absolute top-4 right-4 z-50 md:top-6 md:right-6">
            <ThemeToggle />
          </div>

          {/* HEADER & SEARCH */}
          <motion.div
            variants={sectionVariants}
            className="mb-[40px] flex flex-col lg:flex-row lg:items-end justify-between gap-[24px]"
          >
            <div>
              <div
                className="inline-flex px-3 py-1 bg-blue-100 dark:bg-blue-950/50 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-blue-700 dark:text-blue-400 mb-[16px] shadow-[2px_2px_0px_#0f172a]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                REKAP EVALUASI RIIL ANDA
              </div>
              <h1
                className="font-black text-[36px] md:text-[52px] text-[var(--text-color)] leading-[0.9] tracking-tighter uppercase mb-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                HASIL REVIEW.
              </h1>
              <p
                className="font-bold text-[14px] md:text-[16px] text-slate-400 max-w-[600px] leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Menampilkan daftar seluruh portofolio digital lulusan/kandidat mahasiswa yang status
                kompetensinya telah selesai Anda lakukan uji penilaian (*peer review*).
              </p>
            </div>

            <div className="relative w-full lg:w-[400px]">
              <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari keahlian atau judul proyek..."
                className="w-full bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1rem] py-[14px] pl-[48px] pr-[16px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:shadow-[4px_4px_0px_var(--shadow-color)] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </motion.div>

          {/* CANDIDATES GRID */}
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]"
          >
            {loading && (
              <div
                className="col-span-full text-center py-[40px] font-black text-[14px] text-slate-400 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Memuat Data Eksplorasi Talenta...
              </div>
            )}

            {!loading && filteredCandidates.length === 0 && (
              <div
                className="col-span-full text-center py-[40px] bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] font-black text-[14px] text-slate-400 uppercase tracking-widest shadow-[4px_4px_0px_var(--shadow-color)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Tidak ada portofolio hasil review Anda yang cocok.
              </div>
            )}

            {!loading &&
              filteredCandidates.map((candidate: any, idx) => {
                const nameText = candidate.title || "Proyek Talenta Digital";
                const roleText = candidate.vocationField || "Umum";
                const idReview = candidate.portfolioId || candidate.id;
                const finalScore = candidate.verifiedScore || 0;

                return (
                  <div
                    key={idReview || idx}
                    className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] p-[24px] shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all duration-300 flex flex-col group"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-[20px]">
                      <div className="w-[64px] h-[64px] rounded-[16px] border-[2.5px] border-slate-900 bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shadow-[3px_3px_0px_var(--shadow-color)] group-hover:scale-105 transition-transform">
                        <span
                          className="font-black text-[24px] text-blue-600 dark:text-blue-400"
                          style={{ fontFamily: "var(--font-impact)" }}
                        >
                          {nameText.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-950/50 border-[2px] border-green-600 rounded-full">
                        <Star className="w-3 h-3 text-green-600 fill-green-600" />
                        <span
                          className="font-black text-[10px] text-green-700 dark:text-green-400 tracking-widest"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {finalScore} SKOR PRO
                        </span>
                      </div>
                    </div>

                    {/* Card Body Info */}
                    <div className="mb-[20px]">
                      <h3
                        className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight leading-none mb-1.5 line-clamp-2"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {nameText}
                      </h3>
                      <p
                        className="font-bold text-[12px] text-slate-400 uppercase tracking-widest mb-3"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {roleText}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["Terverifikasi Industri", "Keahlian Teruji"].map(
                          (skill: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-[var(--bg-b)] border-[2px] border-slate-900 rounded-md font-bold text-[9px] uppercase tracking-widest text-slate-400"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {skill}
                            </span>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4 border-t-[2.5px] border-dashed border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() =>
                          navigate({
                            to: `/p/${candidate.uid || "unknown"}`,
                          })
                        }
                        className="flex-1 bg-[var(--bg-b)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-color)] rounded-xl py-[12px] px-2 font-black text-[10px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[2px_2px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all text-center"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Profil Publik
                      </button>
                      <button
                        onClick={() =>
                          navigate({
                            to: `/pro/review/${idReview}`,
                            search: { mode: "view", readOnly: true } as any,
                          })
                        }
                        className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-[12px] px-2 font-black text-[10px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[3px_3px_0px_var(--shadow-color)] hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Buka Evaluasi <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
