// HALAMAN: C:\laragon\www\valid-react\src\routes\admin.coins.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router';
import { AdminCoins } from '../pages/admin/AdminCoins';

export const Route = createFileRoute('/admin/coins')({
  component: AdminCoins,
});
