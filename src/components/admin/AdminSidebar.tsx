// HALAMAN: C:\laragon\www\valid-react\src\components\admin\AdminSidebar.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { Link, useLocation } from '@tanstack/react-router';
import { LayoutDashboard, ShieldCheck, Users, Coins, LogOut } from 'lucide-react';

export function AdminSidebar() {
  const location = useLocation();

  const navLinks = [
    { label: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { label: 'Verifikasi BNSP', icon: ShieldCheck, path: '/admin/verify', badge: 3 },
    { label: 'Manajemen User', icon: Users, path: '/admin/users' },
    { label: 'Coin Ledger', icon: Coins, path: '/admin/coins' },
  ];

  return (
    <div className="fixed md:relative bottom-0 left-0 w-full md:w-[260px] h-[75px] md:h-screen bg-[var(--card-bg)] md:border-r-[3px] border-t-[3px] md:border-t-0 border-[var(--border-color)] flex md:flex-col z-50 md:z-auto transition-all shrink-0">
      
      {/* TOP: Logo */}
      <div className="hidden md:flex pt-[24px] pb-[20px] px-[24px] border-b-[3px] border-[var(--border-color)] bg-yellow-300 items-center justify-between">
        <div className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
          <span className="text-[#0F172A] text-[24px] font-extrabold tracking-[0.05em] leading-none" style={{ fontFamily: 'var(--font-impact)' }}>VALID</span>
        </div>
        <div className="w-[10px] h-[10px] bg-green-500 rounded-full border-[2px] border-[var(--border-color)] shadow-[2px_2px_0px_rgba(0,0,0,0.8)]"></div>
      </div>

      {/* USER INFO */}
      <div className="hidden md:flex items-center gap-3 py-[20px] px-[24px] border-b-[3px] border-[var(--border-color)] bg-[var(--bg-a)]">
        <div className="w-[44px] h-[44px] rounded-[14px] border-[2.5px] border-[var(--border-color)] bg-blue-200 flex items-center justify-center shadow-[3px_3px_0px_var(--shadow-color)]">
          <span className="font-black text-[20px] text-blue-700" style={{ fontFamily: 'var(--font-impact)' }}>A</span>
        </div>
        <div className="flex flex-col">
          <span className="font-black text-[15px] text-[var(--text-color)] leading-tight tracking-wide" style={{ fontFamily: 'var(--font-body)' }}>Administrator</span>
          <span className="font-bold text-[9px] uppercase tracking-widest text-[var(--text-muted)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>Super Admin</span>
        </div>
      </div>

      {/* NAV LINKS */}
      <div className="flex-1 flex md:flex-col flex-row w-full justify-start md:px-[16px] md:py-[24px] gap-2 md:gap-[10px] items-center md:items-stretch h-full overflow-x-auto md:overflow-y-auto px-4 py-2 scrollbar-hide">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path || location.pathname === link.path + '/';
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex md:flex-row flex-col items-center justify-center gap-1 md:gap-[14px] px-3 md:px-[18px] py-2 md:py-[12px] rounded-[1rem] cursor-pointer transition-all duration-300 relative shrink-0 ${
                isActive 
                  ? 'md:bg-[var(--text-color)] text-[var(--text-color)] md:text-[var(--bg-a)] md:border-[2.5px] md:border-[var(--border-color)] md:shadow-[4px_4px_0px_#FBBF24] md:-translate-y-0.5' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-color)] md:border-[2.5px] md:border-transparent md:hover:border-[var(--border-color)] md:hover:shadow-[4px_4px_0px_var(--shadow-color)] md:hover:-translate-y-0.5 md:hover:bg-[var(--card-bg)]'
              }`}
            >
              <link.icon className={`w-[22px] h-[22px] md:w-[20px] md:h-[20px] transition-transform ${isActive ? 'md:scale-110' : 'group-hover:scale-110'}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[9px] md:text-[13px] uppercase tracking-wider ${isActive ? 'font-black' : 'font-bold'}`} style={{ fontFamily: 'var(--font-body)' }}>
                {link.label}
              </span>
              
              {link.badge && (
                <span className="absolute top-1 right-2 md:static ml-auto flex items-center justify-center w-[16px] h-[16px] md:w-[18px] md:h-[18px] bg-[#FBBF24] text-[#0F172A] rounded-full text-[9px] md:text-[10px] font-black border-[1.5px] md:border-[2px] border-[var(--border-color)]">
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}

        {/* MOBILE LOGOUT */}
        <Link 
          to="/"
          className="flex md:hidden flex-col items-center justify-center gap-1 px-3 py-2 rounded-[1rem] cursor-pointer transition-all duration-300 shrink-0 text-[var(--text-muted)] hover:text-red-500"
        >
          <LogOut className="w-[20px] h-[20px] transition-transform group-hover:scale-110" strokeWidth={2} />
          <span className="text-[9px] uppercase tracking-wider font-bold" style={{ fontFamily: 'var(--font-body)' }}>
            Keluar
          </span>
        </Link>
      </div>

      {/* BOTTOM */}
      <div className="hidden md:flex flex-col p-[24px] border-t-[3px] border-[var(--border-color)] bg-[var(--bg-a)]">
        <Link 
          to="/"
          className="flex items-center justify-center gap-2 cursor-pointer group px-3 py-3 border-[2.5px] border-transparent hover:border-[var(--border-color)] rounded-xl transition-all hover:bg-[var(--card-bg)] hover:shadow-[4px_4px_0px_var(--shadow-color)]"
        >
          <LogOut className="w-[18px] h-[18px] text-[var(--text-muted)] group-hover:text-red-500 transition-colors" strokeWidth={2.5} />
          <span className="font-black text-[12px] uppercase tracking-widest text-[var(--text-muted)] group-hover:text-red-500 transition-colors" style={{ fontFamily: 'var(--font-body)' }}>Keluar</span>
        </Link>
      </div>

    </div>
  );
}
