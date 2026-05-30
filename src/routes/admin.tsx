// HALAMAN: C:\laragon\www\valid-react\src\routes\admin.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminToastProvider } from '../components/admin/AdminToast';

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminToastProvider>
      <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans relative">
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto relative pb-[100px] md:pb-[40px]">
          {/* Decorative Grid Background */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--shadow-color) 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
          
          <div className="relative z-10 w-full min-h-full p-[20px] md:p-[40px_48px]">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminToastProvider>
  );
}
