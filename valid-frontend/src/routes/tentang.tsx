// HALAMAN: C:\laragon\www\valid-react\src\routes\tentang.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router';
import { Tentang } from '@/components/valid/Tentang';

export const Route = createFileRoute('/tentang')({
  component: TentangPage,
});

function TentangPage() {
  return <Tentang />;
}
