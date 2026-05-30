// HALAMAN: komponen/admin/AdminVerifyList
// FUNGSI: Menampilkan daftar profesional yang perlu diverifikasi BNSP-nya
// API YANG DIBUTUHKAN: -
// DUMMY DATA: Menampilkan daftar item dari props

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export function AdminVerifyList({ filteredData, setRejectModal, setApproveModal, setDocViewer }: any) {
  return (
    <div className="flex flex-col gap-[20px]">
      {filteredData.map((item: any) => (
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
  );
}
