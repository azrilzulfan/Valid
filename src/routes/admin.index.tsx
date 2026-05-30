// HALAMAN: C:\laragon\www\valid-react\src\routes\admin.index.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router';
import { AdminOverview } from '../pages/admin/AdminOverview';

export const Route = createFileRoute('/admin/')({
  component: AdminOverview,
});
