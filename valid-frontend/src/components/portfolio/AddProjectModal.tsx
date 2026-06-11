// src/components/portfolio/AddProjectModal.tsx
// FUNGSI: Menampilkan modal form interaktif untuk mengunggah proyek baru (PERBAIKAN: Tombol Upload File Menggunakan Struktur Label htmlFor)
// API YANG DIBUTUHKAN: portfolioApi.upload

import { AnimatePresence, motion, Variants } from "framer-motion";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { portfolioApi } from "../../lib/api";

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vocationField, setVocationField] = useState("");

  // State manajemen dynamic tags/tech stack
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Menambahkan tag baru ketika menekan Enter
  const handleKeyDownTags = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const cleanTag = tagInput.trim().toUpperCase();
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput("");
    }
  };

  // Menghapus tag terpilih
  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Judul dan Deskripsi proyek wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("vocationField", vocationField || "Umum");
      formData.append("tags", JSON.stringify(tags));

      if (file) {
        formData.append("files", file);
      }

      await portfolioApi.upload(formData);

      alert("Proyek portofolio kamu berhasil disimpan!");

      // Reset form
      setTitle("");
      setDescription("");
      setVocationField("");
      setTags([]);
      setFile(null);

      onClose();
    } catch (err: any) {
      console.error("Gagal mengunggah proyek:", err);
      alert(err.message || "Gagal menyimpan proyek. Periksa ukuran file dan koneksi Anda.");
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[540px] max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] border-[3px] border-slate-900 shadow-[8px_8px_0px_#0f172a] rounded-[2rem] p-[32px] sm:p-[40px] z-[101]"
          >
            {/* HEAD */}
            <div className="flex justify-between items-center mb-[24px]">
              <h2
                className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                TAMBAH PROYEK
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-[var(--bg-a)] rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleUpload} className="flex flex-col gap-[20px]">
              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  JUDUL PROYEK
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Contoh: Otomatisasi Lengan Robot Produksi"
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50 disabled:opacity-60"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  DESKRIPSI PROYEK
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  disabled={isSubmitting}
                  placeholder="Jelaskan kontribusimu, masalah yang diselesaikan, dan hasil akhir proyek ini..."
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all resize-none placeholder:text-[var(--text-muted)]/50 disabled:opacity-60"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  BIDANG VOKASI / INDUSTRI
                </label>
                <input
                  value={vocationField}
                  onChange={(e) => setVocationField(e.target.value)}
                  type="text"
                  disabled={isSubmitting}
                  placeholder="Contoh: Otomasi Industri, Web Development, Desain"
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50 disabled:opacity-60"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  TECH STACK / KEAHLIAN YANG DIGUNAKAN
                </label>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, idx) => (
                      <span
                        key={tag}
                        className="bg-blue-100 border-[2px] border-blue-600 text-blue-700 rounded-full px-[12px] py-[4px] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-[2px_2px_0px_#2563EB]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(idx)}
                          disabled={isSubmitting}
                          className="focus:outline-none hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDownTags}
                  type="text"
                  placeholder={
                    tags.length >= 5
                      ? "Maksimal 5 keahlian"
                      : "Ketik skill (cth: REACT) lalu tekan Enter"
                  }
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-body)" }}
                  disabled={tags.length >= 5 || isSubmitting}
                />
              </div>

              {/* PERBAIKAN: SEKTOR INPUT FILE MENGGUNAKAN HTMLFOR LABEL */}
              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  UPLOAD MEDIA BUKTI KERJA
                </label>

                {/* Input disembunyikan total lewat CSS, tetapi dihubungkan via id="portfolio-file-upload" */}
                <input
                  id="portfolio-file-upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                  accept="image/*,video/*"
                  className="hidden"
                />

                {/* Elemen visual pembungkus diubah menjadi elemen <label> dengan atribut htmlFor */}
                <label
                  htmlFor="portfolio-file-upload"
                  className={`w-full bg-[var(--bg-a)] border-[2.5px] border-dashed border-[var(--border-color)] rounded-[1.5rem] p-[32px] flex flex-col items-center justify-center shadow-[2px_2px_0px_var(--shadow-color)] transition-colors group ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  }`}
                >
                  <div className="w-[64px] h-[64px] rounded-full bg-white dark:bg-slate-800 border-[2.5px] border-[var(--border-color)] flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)] group-hover:scale-110 transition-transform mb-[16px]">
                    <UploadCloud className="w-[28px] h-[28px] text-[var(--text-muted)] group-hover:text-blue-600" />
                  </div>
                  <span
                    className="font-black text-[13px] text-[var(--text-color)] uppercase tracking-wide text-center px-4 line-clamp-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {file ? file.name : "Klik atau seret file ke sini"}
                  </span>
                  <span
                    className="font-bold text-[11px] text-[var(--text-muted)] mt-[6px]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    JPG, PNG, MP4 (Maksimal 20MB)
                  </span>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-[16px] mt-[12px]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-[1rem] py-[14px] font-black text-[13px] uppercase tracking-wider hover:border-slate-900 hover:shadow-[3px_3px_0px_#0f172a] transition-all disabled:opacity-50"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 border-[2.5px] border-slate-900 text-white rounded-[1rem] py-[14px] font-black text-[13px] uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all disabled:bg-blue-400 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    "Simpan Proyek"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
