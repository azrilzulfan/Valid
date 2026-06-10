// HALAMAN: lib/api.ts
// FUNGSI: Mengelola semua pemanggilan API (fetch) ke server backend.
// API YANG DIBUTUHKAN: - (berisi definisi semua fungsi API)
// DUMMY DATA: -

import { getToken } from "./auth";

const BASE_URL = "http://localhost:5050";

// Helper function untuk menangani response dari fetch
// Jika tidak ok, maka akan mengambil pesan error dari response body jika ada
const handleRes = async (res: Response) => {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Body tidak berupa JSON, tetap lemparkan error awal
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

// Helper function untuk membuat header request (termasuk token jika diperlukan)
const getHeaders = (isPublic = false, isFormData = false): HeadersInit => {
  const headers: HeadersInit = {};

  // Untuk FormData, biarkan browser yang menetapkan Content-Type secara otomatis
  // agar boundary untuk form-data diatur dengan benar.
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Jika bukan endpoint publik, tambahkan Authorization header jika token tersedia
  if (!isPublic) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// ==========================================
// AUTH API
// ==========================================
export const authApi = {
  // Mendaftarkan pengguna baru ke backend
  // Mengembalikan data pengguna yang baru terdaftar
  register: async (data: {
    uid: string;
    email: string;
    displayName: string;
    vocationField: string;
  }) => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Login pengguna (token otentikasi dikirim di header)
  // Mengembalikan data sesi pengguna dari backend
  login: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Mengambil informasi pengguna yang sedang login saat ini
  // Mengembalikan profil pengguna
  me: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Melakukan proses logout pengguna dari backend
  // Mengembalikan pesan atau status sukses logout
  logout: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleRes(res);
  },
};

// ==========================================
// USERS API
// ==========================================
export const usersApi = {
  // Mendapatkan detail profil pengguna
  // Mengembalikan objek profil
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Memperbarui informasi pada profil pengguna
  // Mengembalikan profil terbaru yang sudah diperbarui
  updateProfile: async (data: {
    displayName?: string;
    vocationField?: string;
    bio?: string;
    location?: string;
    phoneNumber?: string;
  }) => {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Mengambil daftar riwayat aktivitas dari pengguna terkait
  // Mengembalikan array riwayat aktivitas
  getActivity: async () => {
    const res = await fetch(`${BASE_URL}/api/users/activity`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },
};

// ==========================================
// PORTFOLIO API
// ==========================================
export const portfolioApi = {
  // Mengunggah portofolio (termasuk file)
  // Harus menggunakan FormData untuk mengirim form multipart
  // Mengembalikan data portofolio yang telah diunggah
  upload: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/upload`, {
      method: "POST",
      headers: getHeaders(false, true), // isPublic = false, isFormData = true
      body: formData,
    });
    return handleRes(res);
  },

  // Mengambil daftar portofolio milik pengguna yang sedang login
  // Mengembalikan array portofolio
  getMyPortfolios: async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Mengambil semua portofolio yang membutuhkan peninjauan (pending)
  // Mengembalikan array portofolio (biasanya digunakan oleh reviewer)
  getPendingReviews: async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/review/pending`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Mendapatkan rincian sebuah portofolio spesifik berdasarkan ID
  // Mengembalikan objek detail portofolio
  getPortfolioById: async (portfolioId: string) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Mengirimkan hasil peninjauan dan nilai untuk sebuah portofolio
  // Mengembalikan detail hasil peninjauan
  reviewPortfolio: async (
    portfolioId: string,
    data: {
      technicalAccuracy: number;
      processDocumentation: number;
      originality: number;
      feedback: string;
    },
  ) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/review/${portfolioId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },
};

// ==========================================
// INTERVIEW API
// ==========================================
export const interviewApi = {
  // Memulai sesi wawancara untuk bidang keahlian (vocationField) tertentu
  // Mengembalikan sessionId
  start: async (data: { vocationField: string }) => {
    const res = await fetch(`${BASE_URL}/api/interview/start`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Meminta pertanyaan wawancara pada nomor urut tertentu dari sesi terkait
  // Mengembalikan questionId dan questionText
  getQuestion: async (data: { sessionId: string; questionNumber: number }) => {
    const res = await fetch(`${BASE_URL}/api/interview/question`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Menyimpan teks jawaban untuk suatu pertanyaan
  // Mengembalikan status sukses pengiriman jawaban
  submitAnswer: async (data: {
    sessionId: string;
    questionId: string;
    answerText: string;
    durationSeconds: number;
  }) => {
    const res = await fetch(`${BASE_URL}/api/interview/answer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Mengirim log analitik wawancara (seperti ekspresi wajah, performa suara)
  // Mengembalikan status sukses pencatatan log
  sendAnalysisLog: async (data: {
    sessionId: string;
    faceData: { dominantExpression: string; eyeContactScore: number; headPostureScore: number };
    voiceData: { wordsPerMinute: number; pauseDuration: number; volumeVariation: number };
  }) => {
    const res = await fetch(`${BASE_URL}/api/interview/analysis`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Menyelesaikan sesi wawancara secara keseluruhan
  // Mengembalikan rincian skor performa dan feedback evaluasi
  complete: async (data: { sessionId: string }) => {
    const res = await fetch(`${BASE_URL}/api/interview/complete`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Mengambil hasil keseluruhan atau ringkasan dari sesi wawancara
  // Mengembalikan data hasil wawancara
  getResult: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}/api/interview/result/${sessionId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Mengambil riwayat dari sesi-sesi wawancara yang pernah dilakukan sebelumnya
  // Mengembalikan array riwayat wawancara
  getHistory: async () => {
    const res = await fetch(`${BASE_URL}/api/interview/history`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },
};

// ==========================================
// DASHBOARD API
// ==========================================
export const dashboardApi = {
  // Mendapatkan profil dan ringkasan angka statistik untuk akun kandidat
  // Mengembalikan profil dan objek summary (totalInterviews, avgBehavioralScore, dll)
  getCandidateDashboard: async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/candidate`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Mendapatkan ringkasan aktivitas untuk akun peninjau (reviewer)
  // Mengembalikan metrik-metrik dari sudut pandang peninjau
  getReviewerDashboard: async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/reviewer`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // [PUBLIC API] Mendapatkan statistik keseluruhan untuk ditampilkan di halaman depan (landing page)
  // Karena merupakan publik, request tidak menggunakan autentikasi header (Authorization)
  // Mengembalikan data statistik umum platform
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`, {
      method: "GET",
      headers: getHeaders(true), // isPublic = true
    });
    return handleRes(res);
  },
};

// ==========================================
// BADGE API
// ==========================================
export const badgeApi = {
  // Menerbitkan lencana pencapaian (badge) baru
  // Mengembalikan objek lencana yang telah diterbitkan
  issueBadge: async (data: { sessionId: string; portfolioId: string }) => {
    const res = await fetch(`${BASE_URL}/api/badge/issue`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  // Mendapatkan daftar lencana yang dimiliki oleh pengguna
  // Mengembalikan array lencana pengguna
  getMyBadges: async () => {
    const res = await fetch(`${BASE_URL}/api/badge/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Membaca rincian dari suatu lencana spesifik
  // Mengembalikan detail dari sebuah lencana
  getBadgeDetail: async (badgeId: string) => {
    const res = await fetch(`${BASE_URL}/api/badge/detail/${badgeId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // [PUBLIC API] Memverifikasi apakah kode lencana tertentu adalah asli atau valid
  // Karena merupakan publik, tidak menggunakan autentikasi header
  // Mengembalikan keabsahan data lencana dari sistem
  verifyBadge: async (verificationCode: string) => {
    const res = await fetch(`${BASE_URL}/api/badge/verify/${verificationCode}`, {
      method: "GET",
      headers: getHeaders(true), // isPublic = true
    });
    return handleRes(res);
  },
};

// ==========================================
// NOTIFICATIONS API
// ==========================================
export const notificationsApi = {
  // Mendapatkan semua daftar notifikasi sekaligus jumlah yang belum terbaca
  // Mengembalikan objek berisi { notifications, unreadCount }
  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}/api/notifications`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Menandai seluruh daftar notifikasi sebagai telah dibaca
  // Mengembalikan status sukses penandaan
  readAll: async () => {
    const res = await fetch(`${BASE_URL}/api/notifications/read-all`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Menandai notifikasi pada satu ID spesifik sebagai telah dibaca
  // Mengembalikan status sukses perubahan spesifik notifikasi
  readNotification: async (notificationId: string) => {
    const res = await fetch(`${BASE_URL}/api/notifications/${notificationId}/read`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleRes(res);
  },
};

// ==========================================
// PAYMENT API
// ==========================================
export const paymentApi = {
  createPayment: async (data: { verifierUid: string; portfolioId: string }) => {
    const res = await fetch(`${BASE_URL}/api/payment/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },
  getPaymentStatus: async (orderId: string) => {
    const res = await fetch(`${BASE_URL}/api/payment/status/${orderId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },
  getMyPayments: async () => {
    const res = await fetch(`${BASE_URL}/api/payment/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },
};
