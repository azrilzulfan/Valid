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
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const TRANSACTIONS = [
  { id: 1, type: "income", title: "Review Budi Santoso", date: "25 Mei 2026, 14:30", amount: 150 },
  { id: 2, type: "income", title: "Review Ayu Lestari", date: "24 Mei 2026, 09:15", amount: 150 },
  {
    id: 3,
    type: "withdraw",
    title: "Penarikan ke Rekening BCA",
    date: "22 Mei 2026, 11:00",
    amount: 1000,
  },
  { id: 4, type: "income", title: "Review Fajar Nugraha", date: "20 Mei 2026, 16:45", amount: 150 },
  { id: 5, type: "income", title: "Bonus Review Tercepat", date: "20 Mei 2026, 16:45", amount: 50 },
];

export function ProEarnings() {
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
            { icon: Coins, label: "Penghasilan", active: true, path: "/pro/earnings" },
            { icon: FolderOpen, label: "Riwayat", path: "/pro/history" },
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
          <motion.div variants={sectionVariants} className="mb-[40px]">
            <div
              className="inline-flex px-3 py-1 bg-green-100 border-[2.5px] border-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest text-slate-900 mb-[16px] shadow-[2px_2px_0px_#0f172a]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              KAS & SALDO
            </div>
            <h1
              className="font-black text-[36px] md:text-[52px] text-slate-900 leading-[0.9] tracking-tighter uppercase mb-2"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              PENGHASILAN PRO.
            </h1>
            <p
              className="font-bold text-[14px] md:text-[16px] text-slate-600 max-w-[600px] leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Kelola pendapatan koin kamu dari mereview kandidat dan cairkan langsung ke rekening
              bank.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[32px]">
            {/* SALDO CARD & CHART (Left) */}
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
                      1200
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
                    ≈ Rp 120.000
                  </div>

                  <button
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-[1rem] py-[16px] font-black text-[13px] uppercase tracking-widest border-[3px] border-slate-900 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <CreditCard className="w-5 h-5" /> Tarik Saldo
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={sectionVariants}
                className="bg-white border-[3px] border-slate-900 rounded-[1.5rem] p-[24px] shadow-[6px_6px_0px_#0f172a]"
              >
                <div
                  className="font-bold text-[12px] text-slate-500 uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Pendapatan 7 Hari Terakhir
                </div>
                <div
                  className="font-black text-[32px] text-slate-900 tracking-tighter mb-6"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  +320 KOIN
                </div>

                {/* Custom CSS Bar Chart */}
                <div className="h-[180px] flex items-end justify-between gap-2 border-b-[2.5px] border-slate-900 pb-2 relative">
                  {/* Grid Lines */}
                  <div className="absolute top-0 w-full border-t-[2px] border-dashed border-slate-200" />
                  <div className="absolute top-1/2 w-full border-t-[2px] border-dashed border-slate-200" />

                  {/* Bars */}
                  {[
                    { day: "Sen", h: "30%" },
                    { day: "Sel", h: "45%" },
                    { day: "Rab", h: "25%" },
                    { day: "Kam", h: "60%" },
                    { day: "Jum", h: "85%" },
                    { day: "Sab", h: "50%" },
                    { day: "Min", h: "70%" },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1 z-10 group">
                      <div
                        className={`w-full max-w-[24px] border-[2.5px] border-slate-900 rounded-t-sm shadow-[2px_0px_0px_#0f172a] transition-all duration-500 group-hover:brightness-110 ${i === 6 ? "bg-yellow-400" : "bg-blue-600"}`}
                        style={{ height: bar.h }}
                      />
                    </div>
                  ))}
                </div>

                {/* X Axis Labels */}
                <div className="flex justify-between mt-2 px-1">
                  {["S", "S", "R", "K", "J", "S", "M"].map((day, i) => (
                    <span
                      key={i}
                      className={`font-black text-[10px] w-[24px] text-center uppercase tracking-widest ${i === 6 ? "text-slate-900" : "text-slate-400"}`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* TRANSACTIONS LIST (Right) */}
            <motion.div variants={sectionVariants} className="lg:col-span-2">
              <h2
                className="font-black text-[24px] md:text-[28px] text-slate-900 uppercase tracking-tight mb-[20px]"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                RIWAYAT TRANSAKSI
              </h2>

              <div className="bg-white border-[3px] border-slate-900 rounded-[1.5rem] shadow-[6px_6px_0px_#0f172a] overflow-hidden">
                <div className="divide-y-[3px] divide-slate-900">
                  {TRANSACTIONS.map((trx) => (
                    <div
                      key={trx.id}
                      className="p-[20px] md:p-[24px] flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
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
                            className="font-black text-[16px] text-slate-900 uppercase tracking-tight mb-1"
                            style={{ fontFamily: "var(--font-impact)" }}
                          >
                            {trx.title}
                          </div>
                          <div
                            className="font-bold text-[11px] text-slate-500 uppercase tracking-widest"
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
                        <span className="text-[12px] text-slate-500 uppercase">Koin</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t-[3px] border-slate-900 bg-slate-50 text-center">
                  <button
                    className="font-black text-[11px] text-blue-600 uppercase tracking-widest hover:underline flex items-center justify-center w-full gap-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Muat Lebih Banyak <ChevronRight className="w-4 h-4" />
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
