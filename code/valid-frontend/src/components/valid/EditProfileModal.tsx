// HALAMAN: C:\laragon\www\valid-react\src\components\valid\EditProfileModal.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Camera } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { usersApi } from '../../lib/api';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slideOverVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { x: '100%', opacity: 0, transition: { type: 'tween', duration: 0.3 } }
};

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Pre-fill with localStorage data quickly
      try {
        const stored = localStorage.getItem('valid_user');
        if (stored) {
          const user = JSON.parse(stored);
          setDisplayName(user.displayName || '');
          setHeadline(user.vocationField || '');
          setBio(user.bio || '');
        }
      } catch (e) {}

      // Fetch fresh data
      usersApi.getProfile()
        .then(res => {
          if (res) {
            setDisplayName(res.displayName || '');
            setHeadline(res.vocationField || '');
            setBio(res.bio || '');
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await usersApi.updateProfile({
        displayName,
        vocationField: headline,
        bio
      });
      // Update local storage
      const stored = localStorage.getItem('valid_user');
      if (stored) {
        const user = JSON.parse(stored);
        localStorage.setItem('valid_user', JSON.stringify({ ...user, ...updated }));
      }
      onClose();
      // Optional reload to reflect changes in sidebar
      window.location.reload();
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Gagal menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
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
            variants={slideOverVariants} initial="hidden" animate="visible" exit="exit"
            className="fixed top-0 right-0 w-full sm:w-[460px] h-screen bg-[var(--card-bg)] border-l-[3.5px] border-slate-900 shadow-[-8px_0px_0px_rgba(0,0,0,0.1)] p-[32px] sm:p-[40px] z-[101] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-[32px]">
              <h2 className="font-black text-[24px] text-[var(--text-color)] uppercase tracking-tight" style={{ fontFamily: 'var(--font-impact)' }}>EDIT PROFIL</h2>
              <button onClick={onClose} className="p-2 hover:bg-[var(--bg-a)] rounded-full transition-colors border-[2px] border-transparent hover:border-slate-900">
                <X className="w-6 h-6 text-[var(--text-muted)] hover:text-slate-900" />
              </button>
            </div>

            <div className="flex flex-col gap-[24px]">
              {/* UPLOAD FOTO PROFIL (NEO-BRUTALIST) */}
              <div className="flex flex-col items-center mb-[8px]">
                <div className="relative group cursor-pointer mb-[12px]">
                  <div className="w-[120px] h-[120px] rounded-full border-[3px] border-[var(--border-color)] bg-blue-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_var(--shadow-color)] transition-transform group-hover:scale-105 group-hover:shadow-[6px_6px_0px_var(--shadow-color)]">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-black text-[48px] text-blue-600 uppercase" style={{ fontFamily: 'var(--font-impact)' }}>{displayName.charAt(0) || 'U'}</span>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                      <Camera className="w-[32px] h-[32px] text-white mb-1" />
                      <span className="font-black text-[10px] text-white uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>Ubah Foto</span>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="font-bold text-[11px] text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-body)' }}>JPG atau PNG maksimal 5MB</p>
              </div>

              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>NAMA LENGKAP</label>
                <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all" style={{ fontFamily: 'var(--font-body)' }} />
              </div>
              
              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>HEADLINE</label>
                <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all" style={{ fontFamily: 'var(--font-body)' }} />
              </div>

              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>BIO</label>
                <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Ceritakan tentang dirimu..." className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all resize-none placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
              </div>

              <div>
                <label className="block font-black text-[11px] text-[var(--text-muted)] uppercase tracking-widest mb-[8px]" style={{ fontFamily: 'var(--font-body)' }}>KEAHLIAN (TAGS)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs text-[var(--text-muted)] font-bold">Fitur tag keahlian sedang dalam pengembangan.</span>
                </div>
                <input type="text" placeholder="Tambah keahlian baru..." className="w-full bg-[var(--bg-a)] border-[2.5px] border-[var(--border-color)] rounded-[1rem] px-[16px] py-[14px] font-bold text-[14px] text-[var(--text-color)] focus:outline-none focus:border-blue-600 focus:shadow-[4px_4px_0px_#2563EB] transition-all placeholder:text-[var(--text-muted)]/50" style={{ fontFamily: 'var(--font-body)' }} />
              </div>
            </div>

            <button onClick={handleSave} disabled={loading} className="w-full mt-[40px] bg-blue-600 border-[3px] border-slate-900 text-white rounded-[1rem] py-[16px] font-black text-[14px] uppercase tracking-wider shadow-[4px_4px_0px_#0f172a] hover:shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ fontFamily: 'var(--font-body)' }}>
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
