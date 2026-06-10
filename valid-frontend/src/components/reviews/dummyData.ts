// HALAMAN: C:\laragon\www\valid-react\src\components\reviews\dummyData.ts
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

// TODO: ganti dengan API call dari backend (contoh: dashboardApi.getStats() atau usersApi.getProfile())
export const DUMMY_REVIEWS = [
  {
    id: 1,
    status: 'SELESAI',
    project: 'Mesin Las MIG Otomatis',
    reviewerName: 'Budi Santoso',
    price: 50,
    score: 78,
    date: '10 Apr 2026',
    feedback: 'Rizky menunjukkan penguasaan teknik pengelasan yang solid. Kontak mata yang baik mencerminkan kepercayaan diri yang memadai. Area yang perlu ditingkatkan adalah kecepatan bicara yang terkadang terlalu cepat saat menjelaskan proses teknis.',
    verifiedSkills: ['PENGELASAN TERVERIFIKASI', 'CNC MACHINING TERVERIFIKASI'],
    rating: 4,
    gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)'
  },
  {
    id: 2,
    status: 'MENUNGGU',
    project: 'Sistem Quality Control',
    reviewerName: 'Siti Rahayu',
    price: 40,
    score: null,
    date: '23 Mei 2026',
    gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)'
  },
  {
    id: 3,
    status: 'DITERIMA',
    project: 'Desain Jig & Fixture',
    reviewerName: 'Ahmad Fauzi',
    price: 60,
    score: null,
    date: '20 Mei 2026',
    gradient: 'linear-gradient(135deg, #059669, #047857)'
  },
  {
    id: 4,
    status: 'SELESAI',
    project: 'Laporan Magang Industri',
    reviewerName: 'Dewi Lestari',
    price: 35,
    score: 82,
    date: '2 Mar 2026',
    feedback: 'Laporan disusun dengan sangat sistematis. Semua poin penting selama magang terdokumentasi dengan baik. Kepercayaan diri saat mempresentasikan hasil juga sangat menonjol.',
    verifiedSkills: ['AKUNTANSI TERVERIFIKASI', 'AUDIT TERVERIFIKASI'],
    rating: 5,
    gradient: 'linear-gradient(135deg, #DC2626, #B91C1C)'
  },
  {
    id: 5,
    status: 'DITOLAK',
    project: 'Mesin Las MIG Otomatis',
    reviewerName: 'Ahmad Fauzi',
    price: 60,
    score: null,
    date: '15 Apr 2026',
    reason: 'Proyek di luar bidang keahlian saya.',
    gradient: 'linear-gradient(135deg, #059669, #047857)'
  }
];

export const STATUS_COLORS = {
  MENUNGGU: 'bg-yellow-400 border-yellow-600 text-yellow-900',
  DITERIMA: 'bg-blue-400 border-blue-600 text-blue-900',
  SELESAI: 'bg-green-400 border-green-600 text-green-900',
  DITOLAK: 'bg-red-400 border-red-600 text-red-900',
};

export const BAR_COLORS = {
  MENUNGGU: 'bg-yellow-400',
  DITERIMA: 'bg-blue-500',
  SELESAI: 'bg-green-500',
  DITOLAK: 'bg-red-500',
};
