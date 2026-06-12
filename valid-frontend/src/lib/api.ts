// src/lib/api.ts
import { getToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const handleRes = async (res: Response) => {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData && (errorData.message || errorData.error)) {
        errorMessage = errorData.message || errorData.error;
      }
    } catch (e) {}
    throw new Error(errorMessage);
  }
  return res.json();
};

const getHeaders = (isPublic = false, isFormData = false): HeadersInit => {
  const headers: HeadersInit = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
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

  login: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  me: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

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
  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/api/users/profile`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

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

  getActivity: async () => {
    const res = await fetch(`${BASE_URL}/api/users/activity`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getPublicUserProfile: async (username: string) => {
    const res = await fetch(`${BASE_URL}/api/users/public/${encodeURIComponent(username)}`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleRes(res);
  },
};

// ==========================================
// PORTFOLIO API
// ==========================================
export const portfolioApi = {
  upload: async (formData: FormData) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/upload`, {
      method: "POST",
      headers: getHeaders(false, true),
      body: formData,
    });
    return handleRes(res);
  },

  getMyPortfolios: async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getPendingReviews: async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/review/pending`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getPublicPortfolios: async (vocationField?: string) => {
    const url = vocationField
      ? `${BASE_URL}/api/portfolio/public?vocationField=${vocationField}`
      : `${BASE_URL}/api/portfolio/public`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleRes(res);
  },

  getPortfolioById: async (portfolioId: string) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

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

  addComment: async (portfolioId: string, comment: string) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}/comment`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ comment }),
    });
    return handleRes(res);
  },

  likePortfolio: async (portfolioId: string) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}/like`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  submitVerifierReview: async (
    portfolioId: string,
    data: {
      technicalAccuracy: number;
      processDocumentation: number;
      originality: number;
      feedback: string;
    },
  ) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}/verify`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  getAssignedToMe: async () => {
    const res = await fetch(`${BASE_URL}/api/portfolio/assigned/me`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  updatePortfolio: async (portfolioId: string, formData: FormData) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}`, {
      method: "PUT",
      headers: getHeaders(false, true),
      body: formData,
    });
    return handleRes(res);
  },

  deletePortfolio: async (portfolioId: string) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/${portfolioId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getPortfoliosByUid: async (uid: string) => {
    const res = await fetch(`${BASE_URL}/api/portfolio/user/${uid}`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleRes(res);
  },
};

// ==========================================
// INTERVIEW API
// ==========================================
export const interviewApi = {
  start: async (data: { vocationField: string }) => {
    const res = await fetch(`${BASE_URL}/api/interview/start`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  getQuestion: async (data: { sessionId: string; questionNumber: number }) => {
    const res = await fetch(`${BASE_URL}/api/interview/question`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

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

  sendAnalysisLog: async (data: {
    sessionId: string;
    faceData?: { dominantExpression: string; eyeContactScore: number; headPostureScore: number };
    voiceData?: { wordsPerMinute: number; pauseDuration: number; volumeVariation: number };
  }) => {
    const res = await fetch(`${BASE_URL}/api/interview/analysis`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  complete: async (data: { sessionId: string }) => {
    const res = await fetch(`${BASE_URL}/api/interview/complete`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  getResult: async (sessionId: string) => {
    const res = await fetch(`${BASE_URL}/api/interview/result/${sessionId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

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
  getCandidateDashboard: async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/candidate`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getReviewerDashboard: async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/reviewer`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleRes(res);
  },
};

// ==========================================
// BADGE API
// ==========================================
export const badgeApi = {
  issueBadge: async (data: { sessionId: string; portfolioId: string }) => {
    const res = await fetch(`${BASE_URL}/api/badge/issue`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  getMyBadges: async () => {
    const res = await fetch(`${BASE_URL}/api/badge/my`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getBadgeDetail: async (badgeId: string) => {
    const res = await fetch(`${BASE_URL}/api/badge/detail/${badgeId}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  verifyBadge: async (verificationCode: string) => {
    const res = await fetch(`${BASE_URL}/api/badge/verify/${verificationCode}`, {
      method: "GET",
      headers: getHeaders(true),
    });
    return handleRes(res);
  },
};

// ==========================================
// NOTIFICATIONS API
// ==========================================
export const notificationsApi = {
  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}/api/notifications`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  readAll: async () => {
    const res = await fetch(`${BASE_URL}/api/notifications/read-all`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

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

// ==========================================
// VERIFIER API
// ==========================================
export const verifierApi = {
  apply: async (data: {
    fullName: string;
    vocationFields: string[];
    currentJob: string;
    institution: string;
    experienceYears: number;
    certifications?: string[];
    linkedinUrl?: string;
    portfolioUrl?: string;
    reviewFee: number;
  }) => {
    const res = await fetch(`${BASE_URL}/api/verifier/apply`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleRes(res);
  },

  getList: async (vocationField?: string) => {
    const url = vocationField
      ? `${BASE_URL}/api/verifier/list?vocationField=${vocationField}`
      : `${BASE_URL}/api/verifier/list`;
    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  getProfile: async (uid: string) => {
    const res = await fetch(`${BASE_URL}/api/verifier/profile/${uid}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  // Admin only
  getPendingApplications: async () => {
    const res = await fetch(`${BASE_URL}/api/verifier/admin/pending`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  approveVerifier: async (uid: string) => {
    const res = await fetch(`${BASE_URL}/api/verifier/admin/approve/${uid}`, {
      method: "PUT",
      headers: getHeaders(),
    });
    return handleRes(res);
  },

  rejectVerifier: async (uid: string, reason?: string) => {
    const res = await fetch(`${BASE_URL}/api/verifier/admin/reject/${uid}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleRes(res);
  },
};
