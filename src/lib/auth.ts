// HALAMAN: lib/auth.ts
// FUNGSI: Helper fungsi untuk menyimpan dan mengambil data autentikasi (token dan role) dari localStorage
// API YANG DIBUTUHKAN: -
// DUMMY DATA: -

export const saveToken = (token: string) => localStorage.setItem('valid_firebase_token', token)
export const getToken = () => localStorage.getItem('valid_firebase_token')
export const saveRole = (role: string) => localStorage.setItem('valid_role', role)
export const getRole = () => localStorage.getItem('valid_role')
export const clearAuth = () => { localStorage.removeItem('valid_firebase_token'); localStorage.removeItem('valid_role') }
export const isLoggedIn = () => !!getToken()
