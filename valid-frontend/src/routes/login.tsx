// HALAMAN: C:\laragon\www\valid-react\src\routes\login.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router'
import { Login } from '../pages/Login'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Masuk — VALID' }
    ]
  }),
  component: Login,
})
