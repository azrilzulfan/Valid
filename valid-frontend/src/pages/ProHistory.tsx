// HALAMAN: C:\laragon\www\valid-react\src\pages\ProHistory.tsx
// FUNGSI: Menampilkan daftar riwayat portofolio yang sukses dinilai secara permanen oleh verifikator
// API YANG DIBUTUHKAN: dashboardApi.getReviewerDashboard()

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
  CheckCircle2,
  Briefcase,
  Eye,
  Calendar,
  Activity,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../components/valid/ThemeToggle";
import { dashboardApi } from "../lib/api";
import { clearAuth } from "../lib/auth";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function ProHistory() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashRes = await dashboardApi.getReviewerDashboard();
        const statsData = dashRes?.stats || dashRes;
        setStats(statsData);

        const history = (statsData?.recentReviews || []).map((p: any) => ({
          id: p.portfolioId || p.id,
          name: p.title || p.candidateName || "No Title",
          role: p.vocationField || p.category || "General",
          dateCompleted: p.reviewedAt ? new Date(p.reviewedAt).toLocaleDateString("id-ID") : "-",
          aiScore: p.aiScore || p.initialScore || 0,
          proScore: p.myScore || p.score || 0,
          comment:
            p.comment ||
            p.feedback ||
            "Penilaian telah berhasil disubmit ke kandidat dan tersimpan di basis data industri.",
        }));

        setReviews(history);
      } catch (err) {
        console.error("Gagal mengambil data riwayat ulasan:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg-b)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--bg-a)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-slate-900 flex md:flex-col z-50 md:z-auto transition-all shrink-0">
        {/* TOP: Logo */}
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

        {/* USER INFO */}
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

        {/* NAV LINKS */}
        <div className="flex-1 flex md:flex-col flex-row w-full justify-around md:justify-start md:px-[16px] md:py-[24px] gap-0 md:gap-[10px] items-center md:items-stretch h-full overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Beranda Pro", path: "/pro/dashboard" },
            { icon: Compass, label: "Jelajah Proyek", path: "/pro/explore" },
            { icon: MessageSquare, label: "Antrean Portofolio", path: "/pro/requests" },
            { icon: Coins, label: "Keuangan", path: "/pro/earnings" },
            { icon: FolderOpen, label: "Riwayat Ulasan", active: true, path: "/pro/history" },
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

        {/* BOTTOM: Logout */}
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
        {/* Decorative Grid Background */}
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

          {/* HEADER */}
          <motion.div
            variants={sectionVariants}
            className="mb-[40px] flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[24px]"
          >
            <div>
              <div
                className="inline-flex px-3 py-1 bg-purple-100 dark:bg-purple-950/50 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-purple-700 dark:text-purple-400 mb-[16px] shadow-[2px_2px_0px_#0f172a]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ARSIP KELULUSAN & ULASAN
              </div>
              <h1
                className="font-black text-[36px] md:text-[52px] text-[var(--text-color)] leading-[0.9] tracking-tighter uppercase mb-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                RIWAYAT REVIEW.
              </h1>
              <p
                className="font-bold text-[14px] md:text-[16px] text-slate-400 max-w-[600px] leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Daftar rekaman seluruh berkas dan portofolio kandidat mahasiswa yang telah sukses
                dinilai dan diberikan skor akhir industri secara permanen.
              </p>
            </div>

            <div className="relative w-full lg:w-[350px]">
              <div className="absolute inset-y-0 left-[16px] flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau nama proyek..."
                className="w-full bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1rem] py-[12px] pl-[48px] pr-[16px] font-bold text-[13px] text-[var(--text-color)] focus:outline-none focus:shadow-[4px_4px_0px_var(--shadow-color)] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </motion.div>

          {/* LIST */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 gap-[24px]">
            {loading && (
              <div
                className="p-[40px] text-center font-black text-[14px] text-slate-400 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Memuat Riwayat Penilaian...
              </div>
            )}

            {!loading &&
              reviews.filter((req) => req.name.toLowerCase().includes(search.toLowerCase()))
                .length === 0 && (
                <div className="p-[40px] text-center bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] shadow-[4px_4px_0px_var(--shadow-color)]">
                  <div className="w-[64px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-full border-[3px] border-slate-300 dark:border-slate-700 mx-auto flex items-center justify-center mb-4">
                    <FolderOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <div
                    className="font-black text-[14px] text-slate-400 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Tidak ada kecocokan riwayat ulasan.
                  </div>
                </div>
              )}

            {!loading &&
              reviews
                .filter((req) => req.name.toLowerCase().includes(search.toLowerCase()))
                .map((req) => (
                  <div
                    key={req.id}
                    className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] p-[24px] shadow-[6px_6px_0px_var(--shadow-color)] hover:shadow-[8px_8px_0px_var(--shadow-color)] hover:-translate-y-1 transition-all flex flex-col md:flex-row gap-6"
                  >
                    {/* Profile Section */}
                    <div className="flex flex-col gap-4 min-w-[240px] justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-[56px] h-[56px] rounded-[16px] border-[3px] border-slate-900 bg-yellow-100 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#0f172a]">
                          <span
                            className="font-black text-[24px] text-yellow-600"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {req.name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3
                            className="font-black text-[18px] text-[var(--text-color)] uppercase tracking-tight leading-snug mb-1"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {req.name}
                          </h3>
                          <div
                            className="font-bold text-[11px] text-slate-400 tracking-widest flex items-center gap-1 uppercase"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <Briefcase className="w-3 h-3" /> {req.role}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 border-[2px] border-green-600 text-green-700 rounded-full font-black text-[9px] uppercase tracking-widest"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Terverifikasi
                        </div>
                        <div
                          className="font-bold text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <Calendar className="w-3 h-3" /> {req.dateCompleted}
                        </div>
                      </div>
                    </div>

                    {/* Score Section */}
                    <div className="flex-1 flex flex-col md:flex-row gap-6 border-t-[2.5px] border-dashed border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:border-t-0 md:border-l-[2.5px] md:pl-6 items-start md:items-center">
                      <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-start">
                        <div className="flex flex-col items-center">
                          <span
                            className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-1"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Skor Awal
                          </span>
                          <div
                            className="w-[48px] h-[48px] rounded-full border-[2.5px] border-slate-300 dark:border-slate-700 flex items-center justify-center font-black text-[16px] text-slate-400"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {req.aiScore || "-"}
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <span
                            className="font-bold text-[10px] text-blue-500 uppercase tracking-widest mb-1"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Skor Anda
                          </span>
                          <div
                            className="w-[48px] h-[48px] rounded-full border-[2.5px] border-blue-500 flex items-center justify-center font-black text-[18px] text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {req.proScore}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <span
                          className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-1 block"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Ulasan Konfirmasi Industri
                        </span>
                        <p
                          className="font-bold text-[13px] text-slate-500 italic leading-relaxed"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          "{req.comment}"
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center justify-end w-full md:w-auto">
                        <button
                          onClick={() => navigate({ to: `/pro/review/${req.id}` })}
                          className="bg-[var(--bg-b)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-color)] rounded-xl px-[16px] py-[12px] font-black text-[11px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[3px_3px_0px_var(--shadow-color)] hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <Eye className="w-4 h-4" /> Buka Evaluasi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
