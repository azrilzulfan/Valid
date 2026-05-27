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
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const PAST_REVIEWS = [
  {
    id: 3,
    name: "Fajar Nugraha",
    role: "Drafter AutoCAD",
    dateCompleted: "23 Mei 2026",
    aiScore: 85,
    proScore: 90,
    comment:
      "Kandidat sangat paham membaca gambar teknik. Perlu ditingkatkan dalam komunikasi presentasi.",
  },
  {
    id: 9,
    name: "Rina Melati",
    role: "UI/UX Designer",
    dateCompleted: "15 Mei 2026",
    aiScore: 78,
    proScore: 85,
    comment: "Portofolio sangat rapi, proses desain dijelaskan dengan baik.",
  },
  {
    id: 10,
    name: "Hendro Wibowo",
    role: "Teknisi Mesin",
    dateCompleted: "10 Mei 2026",
    aiScore: 92,
    proScore: 88,
    comment: "Pemahaman teori bagus, tapi praktiknya masih perlu pembuktian.",
  },
];

export function ProHistory() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex w-full h-screen bg-[#F0F4F8] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--card-bg)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-slate-900 flex md:flex-col z-50 md:z-auto transition-all shrink-0">
        {/* TOP: Logo */}
        <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[3px] border-slate-900 bg-yellow-300 items-center justify-between">
          <img
            src="/logo.png"
            alt="VALID Logo"
            className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform"
          />
          <div className="w-[10px] h-[10px] bg-green-500 rounded-full border-[2px] border-slate-900"></div>
        </div>

        {/* USER INFO */}
        <div className="hidden md:flex items-center gap-3 py-[20px] px-[24px] border-b-[3px] border-slate-900 bg-[var(--bg-a)]">
          <div className="w-[44px] h-[44px] rounded-[14px] border-[2.5px] border-slate-900 bg-purple-200 flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
            <span
              className="font-black text-[20px] text-purple-700"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              I
            </span>
          </div>
          <div className="flex flex-col">
            <span
              className="font-black text-[15px] text-[var(--text-color)] leading-tight tracking-wide"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Ibrahim H.
            </span>
            <span
              className="font-bold text-[9px] uppercase tracking-widest text-slate-500 mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Reviewer Ahli
            </span>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 flex md:flex-col flex-row w-full justify-around md:justify-start md:px-[16px] md:py-[24px] gap-0 md:gap-[10px] items-center md:items-stretch h-full overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Beranda Pro", path: "/pro/dashboard" },
            { icon: Compass, label: "Jelajah Kandidat", path: "/pro/explore" },
            { icon: MessageSquare, label: "Permintaan Review", path: "/pro/requests" },
            { icon: Coins, label: "Penghasilan", path: "/pro/earnings" },
            { icon: FolderOpen, label: "Riwayat", active: true, path: "/pro/history" },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => item.path && navigate({ to: item.path })}
              className={`group flex md:flex-row flex-col items-center gap-1 md:gap-[14px] px-3 md:px-[18px] py-2 md:py-[12px] rounded-[1rem] cursor-pointer transition-all duration-300 relative ${
                item.active
                  ? "md:bg-slate-900 text-slate-900 md:text-white md:border-[2.5px] md:border-slate-900 md:shadow-[4px_4px_0px_#FBBF24] md:-translate-y-0.5"
                  : "text-slate-500 hover:text-slate-900 md:border-[2.5px] md:border-transparent md:hover:border-slate-900 md:hover:shadow-[4px_4px_0px_#0f172a] md:hover:-translate-y-0.5 md:hover:bg-white"
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

        {/* BOTTOM: Logout */}
        <div className="hidden md:flex flex-col p-[24px] border-t-[3px] border-slate-900 bg-[var(--bg-a)]">
          <div
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center gap-2 cursor-pointer group px-3 py-3 border-[2.5px] border-transparent hover:border-slate-900 rounded-xl transition-all hover:bg-white hover:shadow-[4px_4px_0px_#0f172a]"
          >
            <LogOut className="w-[18px] h-[18px] text-slate-500 group-hover:text-red-500 transition-colors" />
            <span
              className="font-black text-[12px] uppercase tracking-widest text-slate-500 group-hover:text-red-500 transition-colors"
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
            backgroundImage: "radial-gradient(#0f172a 2px, transparent 2px)",
            backgroundSize: "30px 30px",
          }}
        />

        <motion.div
          className="p-[20px_16px] md:p-[40px_48px] max-w-[1200px] mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.08 }}
        >
          {/* HEADER */}
          <motion.div
            variants={sectionVariants}
            className="mb-[40px] flex flex-col lg:flex-row justify-between items-start lg:items-end gap-[24px]"
          >
            <div>
              <div
                className="inline-flex px-3 py-1 bg-purple-100 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 mb-[16px] shadow-[2px_2px_0px_#0f172a]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                ARSIP ULASAN
              </div>
              <h1
                className="font-black text-[36px] md:text-[52px] text-slate-900 leading-[0.9] tracking-tighter uppercase mb-2"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                RIWAYAT REVIEW.
              </h1>
              <p
                className="font-bold text-[14px] md:text-[16px] text-slate-600 max-w-[600px] leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Daftar semua kandidat yang sudah kamu ulas. Kamu bisa melihat kembali skor yang
                diberikan.
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
                placeholder="Cari nama kandidat..."
                className="w-full bg-white border-[3px] border-slate-900 rounded-[1rem] py-[12px] pl-[48px] pr-[16px] font-bold text-[13px] text-slate-900 focus:outline-none focus:shadow-[4px_4px_0px_#0f172a] transition-all"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>
          </motion.div>

          {/* LIST */}
          <motion.div variants={sectionVariants} className="grid grid-cols-1 gap-[24px]">
            {PAST_REVIEWS.filter((req) =>
              req.name.toLowerCase().includes(search.toLowerCase()),
            ).map((req) => (
              <div
                key={req.id}
                className="bg-white border-[3px] border-slate-900 rounded-[1.5rem] p-[24px] shadow-[6px_6px_0px_#0f172a] hover:shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 transition-all flex flex-col md:flex-row gap-6"
              >
                {/* Profile Section */}
                <div className="flex flex-col gap-4 min-w-[200px]">
                  <div className="flex items-center gap-4">
                    <div className="w-[56px] h-[56px] rounded-[16px] border-[3px] border-slate-900 bg-yellow-100 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#0f172a]">
                      <span
                        className="font-black text-[24px] text-yellow-600"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {req.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="font-black text-[18px] text-slate-900 uppercase tracking-tight leading-none mb-1"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {req.name}
                      </h3>
                      <div
                        className="font-bold text-[11px] text-slate-500 tracking-widest flex items-center gap-1 uppercase"
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
                      Selesai
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
                <div className="flex-1 flex flex-col md:flex-row gap-4 border-t-[2.5px] border-dashed border-slate-200 pt-4 md:pt-0 md:border-t-0 md:border-l-[2.5px] md:pl-6">
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex flex-col items-center">
                      <span
                        className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Skor AI
                      </span>
                      <div
                        className="w-[48px] h-[48px] rounded-full border-[2.5px] border-slate-200 flex items-center justify-center font-black text-[16px] text-slate-400"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {req.aiScore}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span
                        className="font-bold text-[10px] text-blue-500 uppercase tracking-widest mb-1"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        Skor Kamu
                      </span>
                      <div
                        className="w-[48px] h-[48px] rounded-full border-[2.5px] border-blue-500 flex items-center justify-center font-black text-[18px] text-blue-600 bg-blue-50"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {req.proScore}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <span
                      className="font-bold text-[10px] text-slate-400 uppercase tracking-widest mb-2 block"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Komentar Kamu
                    </span>
                    <p
                      className="font-bold text-[13px] text-slate-700 italic leading-relaxed"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      "{req.comment}"
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    <button
                      onClick={() => navigate({ to: `/pro/review/${req.id}` })}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl px-[16px] py-[12px] font-black text-[11px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[3px_3px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full md:w-auto"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <Eye className="w-4 h-4" /> Lihat Detail
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
