// HALAMAN: komponen/portfolio/AddProjectModal
// FUNGSI: Menampilkan modal form untuk menambahkan proyek baru ke portfolio
// API YANG DIBUTUHKAN: portfolioApi.upload
// DUMMY DATA: -

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { X, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { portfolioApi } from '../../lib/api';

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
};

export function AddProjectModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [vocationField, setVocationField] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('vocationField', vocationField || 'Umum');
      if (file) {
        formData.append('files', file);
      }
      await portfolioApi.upload(formData);
      onClose();
      window.location.reload(); // naive reload
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            variants={modalVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[540px] max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[2rem] p-[32px] sm:p-[40px] z-[101]"
          >
            <div className="flex justify-between items-center mb-[24px]">
              <h2 className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>TAMBAH PROYEK</h2>
              <button onClick={onClose} className="p-2 hover:bg-[var(--bg-a)] rounded-full transition-colors">
                <X className="w-6 h-6 text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="flex flex-col gap-[20px]">
              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>JUDUL PROYEK</label>
                <input value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Nama proyek kamu" className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
              </div>
              
              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>DESKRIPSI</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Jelaskan proyek ini secara singkat" className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all resize-none placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
              </div>

              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>TECH STACK</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 border-[2px] border-blue-600 text-blue-700 rounded-full px-[12px] py-[6px] font-black text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-[2px_2px_0px_#2563EB]" style={{ fontFamily: 'var(--font-body)' }}>
                    CNC <X className="w-3 h-3 cursor-pointer" />
                  </span>
                </div>
                <input value={vocationField} onChange={e => setVocationField(e.target.value)} type="text" placeholder="Ketik dan tekan Enter" className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
              </div>

              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>UPLOAD MEDIA</label>
                <div className="relative w-full bg-[var(--bg-a)] border-[2.5px] border-dashed border-[var(--border-color)] rounded-[1.5rem] p-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group">
                  <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="w-[64px] h-[64px] rounded-full bg-white dark:bg-slate-800 border-[2.5px] border-[var(--border-color)] flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)] group-hover:scale-110 transition-transform mb-[16px]">
                    <UploadCloud className="w-[28px] h-[28px] text-[var(--text-muted)] group-hover:text-blue-600" />
                  </div>
                  <span className="font-black text-[13px] text-[var(--text-color)] uppercase tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>{file ? file.name : "Klik atau seret file ke sini"}</span>
                  <span className="font-bold text-[11px] text-[var(--text-muted)] mt-[6px]" style={{ fontFamily: 'var(--font-body)' }}>JPG, PNG, MP4 hingga 20MB</span>
                </div>
              </div>
            </div>

            <div className="flex gap-[16px] mt-[32px]">
              <button onClick={onClose} className="flex-1 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-[1rem] py-[14px] font-black text-[13px] uppercase tracking-wider hover:border-slate-900 hover:shadow-[3px_3px_0px_#0f172a] transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                Batal
              </button>
              <button onClick={handleUpload} className="flex-1 bg-blue-600 border-[2.5px] border-slate-900 text-white rounded-[1rem] py-[14px] font-black text-[13px] uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all" style={{ fontFamily: 'var(--font-body)' }}>
                Simpan Proyek
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
