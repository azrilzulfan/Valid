// HALAMAN: C:\laragon\www\valid-react\src\routes\dashboard_.portfolio.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Portfolio } from '../pages/Portfolio'

export const Route = createFileRoute('/dashboard_/portfolio')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: Portfolio,
})

