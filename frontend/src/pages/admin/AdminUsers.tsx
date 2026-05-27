import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { useAdminToast } from "../../components/admin/AdminToast";
import {
  Search,
  ChevronDown,
  Eye,
  UserX,
  UserCheck,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const DUMMY_USERS = [
  {
    id: 1,
    name: "Rizky Pratama",
    email: "rizky@email.com",
    role: "Pencari Kerja",
    status: "Aktif",
    joinDate: "1 Jan 2026",
    activity: "2 jam lalu",
  },
  {
    id: 2,
    name: "Budi Santoso",
    email: "budi@email.com",
    role: "Profesional",
    verified: true,
    status: "Aktif",
    joinDate: "15 Des 2025",
    activity: "1 hari lalu",
  },
  {
    id: 3,
    name: "Siti Rahayu",
    email: "siti@email.com",
    role: "Profesional",
    verified: false,
    status: "Aktif",
    joinDate: "20 Nov 2025",
    activity: "3 hari lalu",
  },
  {
    id: 4,
    name: "Ahmad Fauzi",
    email: "ahmad@email.com",
    role: "Pencari Kerja",
    status: "Aktif",
    joinDate: "5 Feb 2026",
    activity: "5 jam lalu",
  },
  {
    id: 5,
    name: "Dewi Lestari",
    email: "dewi@email.com",
    role: "Profesional",
    verified: true,
    status: "Aktif",
    joinDate: "8 Okt 2025",
    activity: "2 hari lalu",
  },
  {
    id: 6,
    name: "Andi Wijaya",
    email: "andi@email.com",
    role: "Pencari Kerja",
    status: "Suspended",
    joinDate: "12 Mar 2026",
    activity: "14 hari lalu",
  },
  {
    id: 7,
    name: "Maya Sari",
    email: "maya@email.com",
    role: "Pencari Kerja",
    status: "Aktif",
    joinDate: "3 Apr 2026",
    activity: "30 mnt lalu",
  },
  {
    id: 8,
    name: "Rudi Hartono",
    email: "rudi@email.com",
    role: "Admin",
    status: "Aktif",
    joinDate: "1 Jan 2025",
    activity: "1 jam lalu",
  },
];

export function AdminUsers() {
  const { addToast } = useAdminToast();
  const [data, setData] = useState(DUMMY_USERS);
  const [activeTab, setActiveTab] = useState("SEMUA");

  const [suspendModal, setSuspendModal] = useState<number | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const [detailPanel, setDetailPanel] = useState<number | null>(null);

  const handleSuspend = (id: number) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Suspended" } : item)),
    );
    const user = data.find((u) => u.id === id);
    setSuspendModal(null);
    setSuspendReason("");
    addToast({ type: "warning", message: `${user?.name} berhasil disuspend.` });
  };

  const handleUnsuspend = (id: number) => {
    setData((prev) => prev.map((item) => (item.id === id ? { ...item, status: "Aktif" } : item)));
    const user = data.find((u) => u.id === id);
    addToast({ type: "success", message: `${user?.name} kembali aktif.` });
  };

  const filteredData = data.filter((item) => {
    if (activeTab === "PENCARI KERJA") return item.role === "Pencari Kerja";
    if (activeTab === "PROFESIONAL") return item.role === "Profesional";
    if (activeTab === "ADMIN") return item.role === "Admin";
    return true;
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-20">
      <AdminPageHeader
        title="MANAJEMEN USER"
        subtitle="ADMIN"
        rightContent={
          <span
            className="text-[var(--text-color)] text-[14px] font-black uppercase px-4 py-2 border-[2.5px] border-[var(--border-color)] bg-yellow-300 rounded-xl shadow-[3px_3px_0px_var(--border-color)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            2.847 PENGGUNA
          </span>
        }
      />

      {/* FILTER & SEARCH */}
      <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[20px] p-[16px_20px] flex flex-col md:flex-row gap-[16px] mb-[24px]">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="w-full pl-[44px] pr-[16px] py-[12px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] text-[14px] font-bold text-[var(--text-color)] focus:outline-none focus:border-blue-500 focus:shadow-[4px_4px_0px_#3b82f6] transition-all placeholder:font-medium"
            style={{ fontFamily: "var(--font-body)" }}
          />
        </div>
        <div className="flex gap-[12px] overflow-x-auto pb-2 md:pb-0">
          {["Semua Role", "Semua Status", "Terbaru"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-[8px] px-[16px] py-[12px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] text-[13px] font-black uppercase text-[var(--text-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all shrink-0"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {filter} <ChevronDown className="w-[16px] h-[16px]" strokeWidth={2.5} />
            </button>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-[12px] mb-[32px] overflow-x-auto pb-2 md:pb-0">
        {["SEMUA (2847)", "PENCARI KERJA (2640)", "PROFESIONAL (186)", "ADMIN (21)"].map((tab) => {
          const tabName = tab.split(" ")[0];
          const isActive =
            activeTab === (tab.includes("SEMUA") ? "SEMUA" : tabName.replace("_", " "));
          return (
            <button
              key={tab}
              onClick={() =>
                setActiveTab(tab.includes("SEMUA") ? "SEMUA" : tabName.replace("_", " "))
              }
              className={`px-[20px] py-[10px] rounded-full text-[12px] font-black tracking-widest uppercase transition-all shrink-0 border-[2.5px] ${
                isActive
                  ? "bg-blue-500 text-white border-blue-600 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  : "bg-[var(--card-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* TABLE */}
      <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[24px] overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--bg-a)] border-b-[3px] border-[var(--border-color)]">
              {["USER", "ROLE", "STATUS", "BERGABUNG", "AKTIVITAS", "AKSI"].map((col) => (
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
            {filteredData.map((item) => (
              <tr
                key={item.id}
                className="border-b-[2.5px] border-[var(--border-color)] hover:bg-[var(--bg-a)] transition-colors group last:border-b-0"
              >
                <td className="p-[16px_24px]">
                  <div className="flex items-center gap-[12px]">
                    <div
                      className={`w-[44px] h-[44px] rounded-[12px] border-[2px] border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a] ${item.role === "Admin" ? "bg-purple-300" : "bg-blue-300"}`}
                    >
                      <span
                        className="text-slate-900 text-[18px] font-black uppercase"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        {item.name[0]}
                      </span>
                    </div>
                    <div>
                      <div
                        className="text-[var(--text-color)] text-[15px] font-black uppercase"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="text-[var(--text-muted)] text-[12px] font-bold"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {item.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-[16px_24px]">
                  <div className="flex flex-col gap-2 items-start">
                    <span
                      className={`px-[12px] py-[6px] rounded-md border-[2px] border-slate-900 text-[11px] font-black uppercase shadow-[2px_2px_0px_#0f172a] ${
                        item.role === "Pencari Kerja"
                          ? "bg-blue-200 text-blue-900"
                          : item.role === "Profesional"
                            ? "bg-yellow-300 text-yellow-900"
                            : "bg-purple-200 text-purple-900"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item.role}
                    </span>
                    {item.verified && (
                      <span
                        className="px-[10px] py-[4px] rounded-md bg-green-400 border-[2px] border-slate-900 text-slate-900 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#0f172a]"
                        style={{ fontFamily: "var(--font-impact)" }}
                      >
                        BNSP
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-[16px_24px]">
                  <span
                    className={`px-[14px] py-[6px] rounded-full border-[2.5px] text-[11px] font-black uppercase tracking-wider ${
                      item.status === "Aktif"
                        ? "border-green-600 bg-green-100 text-green-700"
                        : "border-red-600 bg-red-100 text-red-700"
                    }`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.status}
                  </span>
                </td>
                <td
                  className="p-[16px_24px] text-[var(--text-muted)] text-[13px] font-bold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.joinDate}
                </td>
                <td
                  className="p-[16px_24px] text-[var(--text-muted)] text-[12px] font-bold uppercase"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.activity}
                </td>
                <td className="p-[16px_24px]">
                  <div className="flex gap-[8px]">
                    <button
                      onClick={() => setDetailPanel(item.id)}
                      className="p-[8px] rounded-[10px] border-[2px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all"
                    >
                      <Eye className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </button>
                    {item.status === "Aktif" ? (
                      <button
                        onClick={() => setSuspendModal(item.id)}
                        className="p-[8px] rounded-[10px] border-[2px] border-[var(--border-color)] bg-[var(--card-bg)] text-red-500 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all"
                      >
                        <UserX className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnsuspend(item.id)}
                        className="p-[8px] rounded-[10px] border-[2px] border-[var(--border-color)] bg-[var(--card-bg)] text-green-500 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all"
                      >
                        <UserCheck className="w-[18px] h-[18px]" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
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
            1-8 DARI 2.847
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
            <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-[14px] font-black flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--border-color)] transition-all">
              3
            </button>
            <span className="text-[var(--text-muted)] text-[14px] font-black mx-1">...</span>
            <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-[14px] font-black flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--border-color)] transition-all">
              356
            </button>
            <button className="p-[6px] text-[var(--text-muted)] hover:text-[var(--text-color)]">
              <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* MODALS & PANELS */}
      <AnimatePresence>
        {/* SUSPEND MODAL */}
        {suspendModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-[var(--card-bg)] rounded-[24px] p-[32px] max-w-[440px] w-full border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)]"
            >
              <div className="w-[80px] h-[80px] rounded-[20px] bg-red-100 border-[3px] border-red-500 flex items-center justify-center mx-auto mb-[20px] shadow-[4px_4px_0px_#ef4444]">
                <UserX className="w-[40px] h-[40px] text-red-600" strokeWidth={2.5} />
              </div>
              <h2
                className="text-[var(--text-color)] text-[24px] font-black text-center uppercase"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                Suspend Pengguna?
              </h2>
              <p
                className="text-[var(--text-muted)] text-[14px] font-bold text-center mt-[12px] uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {data.find((u) => u.id === suspendModal)?.name} tidak akan dapat mengakses platform.
              </p>

              <div className="mt-[24px]">
                <label
                  className="text-[var(--text-color)] text-[12px] font-black uppercase tracking-wider mb-2 block"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  ALASAN SUSPEND
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] p-[16px] text-[var(--text-color)] text-[14px] font-bold min-h-[100px] focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_#ef4444] transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                  placeholder="Masukkan alasan..."
                />
              </div>

              <div className="flex flex-col gap-3 mt-[32px]">
                <button
                  disabled={!suspendReason.trim()}
                  onClick={() => handleSuspend(suspendModal)}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:border-red-300 disabled:translate-y-0 disabled:shadow-none border-[3px] border-slate-900 text-white rounded-[14px] p-[16px] text-[15px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  SUSPEND
                </button>
                <button
                  onClick={() => {
                    setSuspendModal(null);
                    setSuspendReason("");
                  }}
                  className="w-full bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] text-[var(--text-color)] rounded-[14px] p-[16px] text-[15px] font-black uppercase tracking-widest hover:bg-[var(--bg-a)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--border-color)] transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  BATAL
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DETAIL PANEL (Slide-over) */}
        {detailPanel && (
          <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-[480px] h-full bg-[var(--card-bg)] border-l-[3px] border-[var(--border-color)] shadow-[-12px_0_48px_rgba(0,0,0,0.5)] flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-[24px_32px] border-b-[3px] border-[var(--border-color)] bg-yellow-300 flex justify-between items-center shrink-0">
                <span
                  className="text-slate-900 text-[20px] font-black uppercase"
                  style={{ fontFamily: "var(--font-impact)" }}
                >
                  DETAIL USER
                </span>
                <button
                  onClick={() => setDetailPanel(null)}
                  className="w-[36px] h-[36px] flex items-center justify-center rounded-[10px] border-[2.5px] border-slate-900 bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a] text-slate-900 transition-all"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-[32px]">
                {/* Profile Header */}
                <div className="flex items-center gap-[20px] mb-[40px]">
                  <div className="w-[80px] h-[80px] rounded-[20px] border-[3px] border-[var(--border-color)] bg-blue-400 flex items-center justify-center shrink-0 shadow-[4px_4px_0px_var(--shadow-color)]">
                    <span
                      className="text-slate-900 text-[36px] font-black uppercase"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {data.find((u) => u.id === detailPanel)?.name?.[0]}
                    </span>
                  </div>
                  <div>
                    <h2
                      className="text-[var(--text-color)] text-[24px] font-black uppercase leading-tight"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {data.find((u) => u.id === detailPanel)?.name}
                    </h2>
                    <p
                      className="text-[var(--text-muted)] text-[14px] font-bold mb-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {data.find((u) => u.id === detailPanel)?.email}
                    </p>
                    <span
                      className="px-[12px] py-[6px] rounded-md border-[2px] border-slate-900 bg-blue-200 text-blue-900 text-[11px] font-black uppercase shadow-[2px_2px_0px_#0f172a]"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {data.find((u) => u.id === detailPanel)?.role}
                    </span>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-3 gap-[16px] mb-[40px]">
                  <div className="bg-[var(--bg-a)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] text-center hover:-translate-y-1 transition-transform">
                    <div
                      className="text-[var(--text-color)] text-[32px] font-black leading-none"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      12
                    </div>
                    <div
                      className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider mt-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Wawancara
                    </div>
                  </div>
                  <div className="bg-[var(--bg-a)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] text-center hover:-translate-y-1 transition-transform">
                    <div
                      className="text-[var(--text-color)] text-[32px] font-black leading-none"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      4
                    </div>
                    <div
                      className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider mt-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Proyek
                    </div>
                  </div>
                  <div className="bg-[var(--bg-a)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] text-center hover:-translate-y-1 transition-transform">
                    <div
                      className="text-[var(--text-color)] text-[32px] font-black leading-none"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      8
                    </div>
                    <div
                      className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider mt-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Review
                    </div>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="mb-[40px]">
                  <h3
                    className="text-[var(--text-color)] text-[16px] font-black mb-[20px] uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-impact)" }}
                  >
                    AKTIVITAS TERKINI
                  </h3>
                  <div className="flex flex-col gap-[16px]">
                    {[
                      { text: "Menyelesaikan wawancara teknis", time: "2 jam lalu" },
                      { text: "Menerima pembayaran review Rp 50.000", time: "1 hari lalu" },
                      { text: "Memperbarui profil keahlian", time: "3 hari lalu" },
                    ].map((act, i) => (
                      <div
                        key={i}
                        className="flex gap-[16px] items-center p-[16px] border-[2.5px] border-[var(--border-color)] bg-[var(--bg-a)] rounded-[14px]"
                      >
                        <div className="w-[12px] h-[12px] rounded-full border-[2px] border-slate-900 bg-blue-500 shadow-[2px_2px_0px_#0f172a] shrink-0" />
                        <div>
                          <p
                            className="text-[var(--text-color)] text-[14px] font-bold"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {act.text}
                          </p>
                          <p
                            className="text-[var(--text-muted)] text-[11px] font-black uppercase mt-1"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {act.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                {data.find((u) => u.id === detailPanel)?.status === "Aktif" && (
                  <div className="bg-red-50 border-[3px] border-red-200 rounded-[20px] p-[24px] mt-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-red-100 rounded-full blur-3xl" />
                    <h3
                      className="text-red-700 text-[14px] font-black uppercase tracking-[0.1em] mb-[16px] relative z-10"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      ZONA BAHAYA
                    </h3>
                    <button
                      onClick={() => {
                        setDetailPanel(null);
                        setTimeout(() => setSuspendModal(detailPanel), 300);
                      }}
                      className="w-full border-[3px] border-red-600 bg-white text-red-600 rounded-[14px] p-[14px] text-[14px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#dc2626] hover:-translate-y-1 hover:bg-red-50 transition-all relative z-10"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      Suspend Pengguna
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
