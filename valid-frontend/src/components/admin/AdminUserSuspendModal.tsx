// HALAMAN: komponen/admin/AdminUserSuspendModal
// FUNGSI: Menampilkan modal konfirmasi untuk suspend user
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

import { motion } from 'framer-motion';
import { UserX } from 'lucide-react';

export function AdminUserSuspendModal({
  user,
  suspendReason,
  setSuspendReason,
  handleSuspend,
  onCancel
}: any) {
  if (!user) return null;

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
          <UserX className="w-[40px] h-[40px] text-red-600" strokeWidth={2.5} />
        </div>
        <h2 className="text-[var(--text-color)] text-[24px] font-black text-center uppercase" style={{ fontFamily: 'var(--font-impact)' }}>Suspend Pengguna?</h2>
        <p className="text-[var(--text-muted)] text-[14px] font-bold text-center mt-[12px] uppercase" style={{ fontFamily: 'var(--font-body)' }}>
          {user.name} tidak akan dapat mengakses platform.
        </p>
        
        <div className="mt-[24px]">
          <label className="text-[var(--text-color)] text-[12px] font-black uppercase tracking-wider mb-2 block" style={{ fontFamily: 'var(--font-body)' }}>ALASAN SUSPEND</label>
          <textarea 
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[14px] p-[16px] text-[var(--text-color)] text-[14px] font-bold min-h-[100px] focus:outline-none focus:border-red-500 focus:shadow-[4px_4px_0px_#ef4444] transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
            placeholder="Masukkan alasan..."
          />
        </div>

        <div className="flex flex-col gap-3 mt-[32px]">
          <button 
            disabled={!suspendReason.trim()}
            onClick={() => handleSuspend(user.id)}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:border-red-300 disabled:translate-y-0 disabled:shadow-none border-[3px] border-slate-900 text-white rounded-[14px] p-[16px] text-[15px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#0f172a] hover:-translate-y-1 transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            SUSPEND
          </button>
          <button 
            onClick={onCancel}
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
