// HALAMAN: C:\laragon\www\valid-react\src\pages\ProDashboard.tsx
// FUNGSI: Komponen/Halaman Beranda Verifikator Berbasis Data Riil Backend
// API YANG DIBUTUHKAN: dashboardApi.getReviewerDashboard(), portfolioApi.getAssignedToMe()

import { motion, Variants } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Star,
  Coins,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  MessageSquare,
  Briefcase,
  Compass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "../components/valid/ThemeToggle";
import { dashboardApi, portfolioApi } from "../lib/api";
import { clearAuth } from "../lib/auth";
import { useCurrentUser } from "../lib/useCurrentUser";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function ProDashboard() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [activeTab, setActiveTab] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);

  const [calculatedTrend, setCalculatedTrend] = useState<any>({
    senin: 0,
    selasa: 0,
    rabu: 0,
    kamis: 0,
    jumat: 0,
    sabtu: 0,
    minggu: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, assignedRes] = await Promise.all([
          dashboardApi.getReviewerDashboard(),
          portfolioApi.getAssignedToMe(),
        ]);

        const statsData = dashRes?.stats || dashRes;
        setStats(statsData);

        const assigned = assignedRes?.portfolios || [];

        const pending = assigned
          .filter((p: any) => p.status === "under_review")
          .map((p: any) => ({
            id: p.portfolioId,
            name: p.title || "No Title",
            role: p.vocationField || "General",
            date: p.assignedAt ? new Date(p.assignedAt).toLocaleDateString() : "-",
            status: "Menunggu",
          }));

        const completed = assigned
          .filter((p: any) => p.status === "approved")
          .map((p: any) => ({
            id: p.portfolioId,
            name: p.title || "No Title",
            role: p.vocationField || "General",
            date: p.verifierReview?.reviewedAt
              ? new Date(p.verifierReview.reviewedAt).toLocaleDateString()
              : "-",
            status: "Selesai",
            score: p.verifiedScore,
          }));

        setRequests([...pending, ...completed]);

        const localTrend = {
          senin: 0,
          selasa: 0,
          rabu: 0,
          kamis: 0,
          jumat: 0,
          sabtu: 0,
          minggu: 0,
        };
        const dayMappingIndo = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];

        assigned.forEach((p: any) => {
          const dateString = p.verifierReview?.reviewedAt || p.assignedAt;
          if (dateString) {
            const logDate = new Date(dateString);
            const diffTime = Math.abs(new Date().getTime() - logDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
              const dayName = dayMappingIndo[logDate.getDay()];
              (localTrend as any)[dayName]++;
            }
          }
        });
        setCalculatedTrend(localTrend);
      } catch (err) {
        console.error("Gagal mengambil data dashboard pro:", err);
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

  const getTrendVal = (keyIndo: string, keyEng: string, keyShort: string) => {
    if (!stats?.weeklyTrend) return calculatedTrend[keyIndo] || 0;
    return (
      stats.weeklyTrend[keyIndo] ??
      stats.weeklyTrend[keyEng] ??
      stats.weeklyTrend[keyShort] ??
      stats.weeklyTrend[keyEng.toLowerCase()] ??
      calculatedTrend[keyIndo] ??
      0
    );
  };

  const dayValues = [
    getTrendVal("senin", "Monday", "Mon"),
    getTrendVal("selasa", "Tuesday", "Tue"),
    getTrendVal("rabu", "Wednesday", "Wed"),
    getTrendVal("kamis", "Thursday", "Thu"),
    getTrendVal("jumat", "Friday", "Fri"),
    getTrendVal("sabtu", "Saturday", "Sat"),
    getTrendVal("minggu", "Sunday", "Sun"),
  ];

  const totalWeeklyReviews = dayValues.reduce((a, b) => a + b, 0);

  // FIX SCALE 1: Menentukan pembagi minimum bernilai 5 agar grafik tidak melonjak penuh jika data masih kecil
  const maxWeeklyVal = Math.max(...dayValues, 5);

  const getBarHeight = (value: number) => {
    const targetVal = Number(value) || 0;
    if (targetVal === 0) return "0px"; // Hari tanpa data tidak boleh naik ke atas sama sekali
    return `${Math.min((targetVal / maxWeeklyVal) * 100, 100)}%`;
  };

  const weeklyTrendData = [
    { day: "Sen", h: getBarHeight(dayValues[0]), val: dayValues[0] },
    { day: "Sel", h: getBarHeight(dayValues[1]), val: dayValues[1] },
    { day: "Rab", h: getBarHeight(dayValues[2]), val: dayValues[2] },
    { day: "Kam", h: getBarHeight(dayValues[3]), val: dayValues[3] },
    { day: "Jum", h: getBarHeight(dayValues[4]), val: dayValues[4] },
    { day: "Sab", h: getBarHeight(dayValues[5]), val: dayValues[5] },
    { day: "Min", h: getBarHeight(dayValues[6]), val: dayValues[6] },
  ];

  return (
    <div className="flex w-full h-screen bg-[var(--bg-b)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--bg-a)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-slate-900 flex md:flex-col z-50 md:z-auto transition-all shrink-0">
        <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[3px] border-slate-900 bg-yellow-400 items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-slate-900 fill-slate-900" />
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
            { icon: LayoutDashboard, label: "Beranda Pro", active: true, path: "/pro/dashboard" },
            { icon: Compass, label: "Jelajah Proyek", path: "/pro/explore" },
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
                className={`text-[9px] md:text-[13px] uppercase tracking-wider ${item.active ? "font-black" : "font-bold"}`}
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
          className="p-[20px_16px] md:p-[40px_48px] max-w-[1100px] mx-auto relative z-10"
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
              className="inline-flex px-3 py-1 bg-purple-100 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 mb-[16px] shadow-[2px_2px_0px_#0f172a]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              MODE PROFESIONAL
            </div>
            <h1
              className="font-black text-[36px] md:text-[52px] text-[var(--text-color)] leading-[0.9] tracking-tighter uppercase mb-2"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              OVERVIEW REVIEWER.
            </h1>
            <p
              className="font-bold text-[14px] md:text-[16px] text-slate-400 max-w-[600px] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Kelola antrean portofolio yang ditugaskan kepada Anda, berikan penilaian terstruktur,
              dan pantau rekam jejak verifikasi Anda.
            </p>
          </motion.div>

          {/* PENDING APPROVAL BANNER */}
          {(user?.verifierStatus === "pending" || stats?.profile?.verifierStatus === "pending") && (
            <motion.div
              variants={sectionVariants}
              className="mb-[32px] bg-yellow-100 dark:bg-yellow-950/30 border-[3px] border-yellow-500 rounded-[1.5rem] p-6 shadow-[4px_4px_0px_#eab308] text-[var(--text-color)]"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-lg text-yellow-800 dark:text-yellow-400 uppercase tracking-tight" style={{ fontFamily: "var(--font-impact)" }}>
                    Pendaftaran Verifikator Sedang Ditinjau
                  </h3>
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-500 mt-1 leading-relaxed">
                    Akun verifikator profesional Anda sedang menunggu proses persetujuan oleh Admin. Anda akan menerima notifikasi setelah akun disetujui.
                  </p>
                </div>
                <div className="px-4 py-2 bg-yellow-500 text-slate-900 border-2 border-slate-900 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-[2px_2px_0px_#000] shrink-0">
                  PENDING
                </div>
              </div>
            </motion.div>
          )}

          {/* STAT CARDS ROW */}
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[40px]"
          >
            <div className="bg-yellow-400 border-[3px] border-slate-900 rounded-[1.5rem] p-[28px] shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#0f172a] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[48px] h-[48px] bg-white border-[3px] border-slate-900 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
                  <Clock className="w-6 h-6 text-slate-900" />
                </div>
              </div>
              <div
                className="font-black text-[48px] text-slate-900 leading-[0.8] tracking-tighter mb-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {loading ? "-" : requests.filter((r) => r.status === "Menunggu").length}
              </div>
              <div
                className="font-black text-[12px] text-slate-800 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Ditugaskan & Menunggu
              </div>
            </div>

            <div className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] p-[28px] shadow-[6px_6px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[48px] h-[48px] bg-blue-100 border-[3px] border-slate-900 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_var(--shadow-color)]">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div
                className="font-black text-[48px] text-[var(--text-color)] leading-[0.8] tracking-tighter mb-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {loading ? "-" : stats?.profile?.totalReviews || stats?.totalReviews || 0}
              </div>
              <div
                className="font-black text-[12px] text-slate-400 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Total Portofolio Dinilai
              </div>
            </div>

            <div className="bg-slate-900 text-white border-[3px] border-slate-900 rounded-[1.5rem] p-[28px] shadow-[6px_6px_0px_#FBBF24] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#FBBF24] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-[48px] h-[48px] bg-slate-800 border-[3px] border-slate-700 rounded-[12px] flex items-center justify-center shadow-[3px_3px_0px_#000000]">
                  <Coins className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <div
                className="font-black text-[48px] text-white leading-[0.8] tracking-tighter mb-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {loading ? "-" : stats?.profile?.coins || stats?.coins || 0}
              </div>
              <div
                className="font-black text-[12px] text-slate-400 uppercase tracking-widest"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Saldo Koin Dompet
              </div>
            </div>
          </motion.div>

          {/* MAIN CONTENT SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
            <motion.div variants={sectionVariants} className="lg:col-span-2">
              <div className="flex justify-between items-end mb-[20px]">
                <h2
                  className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  ANTREAN PORTOFOLIO
                </h2>
                <div className="hidden sm:flex bg-[var(--bg-a)] border-[2px] border-slate-900 rounded-lg p-1 shadow-[2px_2px_0px_#0f172a]">
                  {["Semua", "Menunggu", "Selesai"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 rounded-md font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? "bg-slate-900 text-white" : "text-slate-400 hover:text-[var(--text-color)]"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] shadow-[6px_6px_0px_var(--shadow-color)] overflow-hidden">
                <div className="divide-y-[3px] divide-slate-900">
                  {loading && (
                    <div
                      className="p-[40px] text-center font-black text-[14px] text-slate-400 uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Memuat...
                    </div>
                  )}
                  {!loading &&
                    requests
                      .filter((req) => activeTab === "Semua" || req.status === activeTab)
                      .map((req) => (
                        <div
                          key={req.id}
                          className="p-[20px] md:p-[24px] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-[48px] h-[48px] rounded-[12px] border-[2.5px] border-slate-900 bg-blue-100 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a]">
                              <span
                                className="font-black text-[20px] text-blue-600"
                                style={{ fontFamily: "var(--font-impact)" }}
                              >
                                {req.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div
                                className="font-black text-[16px] text-[var(--text-color)] uppercase tracking-tight mb-1"
                                style={{ fontFamily: "var(--font-impact)" }}
                              >
                                {req.name}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className="font-bold text-[11px] text-slate-400 tracking-wider flex items-center gap-1"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  <Briefcase className="w-3 h-3" /> {req.role}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span
                                  className="font-bold text-[10px] text-slate-400 uppercase tracking-widest"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {req.date}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 justify-between md:justify-end border-t-[2px] border-dashed border-slate-200 dark:border-slate-700 md:border-0 pt-4 md:pt-0">
                            {req.status === "Menunggu" ? (
                              <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 border-[2px] border-yellow-500 text-yellow-700 rounded-full font-black text-[9px] uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                Menunggu
                              </div>
                            ) : (
                              <div
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 border-[2px] border-green-600 text-green-700 rounded-full font-black text-[9px] uppercase tracking-widest"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                Selesai ({req.score})
                              </div>
                            )}

                            {req.status === "Menunggu" ? (
                              <button
                                onClick={() => navigate({ to: `/pro/review/${req.id}` })}
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[3px_3px_0px_var(--shadow-color)] hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all flex items-center gap-1 shrink-0"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                Mulai Review <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button className="bg-[var(--bg-a)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-color)] rounded-lg p-[10px] border-[2.5px] border-slate-900 shadow-[3px_3px_0px_var(--shadow-color)] hover:shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all shrink-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                  {!loading &&
                    requests.filter((req) => activeTab === "Semua" || req.status === activeTab)
                      .length === 0 && (
                      <div className="p-[40px] text-center">
                        <div className="w-[64px] h-[64px] bg-slate-100 dark:bg-slate-800 rounded-full border-[3px] border-slate-200 dark:border-slate-700 mx-auto flex items-center justify-center mb-4">
                          <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                        </div>
                        <div
                          className="font-black text-[16px] text-slate-400 uppercase tracking-widest"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Tidak ada permintaan ulasan
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </motion.div>

            {/* EARNINGS CHART */}
            <motion.div variants={sectionVariants} className="lg:col-span-1">
              <h2
                className="font-black text-[24px] md:text-[28px] text-[var(--text-color)] uppercase tracking-tight mb-[20px]"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                TREN AKTIVITAS
              </h2>

              <div className="bg-[var(--bg-a)] border-[3px] border-slate-900 rounded-[1.5rem] shadow-[6px_6px_0px_var(--shadow-color)] p-[24px]">
                <div
                  className="font-bold text-[12px] text-slate-400 uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Ulasan 7 Hari Terakhir
                </div>
                <div
                  className="font-black text-[32px] text-[var(--text-color)] tracking-tighter mb-6"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  +{totalWeeklyReviews} ULASAN
                </div>

                <div className="h-[180px] flex items-end justify-between gap-2 border-b-[2.5px] border-slate-900 pb-2 relative">
                  <div className="absolute top-0 w-full border-t-[2px] border-dashed border-slate-200 dark:border-slate-800" />
                  <div className="absolute top-1/2 w-full border-t-[2px] border-dashed border-slate-200 dark:border-slate-800" />

                  {weeklyTrendData.map((bar, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 flex-1 h-full justify-end z-10 group relative"
                    >
                      <div className="absolute bottom-full mb-1 bg-slate-900 text-white font-black text-[9px] px-1.5 py-0.5 rounded border border-slate-900 shadow-[1px_1px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                        {bar.val}
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

                <button
                  onClick={() => navigate({ to: "/pro/earnings" })}
                  className="w-full mt-6 bg-[var(--bg-b)] hover:bg-slate-100 dark:hover:bg-slate-800 text-[var(--text-color)] rounded-xl py-[12px] font-black text-[11px] uppercase tracking-widest border-[2.5px] border-slate-900 shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5 transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Tarik Saldo Koin
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
