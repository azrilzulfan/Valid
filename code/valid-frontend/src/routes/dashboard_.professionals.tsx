// HALAMAN: C:\laragon\www\valid-react\src\routes\dashboard_.professionals.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Professionals } from '../pages/Professionals'

export const Route = createFileRoute('/dashboard_/professionals')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: Professionals,
})
