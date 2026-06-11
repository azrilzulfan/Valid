// HALAMAN: C:\laragon\www\valid-react\src\components\professionals\dummyData.ts
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

// TODO: ganti dengan API call dari backend (contoh: dashboardApi.getStats() atau usersApi.getProfile())
export const DUMMY_PROFESSIONALS = [
  {
    id: 1,
    name: 'Budi Santoso',
    headline: 'Ahli Teknik Mesin · 12 Tahun Pengalaman',
    skills: ['PENGELASAN', 'CNC', 'QUALITY CONTROL'],
    rating: 4.8,
    reviews: 23,
    price: 50,
    gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
    about: 'Saya adalah praktisi teknik mesin dengan lebih dari 12 tahun pengalaman di industri manufaktur otomotif. Fokus utama saya adalah optimasi proses produksi dan memastikan standar mutu (QA/QC) sesuai spesifikasi ISO. Saya juga asesor tersertifikasi BNSP untuk bidang pengelasan dan permesinan dasar.',
    experience: [
      { role: 'QA/QC Manager', company: 'PT Astra Otoparts', year: '2018 - Sekarang' },
      { role: 'Senior CNC Engineer', company: 'PT Toyota Motor', year: '2012 - 2018' }
    ],
    verified_projects: 145,
    user_reviews: [
      { name: 'Andi M.', text: 'Review yang diberikan sangat detail, terutama di bagian efisiensi material. Sangat membantu!' },
      { name: 'Rina S.', text: 'Feedback nya membangun dan langsung bisa diimplementasikan di proyek akhir kuliah saya.' }
    ]
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    headline: 'Senior Desainer Grafis · Bersertifikasi Adobe',
    skills: ['DESAIN GRAFIS', 'BRANDING', 'UI DESIGN'],
    rating: 4.6,
    reviews: 17,
    price: 40,
    gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
    about: 'Desainer multi-disiplin yang berfokus pada perancangan identitas merek visual (Branding) dan pengalaman pengguna (UI/UX). Telah menangani lebih dari 50 klien UMKM hingga perusahaan multinasional. Tersertifikasi Adobe Creative Professional.',
    experience: [
      { role: 'Art Director', company: 'Matahari Creative Agency', year: '2020 - Sekarang' },
      { role: 'UI/UX Designer', company: 'Gojek Indonesia', year: '2017 - 2020' }
    ],
    verified_projects: 89,
    user_reviews: [
      { name: 'Dion W.', text: 'Sangat jeli melihat komposisi warna. Portofolio saya jadi terlihat lebih profesional berkat masukan Kak Siti.' },
      { name: 'Fani K.', text: 'Penjelasan mengenai hierarki tipografi sangat mudah dipahami.' }
    ]
  },
  {
    id: 3,
    name: 'Ahmad Fauzi',
    headline: 'Full-Stack Developer · 8 Tahun Pengalaman',
    skills: ['REACT', 'LARAVEL', 'POSTGRESQL'],
    rating: 4.9,
    reviews: 31,
    price: 60,
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    about: 'Software engineer spesialis pengembangan aplikasi web berskala enterprise. Berpengalaman merancang arsitektur microservices dan integrasi API yang kompleks. Aktif berkontribusi di komunitas open-source dan bersertifikasi arsitek cloud AWS.',
    experience: [
      { role: 'Lead Developer', company: 'Traveloka', year: '2021 - Sekarang' },
      { role: 'Backend Engineer', company: 'Tokopedia', year: '2016 - 2021' }
    ],
    verified_projects: 210,
    user_reviews: [
      { name: 'Kevin O.', text: 'Code review nya tajam! Bugs yang selama ini ga kelihatan berhasil ditemukan.' },
      { name: 'Yusuf A.', text: 'Sangat direkomendasikan untuk mereview struktur database relasional.' }
    ]
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    headline: 'Akuntan Publik Bersertifikasi',
    skills: ['AKUNTANSI', 'AUDIT', 'PERPAJAKAN'],
    rating: 4.7,
    reviews: 19,
    price: 35,
    gradient: 'linear-gradient(135deg, #DC2626, #B91C1C)',
    about: 'Lulusan terbaik jurusan Akuntansi yang kini menjabat sebagai auditor eksternal. Membantu berbagai startup dalam merapikan laporan keuangan dan memastikan kepatuhan pajak sesuai regulasi terbaru di Indonesia.',
    experience: [
      { role: 'Senior Auditor', company: 'PwC Indonesia', year: '2019 - Sekarang' },
      { role: 'Tax Consultant', company: 'KPMG', year: '2015 - 2019' }
    ],
    verified_projects: 112,
    user_reviews: [
      { name: 'Sinta P.', text: 'Membantu saya memahami kesalahan dalam pencatatan arus kas. Terima kasih banyak!' },
      { name: 'Bimo T.', text: 'Review mengenai perpajakan PPh 21 nya sangat komprehensif.' }
    ]
  }
];

export const DUMMY_PROJECTS = [
  { id: 1, name: 'Redesign Dashboard B2B' },
  { id: 2, name: 'Aplikasi Kasir UMKM' },
  { id: 3, name: 'Website Portofolio Fotografer' }
];
