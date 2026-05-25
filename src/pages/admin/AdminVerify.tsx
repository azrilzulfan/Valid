import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { useAdminToast } from '../../components/admin/AdminToast';
import { FileText, CheckCircle, XCircle, X } from 'lucide-react';

const DUMMY_PENDING = [
  { id: 1, name: 'Budi Santoso', spec: 'Teknik Mesin', bnsp: 'BNSP-12345-2024', validUntil: 'Des 2026', time: '2 hari lalu', status: 'MENUNGGU' },
  { id: 2, name: 'Siti Rahayu', spec: 'Desain Grafis', bnsp: 'BNSP-67890-2023', validUntil: 'Nov 2025', time: '1 hari lalu', status: 'MENUNGGU' },
  { id: 3, name: 'Ahmad Fauzi', spec: 'Pemrograman Web', bnsp: 'BNSP-11111-2024', validUntil: 'Jan 2027', time: '5 jam lalu', status: 'MENUNGGU' },
];

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
      <div className="flex flex-col gap-[20px]">
        {filteredData.map(item => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[6px_6px_0px_var(--shadow-color)] rounded-[24px] overflow-hidden transition-transform duration-200 hover:-translate-y-1 relative ${item.status === 'MENUNGGU' ? 'border-t-0' : ''}`}
          >
            {item.status === 'MENUNGGU' && (
              <div className="h-[6px] w-full bg-yellow-400" />
            )}
            {item.status === 'DISETUJUI' && (
              <div className="h-[6px] w-full bg-green-500" />
            )}
            {item.status === 'DITOLAK' && (
              <div className="h-[6px] w-full bg-red-500" />
            )}

            <div className="p-[24px_32px]">
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="flex gap-[16px] items-center">
                  <div className="w-[56px] h-[56px] rounded-[14px] border-[2px] border-slate-900 bg-blue-500 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a]">
                    <span className="text-white text-[24px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{item.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="text-[var(--text-color)] text-[18px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{item.name}</h3>
                    <p className="text-[var(--text-color)] text-[14px] font-bold uppercase" style={{ fontFamily: 'var(--font-body)' }}>{item.spec}</p>
                    <p className="text-[var(--text-muted)] text-[11px] font-black uppercase mt-1" style={{ fontFamily: 'var(--font-body)' }}>Mendaftar {item.time}</p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`px-[16px] py-[8px] rounded-full border-[2.5px] border-[var(--border-color)] shadow-[2px_2px_0px_var(--border-color)] text-[12px] font-black uppercase tracking-wider ${
                  item.status === 'MENUNGGU' ? 'bg-yellow-300 text-slate-900' :
                  item.status === 'DISETUJUI' ? 'bg-green-400 text-slate-900' :
                  'bg-red-400 text-slate-900'
                }`} style={{ fontFamily: 'var(--font-body)' }}>
                  {item.status}
                </div>
              </div>

              {/* BNSP Info Row */}
              <div className="flex flex-wrap gap-[32px] mt-[24px] pt-[20px] border-t-[3px] border-[var(--border-color)]">
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>NOMOR BNSP</div>
                  <div className="text-[var(--text-color)] text-[14px] font-bold" style={{ fontFamily: 'var(--font-body)' }}>{item.bnsp}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>BIDANG</div>
                  <div className="text-[var(--text-color)] text-[14px] font-bold uppercase" style={{ fontFamily: 'var(--font-body)' }}>{item.spec}</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>BERLAKU HINGGA</div>
                  <div className="text-[var(--text-color)] text-[14px] font-bold uppercase" style={{ fontFamily: 'var(--font-body)' }}>{item.validUntil}</div>
                </div>
              </div>

              {/* Document Strip */}
              <div className="mt-[24px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] p-[16px_20px] flex items-center justify-between">
                <div className="flex items-center gap-[12px]">
                  <div className="p-2 bg-blue-100 rounded-lg border-[2px] border-[var(--border-color)]">
                    <FileText className="w-[18px] h-[18px] text-blue-600" />
                  </div>
                  <span className="text-[var(--text-color)] text-[14px] font-bold" style={{ fontFamily: 'var(--font-body)' }}>Sertifikat_BNSP_{item.name.split(' ')[0]}.pdf</span>
                </div>
                <button 
                  onClick={() => setDocViewer(item.id)}
                  className="px-[16px] py-[8px] bg-white border-[2.5px] border-slate-900 rounded-xl text-slate-900 text-[12px] font-black uppercase shadow-[2px_2px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a] transition-all" 
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  LIHAT DOKUMEN
                </button>
              </div>

              {/* Actions */}
              {item.status === 'MENUNGGU' && (
                <div className="mt-[24px] flex justify-end gap-[16px]">
                  <button 
                    onClick={() => setRejectModal(item.id)}
                    className="border-[2.5px] border-red-500 bg-red-100 rounded-[12px] p-[10px_24px] text-red-700 text-[13px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#ef4444] hover:-translate-y-0.5 transition-all"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    TOLAK
                  </button>
                  <button 
                    onClick={() => setApproveModal(item.id)}
                    className="border-[2.5px] border-green-600 bg-green-500 rounded-[12px] p-[10px_24px] text-white text-[13px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#16a34a] hover:-translate-y-0.5 hover:bg-green-600 transition-all"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    VERIFIKASI & SETUJUI
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODALS & OVERLAYS */}
      <AnimatePresence>
        {/* APPROVE MODAL */}
        {approveModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-[var(--card-bg)] rounded-[24px] p-[32px] max-w-[440px] w-full border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)]"
            >
              <div className="w-[80px] h-[80px] rounded-[20px] bg-green-100 border-[3px] border-green-500 flex items-center justify-center mx-auto mb-[20px] shadow-[4px_4px_0px_#22c55e]">
                <CheckCircle className="w-[40px] h-[40px] text-green-600" strokeWidth={2.5} />
              </div>
              <h2 className="text-[var(--text-color)] text-[24px] font-black text-center uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Verifikasi Profesional?</h2>
              <p className="text-[var(--text-muted)] text-[14px] font-bold text-center mt-[12px] uppercase" style={{ fontFamily: 'var(--font-body)' }}>
                {data.find(u => u.id === approveModal)?.name} akan mendapat akses penuh sebagai profesional terverifikasi.
              </p>
              
              <div className="mt-[24px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[16px] p-[16px]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--text-muted)] text-[12px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>Nama</span>
                  <span className="text-[var(--text-color)] text-[13px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{data.find(u => u.id === approveModal)?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[var(--text-muted)] text-[12px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>Nomor BNSP</span>
                  <span className="text-[var(--text-color)] text-[13px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{data.find(u => u.id === approveModal)?.bnsp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)] text-[12px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>Spesialisasi</span>
                  <span className="text-[var(--text-color)] text-[13px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{data.find(u => u.id === approveModal)?.spec}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-[32px]">
                <button 
                  onClick={() => handleApprove(approveModal)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-[14px] border-[3px] border-slate-900 p-[16px] text-[15px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  SETUJUI
                </button>
                <button 
                  onClick={() => setApproveModal(null)}
                  className="w-full bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] text-[var(--text-color)] rounded-[14px] p-[16px] text-[15px] font-black uppercase tracking-widest hover:bg-[var(--bg-a)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--border-color)] transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  BATAL
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* REJECT MODAL */}
        {rejectModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-[var(--card-bg)] rounded-[24px] p-[32px] max-w-[440px] w-full border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)]"
            >
              <div className="w-[80px] h-[80px] rounded-[20px] bg-red-100 border-[3px] border-red-500 flex items-center justify-center mx-auto mb-[20px] shadow-[4px_4px_0px_#ef4444]">
                <XCircle className="w-[40px] h-[40px] text-red-600" strokeWidth={2.5} />
              </div>
              <h2 className="text-[var(--text-color)] text-[24px] font-black text-center uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Tolak Verifikasi?</h2>
              
              <div className="mt-[24px]">
                <label className="text-[var(--text-color)] text-[12px] font-black uppercase tracking-wider mb-2 block" style={{ fontFamily: 'var(--font-body)' }}>ALASAN PENOLAKAN</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] p-[16px] text-[var(--text-color)] text-[14px] font-bold min-h-[100px] focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_#ef4444] transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                  placeholder="Masukkan alasan penolakan..."
                />
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Dokumen tidak valid', 'Nomor BNSP tidak ditemukan', 'Foto tidak jelas'].map(reason => (
                    <button 
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className="border-[2px] border-red-300 text-red-600 bg-red-50 rounded-full p-[6px_14px] text-[11px] font-black uppercase hover:bg-red-100 transition-colors"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-[32px]">
                <button 
                  disabled={!rejectReason.trim()}
                  onClick={() => handleReject(rejectModal)}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:border-red-300 disabled:translate-y-0 disabled:shadow-none border-[3px] border-slate-900 text-white rounded-[14px] p-[16px] text-[15px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  TOLAK REQUEST
                </button>
                <button 
                  onClick={() => { setRejectModal(null); setRejectReason(''); }}
                  className="w-full bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] text-[var(--text-color)] rounded-[14px] p-[16px] text-[15px] font-black uppercase tracking-widest hover:bg-[var(--bg-a)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_var(--border-color)] transition-all"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  BATAL
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DOCUMENT VIEWER OVERLAY */}
        {docViewer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-[4px] p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-[var(--card-bg)] rounded-[24px] border-[3px] border-[var(--border-color)] w-full max-w-[700px] overflow-hidden shadow-[12px_12px_0px_var(--shadow-color)]"
            >
              <div className="p-[20px_24px] flex justify-between items-center border-b-[3px] border-[var(--border-color)] bg-yellow-300">
                <span className="text-slate-900 text-[16px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Sertifikat_BNSP_{data.find(u => u.id === docViewer)?.name?.split(' ')[0]}.pdf</span>
                <button onClick={() => setDocViewer(null)} className="flex items-center justify-center w-[36px] h-[36px] rounded-[10px] border-[2px] border-slate-900 bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a] transition-all text-slate-900">
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </button>
              </div>

              <div className="h-[450px] bg-[var(--bg-a)] flex flex-col items-center justify-center gap-4">
                <div className="w-[100px] h-[100px] bg-blue-100 border-[3px] border-blue-500 rounded-[24px] flex items-center justify-center shadow-[4px_4px_0px_#3b82f6]">
                  <FileText className="w-[48px] h-[48px] text-blue-600" />
                </div>
                <span className="text-[var(--text-color)] text-[16px] font-black uppercase tracking-widest mt-2" style={{ fontFamily: 'var(--font-impact)' }}>Preview Dokumen BNSP</span>
              </div>

              {data.find(u => u.id === docViewer)?.status === 'MENUNGGU' && (
                <div className="p-[24px] flex justify-end gap-[16px] border-t-[3px] border-[var(--border-color)] bg-white">
                  <button 
                    onClick={() => { setDocViewer(null); setRejectModal(docViewer); }}
                    className="border-[2.5px] border-red-500 bg-red-100 rounded-[12px] p-[10px_24px] text-red-700 text-[13px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#ef4444] hover:-translate-y-0.5 transition-all"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    TOLAK
                  </button>
                  <button 
                    onClick={() => { setDocViewer(null); setApproveModal(docViewer); }}
                    className="border-[2.5px] border-green-600 bg-green-500 rounded-[12px] p-[10px_24px] text-white text-[13px] font-black uppercase tracking-widest shadow-[3px_3px_0px_#16a34a] hover:-translate-y-0.5 hover:bg-green-600 transition-all"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    VERIFIKASI & SETUJUI
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
