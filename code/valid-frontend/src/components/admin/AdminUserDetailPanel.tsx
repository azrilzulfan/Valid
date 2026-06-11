// HALAMAN: komponen/admin/AdminUserDetailPanel
// FUNGSI: Menampilkan panel detail user dari samping
// API YANG DIBUTUHKAN: -
// DUMMY DATA: Menerima props user

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function AdminUserDetailPanel({
  user,
  onClose,
  onSuspendClick
}: any) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[480px] h-full bg-[var(--card-bg)] border-l-[3px] border-[var(--border-color)] shadow-[-12px_0_48px_rgba(0,0,0,0.5)] flex flex-col"
      >
        {/* Panel Header */}
        <div className="p-[24px_32px] border-b-[3px] border-[var(--border-color)] bg-yellow-300 flex justify-between items-center shrink-0">
          <span className="text-slate-900 text-[20px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>DETAIL USER</span>
          <button onClick={onClose} className="w-[36px] h-[36px] flex items-center justify-center rounded-[10px] border-[2.5px] border-slate-900 bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0f172a] text-slate-900 transition-all">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-[32px]">
          {/* Profile Header */}
          <div className="flex items-center gap-[20px] mb-[40px]">
            <div className="w-[80px] h-[80px] rounded-[20px] border-[3px] border-[var(--border-color)] bg-blue-400 flex items-center justify-center shrink-0 shadow-[4px_4px_0px_var(--shadow-color)]">
              <span className="text-slate-900 text-[36px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{user.name?.[0]}</span>
            </div>
            <div>
              <h2 className="text-[var(--text-color)] text-[24px] font-black uppercase leading-tight" style={{ fontFamily: 'var(--font-impact)' }}>{user.name}</h2>
              <p className="text-[var(--text-muted)] text-[14px] font-bold mb-2" style={{ fontFamily: 'var(--font-body)' }}>{user.email}</p>
              <span className="px-[12px] py-[6px] rounded-md border-[2px] border-slate-900 bg-blue-200 text-blue-900 text-[11px] font-black uppercase shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-body)' }}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-3 gap-[16px] mb-[40px]">
            <div className="bg-[var(--bg-a)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] text-center hover:-translate-y-1 transition-transform">
              <div className="text-[var(--text-color)] text-[32px] font-black leading-none" style={{ fontFamily: 'var(--font-impact)' }}>12</div>
              <div className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider mt-2" style={{ fontFamily: 'var(--font-body)' }}>Wawancara</div>
            </div>
            <div className="bg-[var(--bg-a)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] text-center hover:-translate-y-1 transition-transform">
              <div className="text-[var(--text-color)] text-[32px] font-black leading-none" style={{ fontFamily: 'var(--font-impact)' }}>4</div>
              <div className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider mt-2" style={{ fontFamily: 'var(--font-body)' }}>Proyek</div>
            </div>
            <div className="bg-[var(--bg-a)] border-[3px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[16px] p-[20px] text-center hover:-translate-y-1 transition-transform">
              <div className="text-[var(--text-color)] text-[32px] font-black leading-none" style={{ fontFamily: 'var(--font-impact)' }}>8</div>
              <div className="text-[var(--text-muted)] text-[11px] font-black uppercase tracking-wider mt-2" style={{ fontFamily: 'var(--font-body)' }}>Review</div>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="mb-[40px]">
            <h3 className="text-[var(--text-color)] text-[16px] font-black mb-[20px] uppercase tracking-wider" style={{ fontFamily: 'var(--font-impact)' }}>AKTIVITAS TERKINI</h3>
            <div className="flex flex-col gap-[16px]">
              {[
                { text: 'Menyelesaikan wawancara teknis', time: '2 jam lalu' },
                { text: 'Menerima pembayaran review Rp 50.000', time: '1 hari lalu' },
                { text: 'Memperbarui profil keahlian', time: '3 hari lalu' },
              ].map((act, i) => (
                <div key={i} className="flex gap-[16px] items-center p-[16px] border-[2.5px] border-[var(--border-color)] bg-[var(--bg-a)] rounded-[14px]">
                  <div className="w-[12px] h-[12px] rounded-full border-[2px] border-slate-900 bg-blue-500 shadow-[2px_2px_0px_#0f172a] shrink-0" />
                  <div>
                    <p className="text-[var(--text-color)] text-[14px] font-bold" style={{ fontFamily: 'var(--font-body)' }}>{act.text}</p>
                    <p className="text-[var(--text-muted)] text-[11px] font-black uppercase mt-1" style={{ fontFamily: 'var(--font-body)' }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          {user.status === 'Aktif' && (
            <div className="bg-red-50 border-[3px] border-red-200 rounded-[20px] p-[24px] mt-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-red-100 rounded-full blur-3xl" />
              <h3 className="text-red-700 text-[14px] font-black uppercase tracking-[0.1em] mb-[16px] relative z-10" style={{ fontFamily: 'var(--font-impact)' }}>ZONA BAHAYA</h3>
              <button 
                onClick={onSuspendClick}
                className="w-full border-[3px] border-red-600 bg-white text-red-600 rounded-[14px] p-[14px] text-[14px] font-black uppercase tracking-widest shadow-[4px_4px_0px_#dc2626] hover:-translate-y-1 hover:bg-red-50 transition-all relative z-10"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Suspend Pengguna
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
