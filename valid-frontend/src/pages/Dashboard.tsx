// HALAMAN: C:\laragon\www\valid-react\src\pages\Dashboard.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, animate, useMotionValue, Variants } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Mic,
  Star,
  Users,
  Coins,
  LogOut,
  ChevronRight,
  Activity,
  Compass,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { dashboardApi } from "../lib/api";
import { ThemeToggle } from "../components/valid/ThemeToggle";
import { UserSidebar } from "../components/valid/UserSidebar";

const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return controls.stop;
  }, [value, count]);

  return <>{display}</>;
}

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.getCandidateDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
        // keep existing UI/fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        {/* Floating background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-[40%] left-[5%] w-[250px] h-[250px] bg-yellow-400/10 rounded-full blur-[80px]" />
        </div>

        <motion.div
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1000px] mx-auto relative z-10"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="absolute top-4 right-4 z-50 md:-top-4 md:right-0">
            <ThemeToggle />
          </div>
          {/* TOP BAR */}
          <motion.div
            variants={sectionVariants}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 mb-[32px]"
          >
            <div>
              <div
                className="inline-flex px-3 py-1 bg-[var(--card-bg)] border-[2px] border-[var(--border-color)] rounded-full shadow-[2px_2px_0px_#0f172a] font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-[12px]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Minggu, 25 Mei 2026
              </div>
              <div
                className="font-black text-[16px] md:text-[20px] text-blue-600 tracking-[0.1em] uppercase"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                SELAMAT DATANG,
              </div>
              <div
                className="font-black text-[40px] md:text-[48px] text-[var(--text-color)] leading-[0.9] tracking-tighter mt-1 uppercase"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                {loading ? "MEMUAT..." : data?.profile?.displayName || "RIZKY"}
              </div>
            </div>
            <button
              onClick={() => (window.location.href = "/dashboard/ai-interview")}
              className="bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all text-white rounded-[1rem] px-[24px] py-[14px] font-black text-[13px] uppercase tracking-wider flex items-center justify-center gap-2 border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] hover:shadow-[6px_6px_0px_var(--shadow-color)] w-full sm:w-auto"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Mulai Wawancara <Activity className="w-4 h-4" />
            </button>
          </motion.div>

          {/* STAT CARDS ROW */}
          <motion.div
            variants={sectionVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[32px]"
          >
            {[
              {
                val: data?.summary?.totalInterviews ?? 0,
                label: "WAWANCARA SELESAI",
                trend: "BULAN INI",
              },
              {
                val: data?.summary?.totalPortfolios ?? 0,
                label: "PROYEK PORTFOLIO",
                trend: "BULAN INI",
              },
              {
                val: data?.profile?.reputationPoints ?? 0,
                label: "POIN REPUTASI",
                trend: "SAAT INI",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[24px] flex flex-col items-start shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all duration-300 group"
              >
                <div
                  className="font-black text-[48px] text-blue-600 leading-[0.8] group-hover:scale-110 transition-transform origin-left"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  <AnimatedNumber value={stat.val} />
                </div>
                <div
                  className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-widest mt-[16px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {stat.label}
                </div>
                <div className="mt-[16px] w-full pt-[16px] border-t-[2px] border-dashed border-[var(--border-color)]">
                  <div
                    className="inline-flex items-center justify-center px-[10px] py-[4px] bg-blue-100 dark:bg-blue-900/30 border-[2px] border-blue-600 text-blue-700 dark:text-blue-400 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0px_#2563EB]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {stat.trend}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* TWO ACTION CARDS */}
          <motion.div
            variants={sectionVariants}
            className="flex flex-col lg:flex-row gap-[16px] mb-[32px]"
          >
            {/* AI Interview Action Card */}
            <motion.div
              onClick={() => (window.location.href = "/dashboard/ai-interview")}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex-[3] bg-blue-600 border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1.5rem] p-[32px] relative overflow-hidden flex flex-col justify-between items-start cursor-pointer group"
            >
              <div
                className="absolute -bottom-[10px] -right-[10px] font-black text-[120px] md:text-[140px] leading-none text-white/10 tracking-[-4px] pointer-events-none select-none group-hover:scale-110 transition-transform origin-bottom-right"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                AI
              </div>
              <div className="relative z-10">
                <div
                  className="inline-flex px-3 py-1 bg-[var(--card-bg)]/20 border-2 border-white/40 rounded-full font-black text-[9px] uppercase tracking-widest text-white mb-[12px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  FITUR UTAMA
                </div>
                <div
                  className="font-black text-[28px] md:text-[32px] text-white leading-tight uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  WAWANCARA AI
                </div>
                <div
                  className="font-bold text-[13px] text-blue-100 mt-[8px] leading-relaxed max-w-[90%]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Analisis kontak mata, kepercayaan diri, dan komunikasi kamu secara real-time.
                </div>
              </div>
              <div
                className="relative z-10 bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[20px] py-[10px] font-black text-[12px] uppercase tracking-wider mt-[24px] inline-flex items-center gap-2 shadow-[3px_3px_0px_var(--shadow-color)] group-hover:bg-[var(--text-color)] group-hover:text-[var(--card-bg)] group-hover:-translate-y-1 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Mulai Sekarang <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* Portfolio Action Card */}
            <motion.div
              onClick={() => (window.location.href = "/dashboard/portfolio")}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex-[2] bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1.5rem] p-[32px] relative overflow-hidden flex flex-col justify-between items-start cursor-pointer group"
            >
              <div className="absolute top-[24px] right-[24px] w-[20px] h-[20px] bg-yellow-400 border-[2px] border-[var(--border-color)] rounded-lg rotate-[15deg] group-hover:rotate-[45deg] transition-transform" />
              <div className="absolute bottom-[24px] right-[24px] w-[14px] h-[14px] bg-blue-500 border-[2px] border-[var(--border-color)] rounded-full rotate-[-15deg] group-hover:scale-150 transition-transform" />

              <div className="relative z-10">
                <div
                  className="inline-flex px-3 py-1 bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] rounded-full font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-[12px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  PORTFOLIO
                </div>
                <div
                  className="font-black text-[28px] md:text-[32px] text-[var(--text-color)] leading-tight uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  PROYEK BARU
                </div>
                <div
                  className="font-bold text-[13px] text-[var(--text-muted)] mt-[8px] leading-relaxed max-w-[90%]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Dokumentasikan pekerjaan nyata dan bangun portofolio yang meyakinkan.
                </div>
              </div>
              <div
                className="relative z-10 bg-[var(--card-bg)] text-[var(--text-color)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[20px] py-[10px] font-black text-[12px] uppercase tracking-wider mt-[24px] inline-flex items-center gap-2 shadow-[3px_3px_0px_var(--shadow-color)] group-hover:bg-[var(--text-color)] group-hover:text-[var(--card-bg)] group-hover:-translate-y-1 transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Tambah <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
            {/* LAST INTERVIEW RESULT */}
            <motion.div variants={sectionVariants} className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-[16px] shrink-0">
                <div
                  className="font-black text-[18px] md:text-[20px] text-[var(--text-color)] uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  HASIL WAWANCARA
                </div>
                <button className="px-4 py-2 border-[2.5px] border-[var(--border-color)] rounded-xl font-black text-[11px] uppercase bg-[var(--card-bg)] text-[var(--text-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all">
                  Lihat Semua
                </button>
              </div>

              <div className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] rounded-[1.5rem] p-[24px] flex flex-col sm:flex-row gap-[24px] items-start sm:items-center shadow-[4px_4px_0px_var(--shadow-color)] transform hover:-translate-y-1 transition-transform flex-1">
                {/* Score Circle */}
                <div className="relative w-[80px] h-[80px] shrink-0">
                  <svg
                    className="w-full h-full transform -rotate-90 drop-shadow-[2px_2px_0px_#0f172a]"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="var(--border-color)"
                      strokeOpacity="0.2"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="#2563EB"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="264"
                      strokeDashoffset="58"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <div
                      className="font-black text-[24px] text-[var(--text-color)] leading-none"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {data?.lastInterviewResult?.score ?? 0}
                    </div>
                    <div
                      className="font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] leading-none mt-1"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      /100
                    </div>
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="flex-1 w-full flex flex-col gap-[16px]">
                  {(data?.lastInterviewResult?.metrics || []).length > 0 ? (
                    data.lastInterviewResult.metrics.map((m: any, i: number) => (
                      <div key={i} className="flex flex-col">
                        <div className="flex justify-between items-center mb-[6px]">
                          <span
                            className="font-black text-[10px] text-[var(--text-color)] tracking-widest uppercase"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {m.label}
                          </span>
                          <span
                            className="font-black text-[12px] text-blue-600"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {m.val}%
                          </span>
                        </div>
                        <div className="w-full h-[6px] bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] rounded-full overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.val}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full bg-blue-600 border-r-[2px] border-[var(--border-color)] rounded-r-full"
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm font-bold text-[var(--text-muted)] p-4 text-center">
                      Belum ada data metrik
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-[12px]">
                    <button
                      className="bg-blue-600 border-[2.5px] border-[var(--border-color)] text-white rounded-xl px-[20px] py-[10px] font-black text-[11px] uppercase tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] hover:bg-blue-700 transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      MINTA REVIEW
                    </button>
                    <button
                      className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-xl px-[20px] py-[10px] font-black text-[11px] uppercase tracking-wider shadow-[4px_4px_0px_var(--shadow-color)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_var(--shadow-color)] transition-all"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      DETAIL
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RECENT ACTIVITY */}
            <motion.div variants={sectionVariants} className="flex flex-col h-full">
              <div
                className="font-black text-[18px] md:text-[20px] text-[var(--text-color)] uppercase tracking-tight mb-[16px] shrink-0"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                AKTIVITAS TERKINI
              </div>

              <div className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1.5rem] overflow-hidden flex flex-col flex-1 min-h-[220px]">
                {(data?.activities?.length > 0 ? data.activities : []).length > 0 ? (
                  data.activities.map((act: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex-1 flex items-center justify-between p-[16px] border-b-[2px] border-dashed border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-a)] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-[12px]">
                        <div
                          className={`w-[12px] h-[12px] rounded-full border-[2px] border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)] ${act.type === "blue" ? "bg-blue-600" : act.type === "yellow" ? "bg-yellow-400" : "bg-slate-300"}`}
                        />
                        <span
                          className="font-bold text-[12px] md:text-[13px] text-[var(--text-color)] group-hover:translate-x-1 transition-transform"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {act.text}
                        </span>
                      </div>
                      <span
                        className="font-black text-[9px] uppercase tracking-widest text-[var(--text-muted)] shrink-0 ml-2 hidden sm:block"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {act.time}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center p-[24px]">
                    <span className="text-[14px] font-bold text-[var(--text-muted)]">
                      Belum ada aktivitas
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
