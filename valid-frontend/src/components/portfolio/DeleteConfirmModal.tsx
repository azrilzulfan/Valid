// src/components/portfolio/DeleteConfirmModal.tsx
// FUNGSI: Menampilkan modal konfirmasi bergaya neo-brutalist sebelum menghapus proyek

import { AnimatePresence, motion, Variants } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  projectName: string;
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, projectName }: DeleteConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            onClick={!isSubmitting ? onClose : undefined}
          />

          {/* MODAL BODY */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[420px] bg-[var(--card-bg)] border-[3px] border-slate-900 shadow-[8px_8px_0px_#ef4444] rounded-[2rem] p-[32px] z-[101] text-center"
          >
            {/* ICON */}
            <div className="w-[64px] h-[64px] rounded-full bg-red-100 border-[2.5px] border-red-600 flex items-center justify-center shadow-[4px_4px_0px_#ef4444] mx-auto mb-[20px]">
              <AlertTriangle className="w-[32px] h-[32px] text-red-600 animate-pulse" />
            </div>

            {/* HEAD */}
            <h2
              className="font-black text-[22px] text-[var(--text-color)] uppercase tracking-tight mb-[12px]"
              style={{ fontFamily: "var(--font-impact)" }}
            >
              Hapus Proyek?
            </h2>

            {/* CONTENT */}
            <p
              className="font-bold text-[13px] text-[var(--text-muted)] leading-relaxed mb-[28px]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Apakah Anda yakin ingin menghapus proyek <span className="text-red-600">"{projectName}"</span>? Tindakan ini tidak dapat dibatalkan dan semua data beserta file bukti kerja akan dihapus secara permanen.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex gap-[16px]">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-[1rem] py-[12px] font-black text-[13px] uppercase tracking-wider hover:border-slate-900 hover:shadow-[3px_3px_0px_#0f172a] transition-all disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="flex-1 bg-red-600 border-[2.5px] border-slate-900 text-white rounded-[1rem] py-[12px] font-black text-[13px] uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#ef4444] hover:-translate-y-0.5 transition-all disabled:bg-red-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
