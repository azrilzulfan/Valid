// src/components/portfolio/EditProjectModal.tsx
import { AnimatePresence, motion, Variants } from "framer-motion";
import { X, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, KeyboardEvent } from "react";
import { portfolioApi } from "../../lib/api";

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onSuccess: () => void;
}

const inputClass =
  "w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[0.875rem] px-[14px] py-[11px] font-bold text-[13px] text-[var(--text-color)] focus:outline-none focus:border-blue-500 transition-all placeholder:text-[var(--text-muted)]/40 disabled:opacity-50";
const labelClass =
  "block font-black text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-[6px]";

export function EditProjectModal({ isOpen, onClose, project, onSuccess }: EditProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vocationField, setVocationField] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (project && isOpen) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setVocationField(project.vocationField || "");
      setRepositoryUrl(project.repositoryUrl || "");
      setTags(project.tags || project.skills || []);
      setFile(null);
      setSaved(false);
    }
  }, [project, isOpen]);

  const handleKeyDownTags = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const cleanTag = tagInput.trim().toUpperCase();
      if (!tags.includes(cleanTag) && tags.length < 5) setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  const removeTag = (i: number) => setTags(tags.filter((_, idx) => idx !== i));

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !repositoryUrl.trim()) {
      alert("Judul, Deskripsi, dan Link Repository wajib diisi!");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("vocationField", vocationField || "Umum");
      formData.append("repositoryUrl", repositoryUrl.trim());
      formData.append("tags", JSON.stringify(tags));
      if (file) formData.append("files", file);

      await portfolioApi.updatePortfolio(project.portfolioId || project.id, formData);
      setSaved(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 900);
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui proyek.");
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100]"
            onClick={!isSubmitting ? onClose : undefined}
          />

          {/* MODAL */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[560px] bg-[var(--card-bg)] border-[3px] border-[var(--border-color)] shadow-[8px_8px_0px_var(--shadow-color)] rounded-[1.75rem] z-[101] overflow-hidden"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {/* HEADER BAR */}
            <div className="flex items-center justify-between px-[28px] py-[20px] border-b-[2.5px] border-[var(--border-color)]">
              <h2
                className="font-black text-[20px] text-[var(--text-color)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                Edit Proyek
              </h2>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-a)] transition-colors disabled:opacity-40"
              >
                <X className="w-5 h-5 text-[var(--text-muted)]" />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleUpdate} className="px-[28px] py-[22px] flex flex-col gap-[14px]">

              {/* Judul */}
              <div>
                <label className={labelClass}>Judul Proyek</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  required
                  disabled={isSubmitting}
                  placeholder="Contoh: Otomatisasi Lengan Robot Produksi"
                  className={inputClass}
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className={labelClass}>Deskripsi Proyek</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                  disabled={isSubmitting}
                  placeholder="Jelaskan kontribusimu, masalah yang diselesaikan, dan hasil proyek..."
                  className={inputClass + " resize-none"}
                />
              </div>

              {/* Bidang Vokasi + Link — dua kolom */}
              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <label className={labelClass}>Bidang Vokasi</label>
                  <input
                    value={vocationField}
                    onChange={(e) => setVocationField(e.target.value)}
                    type="text"
                    disabled={isSubmitting}
                    placeholder="Cth: Otomasi Industri"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Link Repository / Proyek</label>
                  <input
                    value={repositoryUrl}
                    onChange={(e) => setRepositoryUrl(e.target.value)}
                    type="url"
                    required
                    disabled={isSubmitting}
                    placeholder="https://github.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className={labelClass}>Tech Stack / Keahlian</label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mb-[8px]">
                    {tags.map((tag, idx) => (
                      <span
                        key={tag}
                        className="bg-blue-50 border-[2px] border-blue-500 text-blue-700 rounded-full px-[10px] py-[3px] font-black text-[10px] uppercase tracking-widest flex items-center gap-1"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} disabled={isSubmitting} className="hover:text-red-500 cursor-pointer">
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
                  placeholder={tags.length >= 5 ? "Maks. 5 keahlian" : "Ketik skill lalu tekan Enter"}
                  className={inputClass}
                  disabled={tags.length >= 5 || isSubmitting}
                />
              </div>

              {/* Upload File */}
              <div>
                <label className={labelClass}>Ganti Header Gambar (Opsional)</label>
                <input id="edit-file-input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} disabled={isSubmitting} accept="image/*" className="hidden" />
                <label
                  htmlFor="edit-file-input"
                  className={`flex items-center gap-[12px] w-full border-[2.5px] border-dashed border-[var(--border-color)] rounded-[0.875rem] px-[16px] py-[12px] transition-colors ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500 hover:bg-blue-50/50"}`}
                >
                  <div className="w-9 h-9 rounded-[8px] bg-[var(--bg-a)] border-[2px] border-[var(--border-color)] flex items-center justify-center shrink-0">
                    <UploadCloud className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-[11px] text-[var(--text-color)] uppercase tracking-wide truncate">
                      {file ? file.name : "Klik atau seret file gambar"}
                    </p>
                    <p className="font-bold text-[10px] text-[var(--text-muted)] mt-[1px]">JPG, PNG (maks. 10MB) — kosongkan jika tidak diganti</p>
                  </div>
                </label>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-[12px] pt-[4px]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] text-[var(--text-color)] rounded-[0.875rem] py-[12px] font-black text-[12px] uppercase tracking-wider hover:border-slate-900 hover:shadow-[3px_3px_0px_var(--shadow-color)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || saved}
                  className="flex-1 bg-blue-600 border-[2.5px] border-slate-900 text-white rounded-[0.875rem] py-[12px] font-black text-[12px] uppercase tracking-wider shadow-[3px_3px_0px_#0f172a] hover:shadow-[5px_5px_0px_#0f172a] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:shadow-none disabled:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      Tersimpan!
                    </>
                  ) : isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
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
