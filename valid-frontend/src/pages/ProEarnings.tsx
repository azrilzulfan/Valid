// HALAMAN: C:\laragon\www\valid-react\src\pages\ProEarnings.tsx
// FUNGSI: Menampilkan data penghasilan finansial & transaksi penarikan koin asli dari database
// API YANG DIBUTUHKAN: dashboardApi.getReviewerDashboard()

import { motion, Variants } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Coins,
  LogOut,
  MessageSquare,
  Compass,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CreditCard,
  ChevronRight,
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

export function ProEarnings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashRes = await dashboardApi.getReviewerDashboard();

        const statsData = dashRes?.stats || dashRes;
        setStats(statsData);

        const income = (statsData?.recentReviews || []).map((p: any) => ({
          id: p.portfolioId || p.id,
          type: "income",
          title: `Review Portofolio: ${p.title || "Tanpa Judul"}`,
          date:
            p.reviewedAt && p.reviewedAt !== "-"
              ? new Date(p.reviewedAt).toLocaleString("id-ID")
              : "Selesai",
          amount: p.reviewFee || p.pointEarned || p.points || 50,
        }));

        const withdrawals = (statsData?.recentWithdrawals || []).map((w: any) => ({
          id: w.id,
          type: "payout",
          title: `Penarikan Saldo Keuangan`,
          date: new Date(w.createdAt).toLocaleString("id-ID"),
          amount: w.amount,
        }));

        setTransactions([...income, ...withdrawals]);
      } catch (err) {
        console.error("Gagal memuat data keuangan verifikator:", err);
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

  const getTrendReviewCount = (dayValue: any) => {
    return Number(dayValue) || 0;
  };

  const reviewCounts = [
    getTrendReviewCount(stats?.weeklyTrend?.senin),
    getTrendReviewCount(stats?.weeklyTrend?.selasa),
    getTrendReviewCount(stats?.weeklyTrend?.rabu),
    getTrendReviewCount(stats?.weeklyTrend?.kamis),
    getTrendReviewCount(stats?.weeklyTrend?.jumat),
    getTrendReviewCount(stats?.weeklyTrend?.sabtu),
    getTrendReviewCount(stats?.weeklyTrend?.minggu),
  ];

  // FIX SCALE 2: Penentuan pembagi maksimum dengan batas bawah 5 agar visualisasi tetap berfluktuasi proporsional
  const maxReviews = Math.max(...reviewCounts, 5);

  const getBarHeight = (value: number) => {
    const targetVal = Number(value) || 0;
    if (targetVal === 0) return "0px"; // Menjamin batang berharga 0 koin rata di lantai terbawah
    return `${Math.min((targetVal / maxReviews) * 100, 100)}%`;
  };

  const getDayCoins = (value: number) => {
    return (Number(value) || 0) * 50;
  };

  const weeklyTrendData = [
    { day: "Sen", h: getBarHeight(reviewCounts[0]), val: getDayCoins(reviewCounts[0]) },
    { day: "Sel", h: getBarHeight(reviewCounts[1]), val: getDayCoins(reviewCounts[1]) },
    { day: "Rab", h: getBarHeight(reviewCounts[2]), val: getDayCoins(reviewCounts[2]) },
    { day: "Kam", h: getBarHeight(reviewCounts[3]), val: getDayCoins(reviewCounts[3]) },
    { day: "Jum", h: getBarHeight(reviewCounts[4]), val: getDayCoins(reviewCounts[4]) },
    { day: "Sab", h: getBarHeight(reviewCounts[5]), val: getDayCoins(reviewCounts[5]) },
    { day: "Min", h: getBarHeight(reviewCounts[6]), val: getDayCoins(reviewCounts[6]) },
  ];

  const totalKoin = stats?.summary?.coins ?? stats?.profile?.coins ?? 0;

  const hitungTotalKoinMingguan = () => {
    if (!stats?.weeklyTrend) return 0;
    const t = stats.weeklyTrend;
    const totalReviewMingguIni =
      (Number(t.senin) || 0) +
      (Number(t.selasa) || 0) +
      (Number(t.rabu) || 0) +
      (Number(t.kamis) || 0) +
      (Number(t.jumat) || 0) +
      (Number(t.sabtu) || 0) +
      (Number(t.minggu) || 0);

    return totalReviewMingguIni * 50;
  };

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
            { icon: Compass, label: "Jelajah Proyek", path: "/pro/explore" },
            { icon: MessageSquare, label: "Antrean Portofolio", path: "/pro/requests" },
            { icon: Coins, label: "Keuangan", active: true, path: "/pro/earnings" },
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

          {/* HEADER */}
          <motion.div variants={sectionVariants} className="mb-[40px]">
            <div
              className="inline-flex px-3 py-1 bg-green-100 dark:bg-green-950/50 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-green-700 dark:text-green-400 mb-[16px] shadow-[2px_2px_0px_#0f172a]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              KAS & SALDO VERIFIKATOR
            </div>
            <h1
              className="font-black text-[36px] md:text-[52px] text-[var(--text-color)] leading-[0.9] tracking-tighter uppercase mb-2"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              PENGHASILAN PRO.
            </h1>
            <p
              className="font-bold text-[14px] md:text-[16px] text-slate-400 max-w-[600px] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Kelola pendapatan koin riil Anda yang terkumpul dari hasil kontribusi validasi dan
              standardisasi portofolio talenta digital.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
            {/* SALDO CARD & CHART */}
            <div className="lg:col-span-1 flex flex-col gap-[32px]">
              <motion.div
                variants={sectionVariants}
                className="bg-slate-900 border-[3px] border-slate-900 rounded-[1.5rem] p-[32px] shadow-[8px_8px_0px_#FBBF24] relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/5 rounded-bl-full pointer-events-none" />
                <div className="absolute -bottom-4 -right-4 w-[100px] h-[100px] bg-yellow-400/20 rounded-full pointer-events-none blur-xl" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Wallet className="w-6 h-6 text-yellow-400" />
                    <span
                      className="font-bold text-[12px] text-slate-300 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Saldo Aktif
                    </span>
                  </div>

                  <div className="flex items-end gap-2 mb-1">
                    <span
                      className="font-black text-[56px] text-white leading-none tracking-tighter"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {loading ? "-" : totalKoin}
                    </span>
                    <span
                      className="font-black text-[16px] text-yellow-400 uppercase mb-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Koin
                    </span>
                  </div>

                  <div
                    className="font-bold text-[14px] text-slate-400 mb-8"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    ≈ Rp {loading ? "-" : (totalKoin * 1000).toLocaleString("id-ID")}
                  </div>

                  <button
                    onClick={() =>
                      alert("Fitur penarikan kas sedang disiapkan ke rekening bank Anda.")
                    }
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-[1rem] py-[16px] font-black text-[13px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <CreditCard className="w-5 h-5" /> Tarik Saldo Ke Kas
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] p-[24px] shadow-[6px_6px_0px_var(--shadow-color)]"
              >
                <div
                  className="font-bold text-[12px] text-slate-400 uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Pendapatan 7 Hari Terakhir
                </div>
                <div
                  className="font-black text-[32px] text-[var(--text-color)] tracking-tighter mb-6"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  + {loading ? "-" : hitungTotalKoinMingguan()} KOIN
                </div>

                <div className="h-[180px] flex items-end justify-between gap-2 border-b-[2.5px] border-slate-900 pb-2 relative">
                  <div className="absolute top-0 w-full border-t-[2px] border-dashed border-slate-200 dark:border-slate-800" />
                  <div className="absolute top-1/2 w-full border-t-[2px] border-dashed border-slate-200 dark:border-slate-800" />

                  {weeklyTrendData.map((bar, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 flex-1 h-full justify-end z-10 group relative"
                    >
                      <div className="absolute bottom-full mb-1 bg-slate-900 text-white font-black text-[9px] px-1.5 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 whitespace-nowrap">
                        +{bar.val} Koin
                      </div>
                      <div
                        className={`w-full max-w-[24px] border-[2.5px] border-slate-900 rounded-t-sm shadow-[2px_0px_0px_var(--shadow-color)] transition-all duration-500 group-hover:brightness-110 ${i === 6 ? "bg-yellow-400" : "bg-blue-600"}`}
                        style={{ height: bar.h }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-2 px-1">
                  {weeklyTrendData.map((bar, i) => (
                    <span
                      key={i}
                      className={`font-black text-[10px] w-[24px] text-center uppercase tracking-widest ${i === 6 ? "text-yellow-500" : "text-slate-400"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {bar.day}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* TRANSACTIONS LIST */}
            <motion.div variants={sectionVariants} className="lg:col-span-2">
              <h2
                className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight mb-[20px]"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                RIWAYAT MUTASI DOMPET
              </h2>

              <div className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden">
                <div className="divide-y-[3px] divide-slate-900">
                  {loading && (
                    <div
                      className="p-[40px] text-center font-black text-[14px] text-slate-400 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Memuat Mutasi Keuangan...
                    </div>
                  )}
                  {!loading && transactions.length === 0 && (
                    <div
                      className="p-[40px] text-center font-black text-[14px] text-slate-400 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Belum ada riwayat pendapatan
                    </div>
                  )}
                  {!loading &&
                    transactions.map((trx, index) => (
                      <div
                        key={trx.id || index}
                        className="p-[20px] md:p-[24px] flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-[48px] h-[48px] rounded-[12px] border-[2.5px] border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a] ${trx.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                          >
                            {trx.type === "income" ? (
                              <ArrowUpRight className="w-6 h-6" />
                            ) : (
                              <ArrowDownLeft className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <div
                              className="font-black text-[15px] md:text-[16px] text-[var(--text-color)] uppercase tracking-tight mb-1"
                              style={{ fontFamily: "var(--font-impact)" }}
                            >
                              {trx.title}
                            </div>
                            <div
                              className="font-bold text-[11px] text-slate-400 uppercase tracking-widest"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {trx.date}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-black text-[18px] md:text-[20px] ${trx.type === "income" ? "text-green-600" : "text-red-600"}`}
                          style={{ fontFamily: "var(--font-impact)" }}
                        >
                          {trx.type === "income" ? "+" : "-"}
                          {trx.amount}{" "}
                          <span className="text-[12px] text-slate-400 uppercase">Koin</span>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 border-t-[3px] border-slate-900 bg-[var(--bg-b)] text-center">
                  <button
                    onClick={() => navigate({ to: "/pro/history" })}
                    className="font-black text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline flex items-center justify-center w-full gap-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Buka Riwayat Lengkap <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
