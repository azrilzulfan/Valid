// HALAMAN: komponen/admin/AdminUsersTable
// FUNGSI: Menampilkan tabel daftar pengguna
// API YANG DIBUTUHKAN: -
// DUMMY DATA: Menerima props data

import { Eye, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

export function AdminUsersTable({ filteredData, setDetailPanel, setSuspendModal, handleUnsuspend }: any) {
  return (
    <div className="bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[24px] overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[var(--bg-a)] border-b-[3px] border-[var(--border-color)]">
            {['USER', 'ROLE', 'STATUS', 'BERGABUNG', 'AKTIVITAS', 'AKSI'].map(col => (
              <th key={col} className="p-[16px_24px] text-[13px] font-black text-[var(--text-color)] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-body)' }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item: any) => (
            <tr key={item.id} className="border-b-[2.5px] border-[var(--border-color)] hover:bg-[var(--bg-a)] transition-colors group last:border-b-0">
              <td className="p-[16px_24px]">
                <div className="flex items-center gap-[12px]">
                  <div className={`w-[44px] h-[44px] rounded-[12px] border-[2px] border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#0f172a] ${item.role === 'Admin' ? 'bg-purple-300' : 'bg-blue-300'}`}>
                    <span className="text-slate-900 text-[18px] font-black uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{item.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-[var(--text-color)] text-[15px] font-black uppercase" style={{ fontFamily: 'var(--font-body)' }}>{item.name}</div>
                    <div className="text-[var(--text-muted)] text-[12px] font-bold" style={{ fontFamily: 'var(--font-body)' }}>{item.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-[16px_24px]">
                <div className="flex flex-col gap-2 items-start">
                  <span className={`px-[12px] py-[6px] rounded-md border-[2px] border-slate-900 text-[11px] font-black uppercase shadow-[2px_2px_0px_#0f172a] ${
                    item.role === 'Pencari Kerja' ? 'bg-blue-200 text-blue-900' :
                    item.role === 'Profesional' ? 'bg-yellow-300 text-yellow-900' :
                    'bg-purple-200 text-purple-900'
                  }`} style={{ fontFamily: 'var(--font-body)' }}>
                    {item.role}
                  </span>
                  {item.verified && (
                    <span className="px-[10px] py-[4px] rounded-md bg-green-400 border-[2px] border-slate-900 text-slate-900 text-[9px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#0f172a]" style={{ fontFamily: 'var(--font-impact)' }}>BNSP</span>
                  )}
                </div>
              </td>
              <td className="p-[16px_24px]">
                <span className={`px-[14px] py-[6px] rounded-full border-[2.5px] text-[11px] font-black uppercase tracking-wider ${
                  item.status === 'Aktif' ? 'border-green-600 bg-green-100 text-green-700' :
                  'border-red-600 bg-red-100 text-red-700'
                }`} style={{ fontFamily: 'var(--font-body)' }}>
                  {item.status}
                </span>
              </td>
              <td className="p-[16px_24px] text-[var(--text-muted)] text-[13px] font-bold" style={{ fontFamily: 'var(--font-body)' }}>{item.joinDate}</td>
              <td className="p-[16px_24px] text-[var(--text-muted)] text-[12px] font-bold uppercase" style={{ fontFamily: 'var(--font-body)' }}>{item.activity}</td>
              <td className="p-[16px_24px]">
                <div className="flex gap-[8px]">
                  <button 
                    onClick={() => setDetailPanel(item.id)}
                    className="p-[8px] rounded-[10px] border-[2px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--border-color)] transition-all"
                  >
                    <Eye className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </button>
                  {item.status === 'Aktif' ? (
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
        <span className="text-[var(--text-muted)] text-[13px] font-bold uppercase" style={{ fontFamily: 'var(--font-body)' }}>1-8 DARI 2.847</span>
        <div className="flex items-center gap-[8px]">
          <button className="p-[6px] text-[var(--text-muted)] hover:text-[var(--text-color)]"><ChevronLeft className="w-6 h-6" strokeWidth={2.5} /></button>
          <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-slate-900 bg-blue-500 text-white text-[14px] font-black flex items-center justify-center shadow-[2px_2px_0px_#0f172a]">1</button>
          <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-[14px] font-black flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--border-color)] transition-all">2</button>
          <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-[14px] font-black flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--border-color)] transition-all">3</button>
          <span className="text-[var(--text-muted)] text-[14px] font-black mx-1">...</span>
          <button className="w-[36px] h-[36px] rounded-[10px] border-[2.5px] border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] text-[14px] font-black flex items-center justify-center hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_var(--border-color)] transition-all">356</button>
          <button className="p-[6px] text-[var(--text-muted)] hover:text-[var(--text-color)]"><ChevronRight className="w-6 h-6" strokeWidth={2.5} /></button>
        </div>
      </div>
    </div>
  );
}
