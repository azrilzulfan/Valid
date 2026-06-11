// HALAMAN: pages/admin/AdminUsers
// FUNGSI: Menampilkan dan mengelola daftar pengguna platform
// API YANG DIBUTUHKAN: -
// DUMMY DATA: - Menggunakan DUMMY_USERS dari komponen

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { useAdminToast } from "../../components/admin/AdminToast";
import { Search, ChevronDown } from "lucide-react";

import { DUMMY_USERS } from "../../components/admin/AdminUsersDummyData";
import { AdminUsersTable } from "../../components/admin/AdminUsersTable";
import { AdminUserSuspendModal } from "../../components/admin/AdminUserSuspendModal";
import { AdminUserDetailPanel } from "../../components/admin/AdminUserDetailPanel";

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
      <AdminUsersTable
        filteredData={filteredData}
        setDetailPanel={setDetailPanel}
        setSuspendModal={setSuspendModal}
        handleUnsuspend={handleUnsuspend}
      />

      {/* MODALS & PANELS */}
      <AnimatePresence>
        {/* SUSPEND MODAL */}
        {suspendModal && (
          <AdminUserSuspendModal
            user={data.find((u) => u.id === suspendModal)}
            suspendReason={suspendReason}
            setSuspendReason={setSuspendReason}
            handleSuspend={handleSuspend}
            onCancel={() => {
              setSuspendModal(null);
              setSuspendReason("");
            }}
          />
        )}

        {/* DETAIL PANEL (Slide-over) */}
        {detailPanel && (
          <AdminUserDetailPanel
            user={data.find((u) => u.id === detailPanel)}
            onClose={() => setDetailPanel(null)}
            onSuspendClick={() => {
              setDetailPanel(null);
              setTimeout(() => setSuspendModal(detailPanel), 300);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
