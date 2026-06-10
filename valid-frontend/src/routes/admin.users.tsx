// HALAMAN: C:\laragon\www\valid-react\src\routes\admin.users.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router';
import { AdminUsers } from '../pages/admin/AdminUsers';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsers,
});
