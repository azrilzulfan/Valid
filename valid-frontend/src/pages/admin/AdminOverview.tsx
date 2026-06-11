// src/pages/admin/AdminOverview.tsx
import { motion } from "framer-motion";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Users, ShieldCheck, Briefcase, CreditCard } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useEffect, useState } from "react";
import { dashboardApi, verifierApi } from "../../lib/api";

const registrationData = [
  { date: "1 Mei", count: 42 },
  { date: "5 Mei", count: 55 },
  { date: "10 Mei", count: 68 },
  { date: "15 Mei", count: 60 },
  { date: "20 Mei", count: 95 },
  { date: "25 Mei", count: 112 },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [pendingVerifiers, setPendingVerifiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, pendRes] = await Promise.all([
          dashboardApi.getStats(),
          verifierApi.getPendingApplications().catch(() => ({ applications: [] })),
        ]);
        setStats(statsRes.stats || statsRes);
        setPendingVerifiers(pendRes.applications || []);
      } catch (err) {
        console.error("Gagal mengambil data dashboard admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalCandidates = stats?.totalCandidates || 0;
  const completedInterviews = stats?.completedInterviews || 0;
  const approvedPortfolios = stats?.approvedPortfolios || 0;
  const badgesIssued = stats?.badgesIssued || 0;
  const pendingCount = pendingVerifiers.length;

  const roleData = [
    { name: "Kandidat", value: Math.max(totalCandidates - pendingCount, 0), color: "#2563EB" },
    { name: "Verifikator", value: pendingCount, color: "#FBBF24" },
    { name: "Admin", value: 1, color: "#8B5CF6" },
  ];

  return (
    <motion.div
      className="w-full max-w-[1400px] mx-auto pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AdminPageHeader
        title="OVERVIEW"
        subtitle="ADMIN"
        rightContent={
          <div
            className="px-[16px] py-[8px] rounded-full border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] shadow-[4px_4px_0px_var(--shadow-color)] text-[var(--text-color)] text-[13px] font-bold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {new Date()
              .toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
              .toUpperCase()}
          </div>
        }
      />

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[40px]">
        <motion.div
          variants={itemVariants}
          className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[24px] p-[24px_28px] relative overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
        >
          <Users className="absolute -bottom-[12px] -right-[12px] w-[80px] h-[80px] text-[var(--text-color)] opacity-[0.05] group-hover:scale-110 transition-transform" />
          <div
            className="text-[var(--text-muted)] text-[12px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            TOTAL KANDIDAT
          </div>
          <div
            className="text-[var(--text-color)] text-[48px] font-black leading-none mt-[8px]"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            {loading ? "-" : totalCandidates.toLocaleString()}
          </div>
          <div
            className="mt-[12px] self-start px-[12px] py-[4px] rounded-full border-[2.5px] border-green-500 bg-green-100 text-green-700 text-[11px] font-black uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Terdaftar
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-yellow-300 border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[24px] p-[24px_28px] relative overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
        >
          <ShieldCheck className="absolute -bottom-[12px] -right-[12px] w-[80px] h-[80px] text-slate-900 opacity-[0.1] group-hover:scale-110 transition-transform" />
          <div
            className="text-slate-700 text-[12px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            PENDING VERIFIKATOR
          </div>
          <div
            className="text-slate-900 text-[48px] font-black leading-none mt-[8px]"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            {loading ? "-" : pendingCount}
          </div>
          <div
            className="mt-[12px] self-start px-[12px] py-[4px] rounded-full border-[2.5px] border-slate-900 bg-white text-slate-900 text-[11px] font-black uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {pendingCount > 0 ? "Perlu ditinjau" : "Semua beres"}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[24px] p-[24px_28px] relative overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
        >
          <Briefcase className="absolute -bottom-[12px] -right-[12px] w-[80px] h-[80px] text-[var(--text-color)] opacity-[0.05] group-hover:scale-110 transition-transform" />
          <div
            className="text-[var(--text-muted)] text-[12px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            PORTFOLIO DISETUJUI
          </div>
          <div
            className="text-[var(--text-color)] text-[48px] font-black leading-none mt-[8px]"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            {loading ? "-" : approvedPortfolios}
          </div>
          <div
            className="mt-[12px] self-start px-[12px] py-[4px] rounded-full border-[2.5px] border-green-500 bg-green-100 text-green-700 text-[11px] font-black uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Terverifikasi
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-purple-200 border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[24px] p-[24px_28px] relative overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
        >
          <CreditCard className="absolute -bottom-[12px] -right-[12px] w-[80px] h-[80px] text-purple-900 opacity-[0.1] group-hover:scale-110 transition-transform" />
          <div
            className="text-purple-700 text-[12px] font-bold uppercase tracking-[0.1em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            BADGE DITERBITKAN
          </div>
          <div
            className="text-purple-900 text-[48px] font-black leading-none mt-[8px]"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            {loading ? "-" : badgesIssued}
          </div>
          <div
            className="mt-[12px] self-start px-[12px] py-[4px] rounded-full border-[2.5px] border-purple-900 bg-white text-purple-900 text-[11px] font-black uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Total
          </div>
        </motion.div>
      </div>

      {/* CHARTS ROW */}
      <div className="flex flex-col lg:flex-row gap-[24px] mb-[28px]">
        <motion.div
          variants={itemVariants}
          className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[32px] p-[28px] flex-1 min-h-[380px]"
        >
          <h3
            className="text-[16px] font-black text-[var(--text-color)] mb-[24px] uppercase tracking-wider"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Tren Registrasi Pengguna
          </h3>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={registrationData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="var(--text-muted)"
                  tick={{ fontSize: 11, fontWeight: "bold" }}
                />
                <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11, fontWeight: "bold" }} />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#regGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[32px] p-[28px] lg:w-[400px] flex flex-col justify-between"
        >
          <div>
            <h3
              className="text-[16px] font-black text-[var(--text-color)] mb-[24px] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Komposisi Peran Pengguna
            </h3>
            <div className="w-full h-[180px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="var(--card-bg)"
                        strokeWidth={3}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span
                  className="block text-[28px] font-black text-[var(--text-color)] leading-none"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  {loading ? "-" : (totalCandidates + 1).toLocaleString()}
                </span>
                <span
                  className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Total User
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[10px] mt-[20px]">
            {roleData.map((role, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-[10px_14px] bg-[var(--bg-a)] rounded-[14px] border-[2px] border-[var(--border-color)]"
              >
                <div className="flex items-center gap-[8px]">
                  <div
                    className="w-[12px] h-[12px] rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span
                    className="text-[12px] font-bold text-[var(--text-color)] uppercase"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {role.name}
                  </span>
                </div>
                <span
                  className="text-[13px] font-black text-[var(--text-color)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {loading ? "-" : role.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM ROW: PENDING VERIFIERS */}
      <div className="grid grid-cols-1 gap-[24px]">
        <motion.div
          variants={itemVariants}
          className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[32px] p-[28px]"
        >
          <div className="flex justify-between items-center mb-[24px]">
            <h3
              className="text-[16px] font-black text-[var(--text-color)] uppercase tracking-wider"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Pendaftaran Verifikator Terbaru
            </h3>
            <span
              className="px-[12px] py-[4px] rounded-full border-[2.5px] border-slate-900 bg-yellow-300 text-slate-900 text-[11px] font-black uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {loading ? "-" : `${pendingCount} Menunggu`}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-10 font-bold text-[var(--text-muted)]">
              Memuat pendaftar...
            </div>
          ) : pendingVerifiers.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-muted)] border-[2.5px] border-dashed border-[var(--border-color)] rounded-[20px] font-bold bg-[var(--bg-a)]">
              Tidak ada pendaftaran verifikator yang tertunda saat ini.
            </div>
          ) : (
            <div className="flex flex-col gap-[14px]">
              {pendingVerifiers.slice(0, 3).map((app: any) => (
                <div
                  key={app.uid}
                  className="flex items-center justify-between p-[16px_20px] bg-white border-[2.5px] border-slate-900 rounded-[20px] shadow-[4px_4px_0px_#0f172a]"
                >
                  <div className="flex flex-col">
                    <span
                      className="text-slate-900 text-[14px] font-black uppercase leading-tight"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {app.fullName}
                    </span>
                    <span
                      className="text-slate-600 text-[11px] font-bold uppercase"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {app.currentJob} @ {app.institution}
                    </span>
                    <span className="text-blue-600 text-[10px] font-black mt-0.5">
                      {app.vocationFields?.join(", ").toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => (window.location.href = "/admin/verify")}
                    className="px-3 py-1.5 border-[2px] border-slate-900 bg-yellow-300 text-slate-900 rounded-[8px] text-[10px] font-black uppercase shadow-[2px_2px_0px_#0f172a] hover:bg-yellow-400 transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    TINJAU
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => (window.location.href = "/admin/verify")}
            className="w-full mt-[20px] py-[12px] rounded-[14px] border-[3px] border-[var(--border-color)] bg-white text-slate-900 text-[13px] font-black uppercase shadow-[4px_4px_0px_var(--border-color)] hover:-translate-y-1 transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          >
            LIHAT SEMUA PENDAFTARAN
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
