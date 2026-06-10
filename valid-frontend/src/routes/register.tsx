// HALAMAN: C:\laragon\www\valid-react\src\routes\register.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router'
import { Register } from '../pages/Register'

export const Route = createFileRoute('/register')({
  head: () => ({
    meta: [
      { title: 'Daftar — VALID' }
    ]
  }),
  component: Register,
})
