// HALAMAN: src/lib/auth.ts
// FUNGSI: Helper fungsi untuk menyimpan dan mengambil data autentikasi (token, role, user) dari localStorage

export const saveToken = (token: string) => localStorage.setItem("valid_firebase_token", token);
export const getToken = () => localStorage.getItem("valid_firebase_token");

export const saveRole = (role: string) => localStorage.setItem("valid_role", role);
export const getRole = () => localStorage.getItem("valid_role");

export const saveUser = (user: any) => localStorage.setItem("valid_user", JSON.stringify(user));
export const getUser = () => {
  const userStr = localStorage.getItem("valid_user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("valid_firebase_token");
  localStorage.removeItem("valid_role");
  localStorage.removeItem("valid_user");
};

export const isLoggedIn = () => !!getToken();
