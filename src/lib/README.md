# Panduan Struktur Frontend & API

Dokumen ini menjelaskan struktur folder, cara kerja autentikasi, serta cara penggunaan API pada proyek ini.

## Struktur Folder

- `routes/`: Menangani struktur *routing* URL otomatis menggunakan TanStack Router. File di sini menentukan rute halaman.
- `pages/`: Berisi komponen-komponen halaman utama (view) yang dipanggil oleh file rute.
- `components/`: Berisi komponen-komponen *reusable* (seperti UI, bagian dari halaman, card, dsb) yang dapat digunakan berulang di berbagai halaman.
- `lib/`: Berisi berbagai *helper* dan pengelolaan API (`api.ts`, `auth.ts`, dll).

## Cara Kerja Autentikasi (Login)

1. Pengguna login menggunakan **Firebase Authentication**.
2. Setelah sukses login, kita mendapatkan **token Firebase**.
3. Token tersebut disimpan ke `localStorage` (dengan *key* `valid_firebase_token`) menggunakan fungsi di `auth.ts` (`saveToken`).
4. Saat frontend memanggil API ke backend (contohnya `usersApi.getProfile()`), file `api.ts` akan otomatis membaca token dari `localStorage` dan mengirimkannya pada *header* `Authorization` agar backend bisa memvalidasi pengguna.

## Cara Menggunakan `api.ts`

File `api.ts` memusatkan semua panggilan API. Fungsi-fungsinya sudah diekspor per grup, seperti `dashboardApi`, `usersApi`, dsb. 

Contoh penggunaannya pada halaman React:
```typescript
import { useEffect, useState } from 'react';
import { dashboardApi } from '../lib/api';

function MyDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await dashboardApi.getCandidateDashboard();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data", error);
      }
    }
    loadData();
  }, []);

  return <div>{data ? data.name : "Loading..."}</div>;
}
```

## Daftar Halaman dan Rute

Berikut adalah daftar rute/URL halaman dan keterangan aksesnya:

### Halaman Publik (Tidak Butuh Login)
- `/` - Beranda (Landing Page)
- `/login` - Halaman Login
- `/register` - Halaman Pendaftaran (Sign up)
- `/explore` - Eksplorasi kandidat / portofolio
- `/about` - Halaman Tentang Kami
- `/badge/$id` - Verifikasi Badge Publik

### Halaman Terproteksi (Butuh Login)
- `/dashboard` - Dashboard pengguna
- `/portfolio` - Kelola dan lihat portofolio pribadi
- `/interview` - Simulator wawancara AI
- `/profile` - Pengaturan profil pengguna
- `/admin/*` - Halaman admin (Dashboard, Verifikasi, Users, dll)

*(Catatan: Rute dapat berubah menyesuaikan pengaturan pada `routeTree.gen.ts` dan konfigurasi autentikasi pada TanStack Router)*
