// HALAMAN: C:\laragon\www\valid-react\src\pages\admin\AdminCoins.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DUMMY_TXNS = [
  {
    id: "#TXN-001",
    from: "Rizky",
    to: "Budi",
    amount: "-Rp 50.000",
    isPositive: false,
    type: "REVIEW PAYMENT",
    date: "25 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-002",
    from: "Rizky",
    to: "Platform",
    amount: "+Rp 5.000",
    isPositive: true,
    type: "PLATFORM FEE",
    date: "25 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-003",
    from: "System",
    to: "Rizky",
    amount: "+Rp 45.000",
    isPositive: true,
    type: "TOP UP",
    date: "24 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-004",
    from: "Rizky",
    to: "Ahmad",
    amount: "-Rp 60.000",
    isPositive: false,
    type: "REVIEW PAYMENT",
    date: "20 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-005",
    from: "Ahmad",
    to: "Rizky",
    amount: "+Rp 60.000",
    isPositive: true,
    type: "REFUND",
    date: "16 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-006",
    from: "System",
    to: "Dewi",
    amount: "+Rp 35.000",
    isPositive: true,
    type: "EARNING",
    date: "15 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-007",
    from: "System",
    to: "Maya",
    amount: "+Rp 85.000",
    isPositive: true,
    type: "TOP UP",
    date: "10 Mei",
    status: "SELESAI",
  },
  {
    id: "#TXN-008",
    from: "Maya",
    to: "Siti",
    amount: "-Rp 40.000",
    isPositive: false,
    type: "REVIEW PAYMENT",
    date: "8 Mei",
    status: "SELESAI",
  },
];

const volumeData = Array.from({ length: 14 }).map((_, i) => ({
  date: `${i + 12} Mei`,
  topup: Math.floor(Math.random() * 500) + 100,
  payment: Math.floor(Math.random() * 400) + 50,
}));

const typeData = [
  { name: "Top Up", value: 45, color: "#3b82f6" },
  { name: "Review Payment", value: 40, color: "#facc15" },
  { name: "Platform Fee", value: 10, color: "#22c55e" },
  { name: "Refund", value: 5, color: "#f97316" },
];

export function AdminCoins() {
  const [data, setData] = useState(DUMMY_TXNS);

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20">
      <AdminPageHeader
        title="COIN LEDGER"
        subtitle="ADMIN"
        rightContent={
          <button
            className="px-[16px] py-[10px] rounded-[12px] border-[2.5px] border-[var(--border-color)] bg-[var(--bg-a)] text-[var(--text-color)] text-[13px] font-black uppercase flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all"
            style={{ fontFamily: "var(--font-body)" }}
          >
            25 Apr — 25 Mei 2026
            <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        }
      />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[40px]">
        {[
          { label: "TOTAL PENDAPATAN", value: "Rp 12,4jt", bg: "bg-blue-400" },
          { label: "TOTAL KOIN BEREDAR", value: "8.240", bg: "bg-yellow-300" },
          { label: "TRANSAKSI BULAN INI", value: "1.247", bg: "bg-green-400" },
          { label: "FEE BULAN INI", value: "Rp 248rb", bg: "bg-purple-300" },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${card.bg} border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[24px] p-[24px_28px] hover:-translate-y-1 transition-transform`}
          >
            <div
              className="text-slate-900 text-[32px] md:text-[40px] font-black leading-none mb-[12px]"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              {card.value}
            </div>
            <div
              className="text-slate-900 text-[12px] font-black uppercase tracking-widest leading-snug"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="flex flex-col lg:flex-row gap-[24px] mb-[40px]">
        {/* Bar Chart */}
        <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[24px] p-[24px_32px] flex-[6]">
          <h2
            className="text-[var(--text-color)] text-[18px] font-black mb-[24px] uppercase"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            VOLUME TRANSAKSI
          </h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                  strokeOpacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                    fontWeight: "bold",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                    fontWeight: "bold",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `Rp${val}k`}
                />
                <RechartsTooltip
                  cursor={{ fill: "var(--border-color)", opacity: 0.1 }}
                  contentStyle={{
                    background: "var(--card-bg)",
                    border: "3px solid var(--border-color)",
                    borderRadius: "16px",
                    fontFamily: "var(--font-body)",
                    boxShadow: "4px 4px 0px var(--shadow-color)",
                  }}
                  itemStyle={{ color: "var(--text-color)", fontWeight: 900 }}
                />
                <Bar
                  dataKey="topup"
                  name="Top Up"
                  stackId="a"
                  fill="#3b82f6"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="payment"
                  name="Payment"
                  stackId="a"
                  fill="#facc15"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[24px] p-[24px_32px] flex-[4] flex flex-col">
          <h2
            className="text-[var(--text-color)] text-[18px] font-black mb-[16px] uppercase"
            style={{ fontFamily: "var(--font-impact)" }}
          >
            TIPE TRANSAKSI
          </h2>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="var(--border-color)"
                  strokeWidth={3}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card-bg)",
                    border: "3px solid var(--border-color)",
                    borderRadius: "16px",
                    fontFamily: "var(--font-body)",
                    boxShadow: "4px 4px 0px var(--shadow-color)",
                  }}
                  itemStyle={{ color: "var(--text-color)", fontWeight: 900 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-y-3 gap-x-4 pt-4">
            {typeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-[12px] h-[12px] rounded-full border-[2px] border-[var(--border-color)] shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  className="text-[var(--text-color)] text-[12px] font-black uppercase truncate"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.name}
                </span>
                <span
                  className="text-[var(--text-muted)] text-[12px] font-black ml-auto"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="flex flex-col md:flex-row gap-[16px] mb-[24px] items-center justify-between">
        <div className="flex gap-[12px] overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {["Tipe: Semua", "Top Up", "Payment", "Earning", "Refund"].map((filter, i) => (
            <button
              key={filter}
              className={`px-[20px] py-[10px] rounded-full text-[12px] font-black tracking-wider uppercase transition-all shrink-0 border-[2.5px] ${
                i === 0
                  ? "bg-blue-500 text-white border-blue-600 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  : "bg-[var(--card-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Cari user..."
            className="w-full pl-[44px] pr-[16px] py-[12px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] text-[14px] font-bold text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:shadow-[4px_4px_0px_#3b82f6] transition-all placeholder:font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
      </div>

      <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[24px] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-a)] border-b-[3px] border-[var(--border-color)]">
              {["ID", "DARI", "KE", "JUMLAH", "TIPE", "TANGGAL", "STATUS"].map((col) => (
                <th
                  key={col}
                  className="p-[16px_24px] text-[13px] font-black text-[var(--text-color)] uppercase tracking-[0.1em]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-b-[2.5px] border-[var(--border-color)] hover:bg-[var(--bg-a)] transition-colors last:border-b-0"
              >
                <td className="p-[16px_24px] text-[13px] font-black text-[var(--text-muted)]">
                  {item.id}
                </td>
                <td className="p-[16px_24px]">
                  <div className="flex items-center gap-[12px]">
                    <div
                      className="w-[32px] h-[32px] rounded-[8px] border-[2px] border-slate-900 bg-purple-300 text-slate-900 flex items-center justify-center text-[14px] font-black uppercase shrink-0 shadow-[2px_2px_0px_#0f172a]"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {item.from[0]}
                    </div>
                    <span
                      className="text-[var(--text-color)] text-[14px] font-black uppercase"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.from}
                    </span>
                  </div>
                </td>
                <td className="p-[16px_24px]">
                  <div className="flex items-center gap-[12px]">
                    <div
                      className="w-[32px] h-[32px] rounded-[8px] border-[2px] border-slate-900 bg-blue-300 text-slate-900 flex items-center justify-center text-[14px] font-black uppercase shrink-0 shadow-[2px_2px_0px_#0f172a]"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {item.to[0]}
                    </div>
                    <span
                      className="text-[var(--text-color)] text-[14px] font-black uppercase"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.to}
                    </span>
                  </div>
                </td>
                <td className="p-[16px_24px]">
                  <span
                    className={`text-[16px] font-black tracking-wide ${item.isPositive ? "text-green-500" : "text-red-500"}`}
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    {item.amount}
                  </span>
                </td>
                <td className="p-[16px_24px]">
                  <span
                    className={`px-[12px] py-[6px] rounded-md border-[2px] border-slate-900 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_#0f172a] ${
                      item.type === "TOP UP"
                        ? "bg-blue-200 text-blue-900"
                        : item.type === "REVIEW PAYMENT"
                          ? "bg-yellow-300 text-yellow-900"
                          : item.type === "PLATFORM FEE"
                            ? "bg-purple-200 text-purple-900"
                            : item.type === "EARNING"
                              ? "bg-green-300 text-green-900"
                              : "bg-orange-300 text-orange-900"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.type}
                  </span>
                </td>
                <td
                  className="p-[16px_24px] text-[var(--text-muted)] text-[13px] font-bold uppercase"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.date}
                </td>
                <td className="p-[16px_24px]">
                  <span
                    className={`px-[14px] py-[6px] rounded-full border-[2.5px] text-[11px] font-black uppercase tracking-widest ${
                      item.status === "SELESAI"
                        ? "border-green-500 bg-green-100 text-green-700"
                        : item.status === "PENDING"
                          ? "border-yellow-500 bg-yellow-100 text-yellow-700"
                          : "border-red-500 bg-red-100 text-red-700"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-[20px_24px] flex justify-between items-center bg-[var(--bg-a)] border-t-[3px] border-[var(--border-color)]">
          <span
            className="text-[var(--text-muted)] text-[13px] font-bold uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            1-8 DARI 1.247
          </span>
          <div className="flex items-center gap-[8px]">
            <button className="p-[6px] text-[var(--text-muted)] hover:text-[var(--text-color)]">
              <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
            </button>
            <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-slate-900 bg-blue-500 text-white text-[14px] font-black flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">
              1
            </button>
            <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-[14px] font-black flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--border-color)] transition-all">
              2
            </button>
            <button className="p-[6px] text-[var(--text-muted)] hover:text-[var(--text-color)]">
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
