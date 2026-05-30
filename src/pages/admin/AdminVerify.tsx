// HALAMAN: pages/admin/AdminVerify
// FUNGSI: Menampilkan dan mengelola daftar profesional yang membutuhkan verifikasi BNSP
// API YANG DIBUTUHKAN: -
// DUMMY DATA: - Menggunakan DUMMY_PENDING dari komponen

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useAdminToast } from '../../components/admin/AdminToast';

import { DUMMY_PENDING } from '../../components/admin/AdminVerifyDummyData';
import { AdminVerifyList } from '../../components/admin/AdminVerifyList';
import { AdminApproveModal, AdminRejectModal, AdminDocViewerModal } from '../../components/admin/AdminVerifyModals';

export function AdminVerify() {
  const { addToast } = useAdminToast();
  const [activeTab, setActiveTab] = useState('MENUNGGU (3)');
  const [data, setData] = useState(DUMMY_PENDING);
  
  // Modal states
  const [approveModal, setApproveModal] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<number | null>(null);
  const [docViewer, setDocViewer] = useState<number | null>(null);
  
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id: number) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: 'DISETUJUI' } : item));
    const user = data.find(u => u.id === id);
    setApproveModal(null);
    setDocViewer(null);
    addToast({ type: 'success', message: `${user?.name} berhasil diverifikasi!` });
  };

  const handleReject = (id: number) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: 'DITOLAK' } : item));
    const user = data.find(u => u.id === id);
    setRejectModal(null);
    setDocViewer(null);
    setRejectReason('');
    addToast({ type: 'error', message: `Verifikasi ${user?.name} ditolak.` });
  };

  const filteredData = data.filter(item => {
    if (activeTab.includes('MENUNGGU')) return item.status === 'MENUNGGU';
    if (activeTab === 'DISETUJUI') return item.status === 'DISETUJUI';
    if (activeTab === 'DITOLAK') return item.status === 'DITOLAK';
    return true;
  });

  return (
    <div className="w-full max-w-[1000px] mx-auto pb-20">
      <AdminPageHeader 
        title="VERIFIKASI BNSP" 
        subtitle="VERIFIKASI" 
      />
      <p className="text-[var(--text-muted)] text-[15px] font-bold mb-[28px] -mt-[16px] uppercase" style={{ fontFamily: 'var(--font-body)' }}>
        Tinjau dan verifikasi sertifikasi BNSP dari profesional yang mendaftar.
      </p>

      {/* FILTER TABS */}
      <div className="flex gap-[12px] mb-[24px]">
        {['MENUNGGU (3)', 'DISETUJUI', 'DITOLAK'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-[20px] py-[10px] rounded-full text-[12px] font-black tracking-widest uppercase transition-all shrink-0 border-[2.5px] ${
              activeTab === tab 
                ? 'bg-blue-500 text-white border-blue-600 shadow-[4px_4px_0px_rgba(0,0,0,0.8)]' 
                : 'bg-[var(--card-bg)] text-[var(--text-color)] border-[var(--border-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)]'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* LIST */}
      <AdminVerifyList 
        filteredData={filteredData}
        setRejectModal={setRejectModal}
        setApproveModal={setApproveModal}
        setDocViewer={setDocViewer}
      />

      {/* MODALS & OVERLAYS */}
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
