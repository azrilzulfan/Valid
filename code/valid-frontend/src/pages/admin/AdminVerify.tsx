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
      // Map ke format yg dibutuhkan komponen
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
        // Simpan data lengkap untuk keperluan lain
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
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "DISETUJUI" } : item)),
      );
      const user = data.find((u) => u.id === id);
      setApproveModal(null);
      setDocViewer(null);
      addToast({ type: "success", message: `${user?.name} berhasil diverifikasi!` });
    } catch (err: any) {
      addToast({ type: "error", message: err.message || "Gagal menyetujui verifikator" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await verifierApi.rejectVerifier(id, rejectReason);
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "DITOLAK" } : item)),
      );
      const user = data.find((u) => u.id === id);
      setRejectModal(null);
      setDocViewer(null);
      setRejectReason("");
      addToast({ type: "error", message: `Verifikasi ${user?.name} ditolak.` });
    } catch (err: any) {
      addToast({ type: "error", message: err.message || "Gagal menolak verifikator" });
    }
  };

  const filteredData = data.filter((item) => {
    if (activeTab === "MENUNGGU") return item.status === "MENUNGGU";
    if (activeTab === "DISETUJUI") return item.status === "DISETUJUI";
    if (activeTab === "DITOLAK") return item.status === "DITOLAK";
    return true;
  });

  const pendingCount = data.filter((d) => d.status === "MENUNGGU").length;

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-20">
      <AdminPageHeader title="VERIFIKASI VERIFIKATOR" subtitle="VERIFIKASI" />
      <p
        className="text-[var(--text-muted)] text-[15px] font-bold mb-[28px] -mt-[16px] uppercase"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Tinjau dan setujui pendaftaran verifikator industri.
      </p>

      {/* FILTER TABS */}
      <div className="flex gap-[12px] mb-[24px]">
        {[`MENUNGGU (${pendingCount})`, "DISETUJUI", "DITOLAK"].map((tab) => {
          const tabKey = tab.split(" ")[0];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tabKey)}
              className={`px-[20px] py-[10px] rounded-full text-[12px] font-black tracking-widest uppercase transition-all shrink-0 border-[2.5px] ${
                activeTab === tabKey
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

      {loading ? (
        <div className="text-center py-20 font-bold text-[var(--text-muted)]">Memuat data...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-20 font-bold text-[var(--text-muted)]">
          Tidak ada pendaftar.
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
        <AdminApproveModal
          approveModal={approveModal}
          data={data}
          handleApprove={handleApprove}
          setApproveModal={setApproveModal}
        />
        <AdminRejectModal
          rejectModal={rejectModal}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          handleReject={handleReject}
          setRejectModal={setRejectModal}
        />
        <AdminDocViewerModal
          docViewer={docViewer}
          data={data}
          setDocViewer={setDocViewer}
          setRejectModal={setRejectModal}
          setApproveModal={setApproveModal}
        />
      </AnimatePresence>
    </div>
  );
}
