// HALAMAN: C:\laragon\www\valid-react\src\routes\dashboard_.reviews.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Reviews } from '../pages/Reviews'

export const Route = createFileRoute('/dashboard_/reviews')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: Reviews,
})
