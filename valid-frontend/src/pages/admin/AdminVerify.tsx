// src/pages/admin/AdminVerify.tsx
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { AdminPageHeader } from "../../components/admin/AdminPageHeader";
import { useAdminToast } from "../../components/admin/AdminToast";
import { verifierApi } from "../../lib/api";
import { AdminVerifyList } from "../../components/admin/AdminVerifyList";
import {
  AdminApproveModal,
  AdminRejectModal,
  AdminDocViewerModal,
} from "../../components/admin/AdminVerifyModals";

export function AdminVerify() {
  const { addToast } = useAdminToast();
  const [activeTab, setActiveTab] = useState("MENUNGGU");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [approveModal, setApproveModal] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [docViewer, setDocViewer] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await verifierApi.getPendingApplications();
      // Map ke format yg dibutuhkan komponen UI
      const mapped = (res.applications || []).map((app: any) => ({
        id: app.uid,
        name: app.fullName,
        spec: app.vocationFields?.join(", ") || app.currentJob,
        bnsp: app.certifications?.[0] || "N/A",
        validUntil: app.approvedAt ? new Date(app.approvedAt).toLocaleDateString("id-ID") : "-",
        time: new Date(app.submittedAt).toLocaleDateString("id-ID"),
        status:
          app.status === "pending"
            ? "MENUNGGU"
            : app.status === "approved"
              ? "DISETUJUI"
              : "DITOLAK",
        raw: app,
      }));
      setData(mapped);
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: "Gagal memuat data pendaftar" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await verifierApi.approveVerifier(id);

      // Update status di state agar baris langsung hilang/berubah tanpa refresh
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "DISETUJUI" } : item)),
      );

      const user = data.find((u) => u.id === id);
      setApproveModal(null);
      setDocViewer(null);
      addToast({ type: "success", message: `${user?.name || "Verifikator"} berhasil disetujui!` });
      window.dispatchEvent(new CustomEvent("verifier-status-changed"));
    } catch (err: any) {
      addToast({ type: "error", message: err.message || "Gagal menyetujui verifikator" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await verifierApi.rejectVerifier(id, rejectReason);

      // Update status di state agar baris langsung hilang/berubah tanpa refresh
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "DITOLAK" } : item)),
      );

      const user = data.find((u) => u.id === id);
      setRejectModal(null);
      setDocViewer(null);
      setRejectReason("");
      addToast({ type: "error", message: `Verifikasi ${user?.name || "Verifikator"} ditolak.` });
      window.dispatchEvent(new CustomEvent("verifier-status-changed"));
    } catch (err: any) {
      addToast({ type: "error", message: err.message || "Gagal menolak verifikator" });
    }
  };

  const filteredData = data.filter((item) => item.status === activeTab);

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20">
      <AdminPageHeader
        title="VERIFIKATOR"
        subtitle="APPROVAL"
        rightContent={
          <div
            className="px-[16px] py-[8px] rounded-full border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] shadow-[4px_4px_0px_var(--shadow-color)] text-[var(--text-color)] text-[13px] font-bold uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {data.filter((d) => d.status === "MENUNGGU").length} PENDAFTAR BARU
          </div>
        }
      />

      {/* TABS */}
      <div className="flex items-center gap-[12px] mb-[32px] overflow-x-auto pb-2">
        {["MENUNGGU", "DISETUJUI", "DITOLAK"].map((tab) => {
          const count = data.filter((d) => d.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-[20px] py-[10px] rounded-[14px] border-[2.5px] text-[13px] font-black uppercase transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-blue-500 text-white border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
                  : "bg-[var(--card-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)]"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-[var(--text-muted)]">Memuat data...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-20 font-bold text-[var(--text-muted)]">
          Tidak ada pendaftar dengan status ini.
        </div>
      ) : (
        <AdminVerifyList
          filteredData={filteredData}
          setRejectModal={setRejectModal}
          setApproveModal={setApproveModal}
          setDocViewer={setDocViewer}
        />
      )}

      <AnimatePresence>
        {approveModal && (
          <AdminApproveModal
            approveModal={approveModal}
            data={data}
            handleApprove={handleApprove}
            setApproveModal={setApproveModal}
          />
        )}
        {rejectModal && (
          <AdminRejectModal
            rejectModal={rejectModal}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            handleReject={handleReject}
            setRejectModal={setRejectModal}
          />
        )}
        {docViewer && (
          <AdminDocViewerModal docViewer={docViewer} data={data} setDocViewer={setDocViewer} />
        )}
      </AnimatePresence>
    </div>
  );
}
