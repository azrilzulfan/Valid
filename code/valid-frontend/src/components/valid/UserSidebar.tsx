// HALAMAN: C:\laragon\www\valid-react\src\components\valid\UserSidebar.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { LayoutDashboard, FolderOpen, Mic, Star, Users, Coins, LogOut, Compass, Bell } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { EditProfileModal } from './EditProfileModal';
import { notificationsApi, usersApi } from '../../lib/api';
import { useLocation, useNavigate } from '@tanstack/react-router';

interface UserSidebarProps {
  activePath?: string;
}

export function UserSidebar({ activePath }: UserSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [coins, setCoins] = useState(0);
  
  useEffect(() => {
    notificationsApi.getNotifications().then(res => setNotifs(res?.notifications || [])).catch(() => {});
    usersApi.getProfile().then(res => setCoins(res?.coins || 0)).catch(() => {});
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;

  const handleOpenNotifs = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unreadCount > 0) {
      notificationsApi.readAll().catch(() => {});
      setNotifs(notifs.map(n => ({ ...n, read: true })));
    }
  };

  // Use location.pathname if activePath is not provided
  const currentPath = activePath || location.pathname;

  const navItems = [
    { icon: LayoutDashboard, label: 'Beranda', path: '/dashboard' },
    { icon: Compass, label: 'Jelajah', path: '/dashboard/explore' },
    { icon: FolderOpen, label: 'Portfolio', path: '/dashboard/portfolio' },
    { icon: Mic, label: 'Wawancara AI', path: '/dashboard/ai-interview' },
    { icon: Star, label: 'Review Saya', path: '/dashboard/reviews' },
    { icon: Users, label: 'Profesional', path: '/dashboard/professionals' },
    { icon: Coins, label: 'Koin', mobileHidden: true, path: '/dashboard/coins' }
  ];

  return (
    <>
      <div className="fixed md:relative bottom-0 left-0 w-full md:w-[240px] h-[75px] md:h-screen bg-[var(--card-bg)] md:border-r-[2.5px] border-t-[2.5px] md:border-t-0 border-[var(--border-color)] flex md:flex-col z-50 md:z-auto transition-all shrink-0 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] md:shadow-none">
        
        {/* TOP: Logo (Hidden on mobile) */}
        <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[2.5px] border-[var(--border-color)]">
          <img src="/logo.png" alt="VALID Logo" className="h-[36px] md:h-[40px] object-contain hover:scale-105 transition-transform cursor-pointer" onClick={() => window.location.href = '/'} />
        </div>

        {/* USER INFO (Hidden on mobile) - CLICKABLE FOR EDIT PROFILE */}
        <div className="hidden md:flex items-center justify-between border-b-[2.5px] border-[var(--border-color)] bg-[var(--bg-a)]">
          <div 
            onClick={() => setIsEditProfileOpen(true)}
            className="flex items-center gap-3 py-[20px] px-[24px] cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors group flex-1"
          >
            <div className="w-[40px] h-[40px] rounded-[12px] border-[2px] border-[var(--border-color)] bg-blue-100 flex items-center justify-center shadow-[3px_3px_0px_var(--border-color)] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_#2563EB] group-hover:border-blue-600 transition-all">
              <span className="font-black text-[18px] text-blue-600" style={{ fontFamily: 'var(--font-impact)' }}>R</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[14px] text-[var(--text-color)] leading-tight tracking-wide group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>{typeof window !== 'undefined' && localStorage.getItem('valid_user') ? JSON.parse(localStorage.getItem('valid_user')!).displayName || 'Pengguna' : 'Belum Login'}</span>
              <span className="font-bold text-[9px] uppercase tracking-widest text-[var(--text-muted)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>Pencari Kerja</span>
            </div>
          </div>
          
          <div className="pr-[16px] relative">
            <button onClick={handleOpenNotifs} className="p-2 relative hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-[var(--text-muted)] hover:text-[var(--text-color)]" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-a)]"></span>
              )}
            </button>
            {showNotifs && (
              <div className="absolute top-[100%] right-0 w-[280px] bg-[var(--card-bg)] border-[2.5px] border-[var(--border-color)] shadow-[4px_4px_0px_var(--shadow-color)] rounded-[1rem] p-[16px] z-50">
                <div className="font-black text-[12px] uppercase tracking-wider text-[var(--text-color)] mb-3" style={{ fontFamily: 'var(--font-body)' }}>Notifikasi</div>
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="text-[11px] text-[var(--text-muted)] text-center py-4">Belum ada notifikasi</div>
                  ) : (
                    notifs.map((n, i) => (
                      <div key={i} className="text-[11px] text-[var(--text-color)] border-b border-[var(--border-color)] pb-2 last:border-0 last:pb-0">
                        {n.message}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="flex-1 flex md:flex-col flex-row w-full justify-start md:px-[16px] md:py-[20px] gap-2 md:gap-[8px] items-center md:items-stretch h-full overflow-x-auto md:overflow-y-auto px-4 py-2 scrollbar-hide">
          {navItems.map((item, idx) => {
            // Check active status based on current path
            const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));
            
            return (
              <div 
                key={idx} 
                onClick={() => {
                  if (item.path) {
                    navigate({ to: item.path as any });
                  }
                }}
                className={`group flex md:flex-row flex-col items-center justify-center gap-1 md:gap-[12px] px-3 md:px-[16px] py-2 md:py-[10px] rounded-[1rem] cursor-pointer transition-all duration-300 relative shrink-0 ${item.mobileHidden ? 'hidden md:flex' : 'flex'} ${
                  isActive 
                    ? 'md:bg-blue-600 text-blue-600 md:text-white md:border-[2px] md:border-[var(--border-color)] md:shadow-[3px_3px_0px_var(--shadow-color)] md:-translate-y-0.5' 
                    : 'text-[var(--text-muted)] hover:text-[var(--text-color)] md:border-[2px] md:border-transparent md:hover:border-[var(--border-color)] md:hover:shadow-[3px_3px_0px_var(--shadow-color)] md:hover:-translate-y-0.5 md:hover:bg-[var(--card-bg)]'
                }`}
              >
                <item.icon className={`w-[20px] h-[20px] md:w-[18px] md:h-[18px] transition-transform ${isActive ? 'md:scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] md:text-[12px] uppercase tracking-wider ${isActive ? 'font-black' : 'font-bold'}`} style={{ fontFamily: 'var(--font-body)' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
          
          {/* MOBILE LOGOUT */}
          <div 
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('valid_firebase_token');
                localStorage.removeItem('valid_user');
                localStorage.removeItem('valid_role');
              }
              navigate({ to: '/' as any });
            }}
            className="flex md:hidden flex-col items-center justify-center gap-1 px-3 py-2 rounded-[1rem] cursor-pointer transition-all duration-300 shrink-0 text-[var(--text-muted)] hover:text-red-500"
          >
            <LogOut className="w-[20px] h-[20px] transition-transform group-hover:scale-110" strokeWidth={2} />
            <span className="text-[9px] uppercase tracking-wider font-bold" style={{ fontFamily: 'var(--font-body)' }}>
              Keluar
            </span>
          </div>
        </div>

        {/* BOTTOM: Coin Widget & Logout (Hidden on mobile) */}
        <div className="hidden md:flex flex-col p-[24px] border-t-[2.5px] border-[var(--border-color)] bg-[var(--bg-a)]">
          <div className="bg-yellow-300 border-[2px] border-slate-900 rounded-[1rem] p-[16px] shadow-[4px_4px_0px_#0f172a] transform -rotate-1 hover:rotate-0 transition-transform cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-[28px] h-[28px] bg-[var(--card-bg)] rounded-full border-[2px] border-[var(--border-color)] flex items-center justify-center">
                <Coins className="w-[16px] h-[16px] text-yellow-500" />
              </div>
              <div>
                <div className="flex items-end gap-1">
                  <span className="font-black text-[32px] text-slate-900 leading-none" style={{ fontFamily: 'var(--font-impact)' }}>{coins}</span>
                  <span className="font-black text-[12px] uppercase text-slate-800 tracking-widest mb-1" style={{ fontFamily: 'var(--font-body)' }}>koin</span>
                </div>
              </div>
            </div>
            <div className="font-black text-[11px] uppercase tracking-wider text-slate-900 mt-[12px] text-center border-t-[2px] border-[var(--border-color)]/20 pt-[10px] flex items-center justify-center gap-1 hover:text-blue-600 transition-colors">
              Tambah Koin
            </div>
          </div>
          
          <div onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('valid_firebase_token');
              localStorage.removeItem('valid_user');
              localStorage.removeItem('valid_role');
            }
            navigate({ to: '/' as any });
          }} className="flex items-center justify-center gap-2 mt-[20px] cursor-pointer group px-3 py-2 border-[2px] border-transparent hover:border-[var(--border-color)] rounded-lg transition-all">
            <LogOut className="w-[16px] h-[16px] text-[var(--text-muted)] group-hover:text-red-500 transition-colors" />
            <span className="font-black text-[11px] uppercase tracking-widest text-[var(--text-muted)] group-hover:text-red-500 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>Keluar</span>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
    </>
  );
}
