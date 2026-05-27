import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Mic,
  Star,
  Users,
  Coins,
  LogOut,
  ChevronRight,
  X,
  CheckCircle2,
  Hourglass,
  XCircle,
  Download,
  Compass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { UserSidebar } from "../components/valid/UserSidebar";

const DUMMY_REVIEWS = [
  {
    id: 1,
    status: "SELESAI",
    project: "Mesin Las MIG Otomatis",
    reviewerName: "Budi Santoso",
    price: 50,
    score: 78,
    date: "10 Apr 2026",
    feedback:
      "Rizky menunjukkan penguasaan teknik pengelasan yang solid. Kontak mata yang baik mencerminkan kepercayaan diri yang memadai. Area yang perlu ditingkatkan adalah kecepatan bicara yang terkadang terlalu cepat saat menjelaskan proses teknis.",
    verifiedSkills: ["PENGELASAN TERVERIFIKASI", "CNC MACHINING TERVERIFIKASI"],
    rating: 4,
    gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)",
  },
  {
    id: 2,
    status: "MENUNGGU",
    project: "Sistem Quality Control",
    reviewerName: "Siti Rahayu",
    price: 40,
    score: null,
    date: "23 Mei 2026",
    gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)",
  },
  {
    id: 3,
    status: "DITERIMA",
    project: "Desain Jig & Fixture",
    reviewerName: "Ahmad Fauzi",
    price: 60,
    score: null,
    date: "20 Mei 2026",
    gradient: "linear-gradient(135deg, #059669, #047857)",
  },
  {
    id: 4,
    status: "SELESAI",
    project: "Laporan Magang Industri",
    reviewerName: "Dewi Lestari",
    price: 35,
    score: 82,
    date: "2 Mar 2026",
    feedback:
      "Laporan disusun dengan sangat sistematis. Semua poin penting selama magang terdokumentasi dengan baik. Kepercayaan diri saat mempresentasikan hasil juga sangat menonjol.",
    verifiedSkills: ["AKUNTANSI TERVERIFIKASI", "AUDIT TERVERIFIKASI"],
    rating: 5,
    gradient: "linear-gradient(135deg, #DC2626, #B91C1C)",
  },
  {
    id: 5,
    status: "DITOLAK",
    project: "Mesin Las MIG Otomatis",
    reviewerName: "Ahmad Fauzi",
    price: 60,
    score: null,
    date: "15 Apr 2026",
    reason: "Proyek di luar bidang keahlian saya.",
    gradient: "linear-gradient(135deg, #059669, #047857)",
  },
];

const STATUS_COLORS = {
  MENUNGGU: "bg-yellow-400 border-yellow-600 text-yellow-900",
  DITERIMA: "bg-blue-400 border-blue-600 text-blue-900",
  SELESAI: "bg-green-400 border-green-600 text-green-900",
  DITOLAK: "bg-red-400 border-red-600 text-red-900",
};

const BAR_COLORS = {
  MENUNGGU: "bg-yellow-400",
  DITERIMA: "bg-blue-500",
  SELESAI: "bg-green-500",
  DITOLAK: "bg-red-500",
};

const pageVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const slideOverVariants = {
  hidden: { x: "100%", opacity: 1 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
  exit: { x: "100%", opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
};

function ScoreRing({ score }: { score: number }) {
  const [offset, setOffset] = useState(251.2); // 2 * PI * 40

  useEffect(() => {
    // Animate dashoffset after mount
    setTimeout(() => {
      setOffset(251.2 - (251.2 * score) / 100);
    }, 100);
  }, [score]);

  return (
    <div className="relative w-[120px] h-[120px] mx-auto flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
          stroke="#16A34A"
          strokeWidth="8"
          strokeDasharray="251.2"
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-black text-[32px] leading-none text-[var(--text-color)]"
          style={{ fontFamily: "var(--font-impact)" }}
        >
          {score}
        </span>
        <span
          className="font-bold text-[11px] text-[var(--text-muted)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          /100
        </span>
      </div>
    </div>
  );
}

export function Reviews() {
  const [balance] = useState(125);
  const [activeTab, setActiveTab] = useState("SEMUA");
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [reviews, setReviews] = useState(DUMMY_REVIEWS);

  const selectedReview = reviews.find((r) => r.id === selectedReviewId);

  const stats = {
    SEMUA: reviews.length,
    MENUNGGU: reviews.filter((r) => r.status === "MENUNGGU").length,
    DITERIMA: reviews.filter((r) => r.status === "DITERIMA").length,
    SELESAI: reviews.filter((r) => r.status === "SELESAI").length,
    DITOLAK: reviews.filter((r) => r.status === "DITOLAK").length,
  };

  const filteredReviews =
    activeTab === "SEMUA" ? reviews : reviews.filter((r) => r.status === activeTab);

  const openDetail = (id: number) => {
    setSelectedReviewId(id);
    setIsPanelOpen(true);
  };

  const handleCancel = (id: number) => {
    if (window.confirm("Yakin batalkan request? Koin akan dikembalikan.")) {
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "DITOLAK", reason: "Dibatalkan oleh kamu." } : r,
        ),
      );
    }
  };

  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative pb-[100px] md:pb-[40px]">
        <motion.div
          className="p-[20px_16px] md:p-[32px_40px] max-w-[1000px] mx-auto relative z-10"
          variants={pageVariants as any}
          initial="hidden"
          animate="visible"
        >
          {/* HEADER */}
          <motion.div variants={sectionVariants as any} className="mb-[32px]">
            <div
              className="inline-flex px-3 py-1 bg-green-100 border-[2px] border-green-500 rounded-full shadow-[2px_2px_0px_#22c55e] font-black text-[9px] uppercase tracking-widest text-green-700 mb-[12px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              REVIEW SAYA
            </div>
            <div
              className="font-black text-[32px] md:text-[40px] text-[var(--text-color)] tracking-tighter mt-[4px] leading-tight uppercase"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              STATUS REVIEW
            </div>
            <div
              className="font-bold text-[14px] md:text-[15px] text-[var(--text-muted)] mt-[8px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Pantau status permintaan review dari profesional BNSP pilihanmu.
            </div>
          </motion.div>

          {/* STATS ROW */}
          <motion.div
            variants={sectionVariants as any}
            className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[32px]"
          >
            {[
              { label: "MENUNGGU", count: stats.MENUNGGU, color: "bg-yellow-400" },
              { label: "DITERIMA", count: stats.DITERIMA, color: "bg-blue-500" },
              { label: "SELESAI", count: stats.SELESAI, color: "bg-green-500" },
              { label: "DITOLAK", count: stats.DITOLAK, color: "bg-red-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] relative overflow-hidden flex flex-col items-center hover:-translate-y-1 transition-transform"
              >
                <div
                  className={`absolute left-0 top-[20%] w-[6px] h-[60%] rounded-r-[4px] ${stat.color} border-y-[2px] border-r-[2px] border-slate-900`}
                />
                <div
                  className="font-black text-[40px] text-[var(--text-color)] leading-none"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  {stat.count}
                </div>
                <div
                  className="font-bold text-[11px] uppercase tracking-widest text-[var(--text-muted)] mt-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* FILTER TABS */}
          <motion.div
            variants={sectionVariants as any}
            className="flex gap-[12px] overflow-x-auto pb-4 mb-[16px] no-scrollbar"
          >
            {["SEMUA", "MENUNGGU", "DITERIMA", "SELESAI", "DITOLAK"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 border-[2.5px] rounded-full px-[20px] py-[10px] font-black text-[11px] uppercase tracking-widest transition-all ${
                  activeTab === tab
                    ? "bg-slate-900 border-slate-900 text-white shadow-[3px_3px_0px_#64748B]"
                    : "bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-slate-900 hover:text-slate-900 hover:shadow-[3px_3px_0px_var(--shadow-color)] hover:-translate-y-0.5"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {tab} ({stats[tab as keyof typeof stats]})
              </button>
            ))}
          </motion.div>

          {/* LIST */}
          <motion.div variants={sectionVariants as any} className="flex flex-col gap-[20px]">
            <AnimatePresence mode="popLayout">
              {filteredReviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center p-[60px_20px] text-center border-[2.5px] border-dashed border-[var(--border-color)] rounded-[24px]"
                >
                  <div className="w-[80px] h-[80px] rounded-full bg-blue-50 flex items-center justify-center border-[2px] border-blue-200 mb-[24px]">
                    <Star className="w-[36px] h-[36px] text-blue-500" />
                  </div>
                  <div
                    className="font-black text-[24px] text-[var(--text-color)] uppercase"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    BELUM ADA REVIEW
                  </div>
                  <div
                    className="font-bold text-[14px] text-[var(--text-muted)] mt-[8px] max-w-[320px]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Mulai minta review dari profesional BNSP untuk memverifikasi kemampuanmu.
                  </div>
                  <button
                    onClick={() => (window.location.href = "/dashboard/professionals")}
                    className="mt-[24px] bg-blue-600 border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[12px] px-[24px] py-[12px] font-black text-[12px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    CARI PROFESIONAL
                  </button>
                </motion.div>
              ) : (
                filteredReviews.map((review) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    key={review.id}
                    onClick={() => openDetail(review.id)}
                    className="bg-[var(--card-bg)] border-[2.5px] border-slate-900 shadow-[4px_4px_0px_#0f172a] rounded-[24px] overflow-hidden cursor-pointer hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all flex flex-col group"
                  >
                    {/* Status Bar */}
                    <div
                      className={`w-full h-[6px] ${BAR_COLORS[review.status as keyof typeof BAR_COLORS]}`}
                    />

                    <div className="p-[20px_24px] flex flex-col md:flex-row md:items-start justify-between gap-[16px]">
                      {/* Left side */}
                      <div>
                        <div
                          className="font-bold text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-[6px]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          PROYEK
                        </div>
                        <div
                          className="font-black text-[20px] text-[var(--text-color)] uppercase leading-tight"
                          style={{ fontFamily: "var(--font-impact)" }}
                        >
                          {review.project}
                        </div>

                        <div className="flex items-center gap-[12px] mt-[16px] bg-[var(--bg-a)] p-[8px_12px] rounded-[12px] border-[2px] border-[var(--border-color)] inline-flex">
                          <div
                            className="w-[32px] h-[32px] rounded-[8px] border-[2px] border-slate-900 flex items-center justify-center font-black text-[14px] text-white"
                            style={{
                              background: review.gradient,
                              fontFamily: "var(--font-impact)",
                            }}
                          >
                            {review.reviewerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className="font-bold text-[10px] text-[var(--text-muted)]"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Direview oleh
                            </span>
                            <span
                              className="font-black text-[13px] text-slate-900"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {review.reviewerName}
                            </span>
                          </div>
                          <div
                            className="bg-blue-100 border-[2px] border-blue-500 rounded-md px-[6px] py-[2px] font-black text-[9px] text-blue-700 ml-2 shadow-[1px_1px_0px_#3b82f6]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            BNSP
                          </div>
                        </div>
                      </div>

                      {/* Right side status */}
                      <div className="flex flex-col md:items-end">
                        <div
                          className={`px-[12px] py-[6px] rounded-lg border-[2.5px] font-black text-[11px] uppercase tracking-widest shadow-[2px_2px_0px_currentColor] ${STATUS_COLORS[review.status as keyof typeof STATUS_COLORS]}`}
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {review.status}
                        </div>
                        <div
                          className="font-bold text-[12px] text-[var(--text-muted)] mt-[10px]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {review.date}
                        </div>
                      </div>
                    </div>

                    <div className="w-full border-t-[2.5px] border-dashed border-[var(--border-color)]" />

                    <div className="p-[20px_24px] flex flex-wrap md:flex-nowrap justify-between items-end gap-[16px] bg-slate-50">
                      {/* Coins */}
                      <div>
                        <div className="flex items-center gap-[6px]">
                          <Coins className="w-[18px] h-[18px] text-yellow-500" />
                          <span
                            className="font-black text-[24px] text-[var(--text-color)] leading-none"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {review.price}
                          </span>
                          <span
                            className="font-bold text-[12px] text-[var(--text-muted)] uppercase tracking-widest"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            koin
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      {review.score && (
                        <div className="flex flex-col items-center">
                          <span
                            className="font-black text-[11px] uppercase tracking-widest text-blue-600 mb-[4px]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            SKOR WAWANCARA
                          </span>
                          <div className="flex items-end gap-[2px]">
                            <span
                              className="font-black text-[28px] text-slate-900 leading-none"
                              style={{ fontFamily: "var(--font-impact)" }}
                            >
                              {review.score}
                            </span>
                            <span
                              className="font-bold text-[13px] text-[var(--text-muted)] pb-1"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              /100
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Button */}
                      <div>
                        {review.status === "MENUNGGU" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(review.id);
                            }}
                            className="border-[2.5px] border-red-500 bg-red-50 text-red-600 rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_#ef4444]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            BATALKAN
                          </button>
                        )}
                        {review.status === "DITERIMA" && (
                          <button
                            className="border-[2.5px] border-blue-600 bg-blue-50 text-blue-700 rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-[2px_2px_0px_#2563eb]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            LIHAT DETAIL →
                          </button>
                        )}
                        {review.status === "SELESAI" && (
                          <button
                            className="border-[2.5px] border-slate-900 bg-green-500 text-slate-900 rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest group-hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_#0f172a]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            LIHAT FEEDBACK →
                          </button>
                        )}
                        {review.status === "DITOLAK" && (
                          <button
                            className="border-[2.5px] border-[var(--border-color)] bg-white text-[var(--text-color)] rounded-[12px] px-[16px] py-[10px] font-black text-[11px] uppercase tracking-widest hover:border-slate-900 shadow-[2px_2px_0px_var(--shadow-color)]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            CARI LAIN →
                          </button>
                        )}
                      </div>
                    </div>

                    {review.status === "DITOLAK" && review.reason && (
                      <div className="p-[16px_24px] bg-red-100 border-t-[2.5px] border-red-200">
                        <span
                          className="font-bold text-[11px] text-red-500 uppercase tracking-widest mr-2"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Alasan:
                        </span>
                        <span
                          className="font-bold text-[13px] text-red-700 italic"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          "{review.reason}"
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* ========================================= */}
      {/* DETAIL SLIDE-OVER                         */}
      {/* ========================================= */}
      <AnimatePresence>
        {isPanelOpen && selectedReview && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPanelOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
            />

            {/* Slide-over Panel */}
            <motion.div
              variants={slideOverVariants as any}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 w-full md:w-[500px] h-screen bg-[var(--bg-a)] border-l-[3.5px] border-slate-900 shadow-[-12px_0_0_rgba(0,0,0,0.1)] z-50 overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-center p-[24px_32px] border-b-[3.5px] border-slate-900 bg-white sticky top-0 z-20">
                <div>
                  <div
                    className="font-black text-[24px] uppercase text-slate-900 leading-none"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    DETAIL REVIEW
                  </div>
                  <div
                    className={`mt-[12px] inline-block px-[12px] py-[4px] rounded-lg border-[2px] font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_currentColor] ${STATUS_COLORS[selectedReview.status as keyof typeof STATUS_COLORS]}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {selectedReview.status}
                  </div>
                </div>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="w-[36px] h-[36px] bg-white border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#0f172a] rounded-lg flex items-center justify-center hover:-translate-y-0.5 transition-transform"
                >
                  <X className="w-5 h-5 text-slate-900" />
                </button>
              </div>

              <div className="p-[32px] flex flex-col gap-[24px]">
                {/* General Info Card */}
                <div className="bg-white border-[3px] border-slate-900 rounded-[20px] p-[20px] shadow-[6px_6px_0px_#0f172a]">
                  <div className="flex flex-col gap-[12px]">
                    <div className="flex justify-between items-center pb-[12px] border-b-[2px] border-dashed border-slate-200">
                      <span
                        className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        PROYEK
                      </span>
                      <span
                        className="font-black text-[14px] text-slate-900 uppercase"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {selectedReview.project}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-[12px] border-b-[2px] border-dashed border-slate-200">
                      <span
                        className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        REVIEWER
                      </span>
                      <div className="flex items-center gap-[8px]">
                        <span
                          className="font-black text-[14px] text-slate-900"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {selectedReview.reviewerName}
                        </span>
                        <div
                          className="bg-blue-100 border-[2px] border-blue-500 rounded-md px-[6px] py-[2px] font-black text-[9px] text-blue-700 shadow-[1px_1px_0px_#3b82f6]"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          BNSP
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pb-[12px] border-b-[2px] border-dashed border-slate-200">
                      <span
                        className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        KOIN
                      </span>
                      <span
                        className="font-black text-[16px] text-yellow-600"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {selectedReview.price} koin
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className="font-bold text-[11px] text-[var(--text-muted)] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        TANGGAL
                      </span>
                      <span
                        className="font-black text-[13px] text-slate-700"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {selectedReview.date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conditional Content */}
                {selectedReview.status === "MENUNGGU" && (
                  <>
                    <div className="bg-yellow-100 border-[3px] border-yellow-500 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#eab308] text-center">
                      <Hourglass className="w-[40px] h-[40px] text-yellow-600 mx-auto mb-[12px]" />
                      <div
                        className="font-black text-[20px] text-yellow-900 uppercase"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        Menunggu Respons
                      </div>
                      <div
                        className="font-bold text-[13px] text-yellow-800 mt-[8px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Profesional biasanya merespons dalam 24 jam.
                      </div>

                      <div className="mt-[24px] flex flex-col gap-[16px] text-left relative pl-[8px]">
                        <div className="absolute left-[13px] top-[10px] bottom-[10px] w-[2px] bg-yellow-300" />
                        <div className="flex items-center gap-[16px] relative z-10">
                          <div className="w-[12px] h-[12px] rounded-full bg-green-500 border-[2px] border-slate-900" />
                          <div className="flex justify-between w-full">
                            <span
                              className="font-black text-[12px] text-slate-900 uppercase"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Request Terkirim
                            </span>
                            <span className="font-bold text-[11px] text-slate-600">
                              {selectedReview.date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-[16px] relative z-10">
                          <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-yellow-400" />
                          <div className="flex justify-between w-full">
                            <span
                              className="font-bold text-[12px] text-slate-500 uppercase"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Profesional Merespons
                            </span>
                            <span className="font-bold text-[11px] text-slate-400">
                              Menunggu...
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-[16px] relative z-10">
                          <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-yellow-400" />
                          <div className="flex justify-between w-full">
                            <span
                              className="font-bold text-[12px] text-slate-500 uppercase"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Review Selesai
                            </span>
                            <span className="font-bold text-[11px] text-slate-400">-</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleCancel(selectedReview.id);
                        setIsPanelOpen(false);
                      }}
                      className="w-full bg-red-100 border-[3px] border-red-500 rounded-[16px] p-[16px] font-black text-[14px] uppercase tracking-widest text-red-600 hover:bg-red-500 hover:text-white transition-colors shadow-[4px_4px_0px_#ef4444]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      BATALKAN REQUEST
                    </button>
                  </>
                )}

                {selectedReview.status === "DITERIMA" && (
                  <>
                    <div className="bg-blue-100 border-[3px] border-blue-500 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#3b82f6] text-center">
                      <CheckCircle2 className="w-[40px] h-[40px] text-blue-600 mx-auto mb-[12px]" />
                      <div
                        className="font-black text-[20px] text-blue-900 uppercase leading-none"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        Profesional Menerima Request
                      </div>
                      <div
                        className="font-bold text-[13px] text-blue-800 mt-[8px]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Review sedang dalam proses.
                      </div>

                      <div className="mt-[24px] flex flex-col gap-[16px] text-left relative pl-[8px]">
                        <div className="absolute left-[13px] top-[10px] bottom-[10px] w-[2px] bg-blue-300" />
                        <div className="flex items-center gap-[16px] relative z-10">
                          <div className="w-[12px] h-[12px] rounded-full bg-green-500 border-[2px] border-slate-900" />
                          <div className="flex justify-between w-full">
                            <span
                              className="font-black text-[12px] text-slate-900 uppercase"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Request Terkirim
                            </span>
                            <span className="font-bold text-[11px] text-slate-600">Selesai</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-[16px] relative z-10">
                          <div className="w-[12px] h-[12px] rounded-full bg-blue-500 border-[2px] border-slate-900" />
                          <div className="flex justify-between w-full">
                            <span
                              className="font-black text-[12px] text-slate-900 uppercase"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Profesional Menerima
                            </span>
                            <span className="font-bold text-[11px] text-blue-700">Hari ini</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-[16px] relative z-10">
                          <div className="w-[12px] h-[12px] rounded-full bg-white border-[2px] border-blue-300" />
                          <div className="flex justify-between w-full">
                            <span
                              className="font-bold text-[12px] text-slate-500 uppercase"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              Review Selesai
                            </span>
                            <span className="font-bold text-[11px] text-slate-400">
                              Dalam Proses
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border-[2.5px] border-slate-900 rounded-[16px] p-[16px] text-center shadow-[4px_4px_0px_#0f172a]">
                      <span
                        className="font-bold text-[13px] text-slate-700"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Kamu akan mendapat notifikasi ketika review selesai.
                      </span>
                    </div>
                  </>
                )}

                {selectedReview.status === "SELESAI" && (
                  <>
                    <div className="mb-[16px]">
                      <ScoreRing score={selectedReview.score || 0} />

                      <div className="mt-[32px] flex flex-col gap-[16px]">
                        {["KONTAK MATA", "KEPERCAYAAN DIRI", "KOMUNIKASI"].map((metric, i) => (
                          <div key={i}>
                            <div className="flex justify-between mb-[6px]">
                              <span
                                className="font-black text-[11px] text-slate-700 uppercase"
                                style={{ fontFamily: "var(--font-body)" }}
                              >
                                {metric}
                              </span>
                            </div>
                            <div className="w-full h-[12px] bg-white border-[2px] border-slate-900 rounded-full overflow-hidden shadow-[2px_2px_0px_#0f172a]">
                              <div
                                className="h-full bg-blue-500"
                                style={{ width: `${70 + Math.random() * 20}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="w-full border-t-[3px] border-dashed border-slate-300" />

                    <div>
                      <div
                        className="font-black text-[16px] uppercase text-slate-900 mb-[16px] inline-block bg-yellow-300 px-3 py-1 border-[2px] border-slate-900 shadow-[2px_2px_0px_#0f172a]"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        FEEDBACK PROFESIONAL
                      </div>

                      <div className="bg-white border-[3px] border-slate-900 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#0f172a]">
                        <div className="flex items-center gap-[12px] mb-[16px]">
                          <div
                            className="w-[40px] h-[40px] rounded-[10px] border-[2px] border-slate-900 flex items-center justify-center font-black text-[16px] text-white"
                            style={{
                              background: selectedReview.gradient,
                              fontFamily: "var(--font-impact)",
                            }}
                          >
                            {selectedReview.reviewerName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div
                              className="font-black text-[14px] text-slate-900"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {selectedReview.reviewerName}
                            </div>
                            <div
                              className="font-black text-[9px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded-sm inline-block border-[1px] border-blue-400 mt-1"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              BNSP VERIFIED
                            </div>
                          </div>
                        </div>

                        <div
                          className="font-bold text-[14px] text-slate-800 leading-relaxed"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          "{selectedReview.feedback}"
                        </div>

                        <div className="flex flex-wrap gap-[8px] mt-[20px]">
                          {selectedReview.verifiedSkills?.map((skill, idx) => (
                            <div
                              key={idx}
                              className="border-[2px] border-blue-500 text-blue-700 bg-blue-50 rounded-[8px] px-[10px] py-[6px] font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0px_#3b82f6]"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>

                        <div className="mt-[20px] pt-[20px] border-t-[2px] border-dashed border-slate-200">
                          <span
                            className="font-bold text-[12px] text-[var(--text-muted)] mr-[8px]"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            Rating kamu:
                          </span>
                          <div className="inline-flex gap-[4px] align-middle">
                            {[...Array(5)].map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-[16px] h-[16px] ${idx < (selectedReview.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="w-full bg-blue-600 border-[3px] border-slate-900 rounded-[16px] p-[16px] font-black text-[14px] uppercase tracking-widest text-white hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-[6px_6px_0px_#0f172a] flex items-center justify-center gap-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <Download className="w-5 h-5" /> UNDUH LAPORAN PDF
                    </button>
                  </>
                )}

                {selectedReview.status === "DITOLAK" && (
                  <>
                    <div className="bg-red-100 border-[3px] border-red-500 rounded-[20px] p-[24px] shadow-[6px_6px_0px_#ef4444] text-center">
                      <XCircle className="w-[48px] h-[48px] text-red-600 mx-auto mb-[12px]" />
                      <div
                        className="font-black text-[24px] text-red-900 uppercase leading-none"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        Request Ditolak
                      </div>
                      <div
                        className="font-bold text-[14px] text-red-700 mt-[12px] italic bg-red-50 border-[2px] border-red-300 p-[12px] rounded-xl"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        "{selectedReview.reason}"
                      </div>
                    </div>

                    <div className="bg-green-100 border-[2.5px] border-green-500 rounded-[16px] p-[16px] text-center shadow-[4px_4px_0px_#22c55e] flex items-center justify-center gap-[8px]">
                      <Coins className="w-[18px] h-[18px] text-green-700" />
                      <span
                        className="font-bold text-[13px] text-green-800"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Koin sebesar{" "}
                        <span className="font-black text-green-900">
                          {selectedReview.price} koin
                        </span>{" "}
                        telah dikembalikan.
                      </span>
                    </div>

                    <button
                      onClick={() => (window.location.href = "/dashboard/professionals")}
                      className="w-full bg-blue-600 border-[3px] border-slate-900 rounded-[16px] p-[16px] font-black text-[14px] uppercase tracking-widest text-white hover:-translate-y-1 transition-all shadow-[6px_6px_0px_#0f172a]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      CARI REVIEWER LAIN →
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
