// src/components/valid/EditProfileModal.tsx
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera } from "lucide-react";
import React, { useState, useEffect } from "react";
import { usersApi } from "../../lib/api";
import { useCurrentUser } from "../../lib/useCurrentUser";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slideOverVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
  exit: { x: "100%", opacity: 0, transition: { type: "tween", duration: 0.3 } },
};

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, reload } = useCurrentUser();
  const [displayName, setDisplayName] = useState("");
  const [vocationField, setVocationField] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setVocationField(user.vocationField || "");
      setBio((user as any).bio || "");
      setLocation((user as any).location || "");
      setPhoneNumber((user as any).phoneNumber || "");
    }
  }, [user, isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await usersApi.updateProfile({
        displayName,
        vocationField,
        bio,
        location,
        phoneNumber,
      });
      // Update localStorage
      const stored = localStorage.getItem("valid_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "valid_user",
          JSON.stringify({ ...parsed, displayName, vocationField, bio, location, phoneNumber }),
        );
      }
      reload();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan");
    } finally {
      setIsLoading(false);
    }
  };

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            variants={slideOverVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 w-full sm:w-[460px] h-screen bg-[var(--card-bg)] border-l-[3.5px] border-slate-900 shadow-[-8px_0px_0px_rgba(0,0,0,0.1)] p-[32px] sm:p-[40px] z-[101] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-[32px]">
              <h2
                className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight"
                style={{ fontFamily: "var(--font-impact)" }}
              >
                EDIT PROFIL
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-a)] rounded-full transition-colors border-[2px] border-transparent hover:border-slate-900"
              >
                <X className="w-6 h-6 text-[var(--text-muted)] hover:text-slate-900" />
              </button>
            </div>

            <div className="flex flex-col gap-[24px]">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-[8px]">
                <div className="relative group cursor-pointer mb-[12px]">
                  <div className="w-[120px] h-[120px] rounded-full border-[3px] border-[var(--border-color)] bg-blue-100 dark:bg-slate-800 flex items-center justify-center shadow-[4px_4px_0px_var(--shadow-color)]">
                    <span
                      className="font-black text-[48px] text-blue-600"
                      style={{ fontFamily: "var(--font-impact)" }}
                    >
                      {initial}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  NAMA LENGKAP
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  BIDANG VOKASI
                </label>
                <select
                  value={vocationField}
                  onChange={(e) => setVocationField(e.target.value)}
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 transition-all appearance-none"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option value="">Pilih Bidang</option>
                  <option value="teknik">Teknik</option>
                  <option value="kesehatan">Kesehatan</option>
                  <option value="hospitality">Hospitality</option>
                  <option value="teknologi_informasi">Teknologi Informasi</option>
                  <option value="bisnis">Bisnis</option>
                </select>
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  BIO
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ceritakan tentang dirimu..."
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all resize-none placeholder:text-[var(--text-muted)]/50"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  LOKASI
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Jakarta, Indonesia"
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              <div>
                <label
                  className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  NO. TELEPON
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all"
                  style={{ fontFamily: "var(--font-body)" }}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-[2px] border-red-500 rounded-xl p-3 text-red-700 font-bold text-sm">
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full mt-[40px] bg-blue-600 border-[3px] border-slate-900 text-white rounded-[1rem] py-[16px] font-black text-[14px] uppercase tracking-wider shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all disabled:opacity-50"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
