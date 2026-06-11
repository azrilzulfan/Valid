// HALAMAN: komponen/admin/AdminVerifyModals
// FUNGSI: Menampilkan modal untuk persetujuan, penolakan, dan dokumen BNSP
// API YANG DIBUTUHKAN: -
// DUMMY DATA: Menerima props

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, X, FileText } from 'lucide-react';

export function AdminApproveModal({ approveModal, data, handleApprove, setApproveModal }: any) {
  if (!approveModal) return null;
  const user = data.find((u: any) => u.id === approveModal);

  return (
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
          {user?.name} akan mendapat akses penuh sebagai profesional terverifikasi.
        </p>
        
        <div className="mt-[24px] bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[16px] p-[16px]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[var(--text-muted)] text-[12px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>Nama</span>
            <span className="text-[var(--text-color)] text-[13px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{user?.name}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[var(--text-muted)] text-[12px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>Nomor BNSP</span>
            <span className="text-[var(--text-color)] text-[13px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{user?.bnsp}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-muted)] text-[12px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>Spesialisasi</span>
            <span className="text-[var(--text-color)] text-[13px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{user?.spec}</span>
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
  );
}

export function AdminRejectModal({ rejectModal, rejectReason, setRejectReason, handleReject, setRejectModal }: any) {
  if (!rejectModal) return null;

  return (
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
  );
}

export function AdminDocViewerModal({ docViewer, data, setDocViewer, setRejectModal, setApproveModal }: any) {
  if (!docViewer) return null;
  const user = data.find((u: any) => u.id === docViewer);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-[4px] p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="bg-[var(--card-bg)] rounded-[24px] border-[3px] border-[var(--border-color)] w-full max-w-[700px] overflow-hidden shadow-[12px_12px_0px_var(--shadow-color)]"
      >
        <div className="p-[20px_24px] flex justify-between items-center border-b-[3px] border-[var(--border-color)] bg-yellow-300">
          <span className="text-slate-900 text-[16px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Sertifikat_BNSP_{user?.name?.split(' ')[0]}.pdf</span>
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

        {user?.status === 'MENUNGGU' && (
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
  );
}
