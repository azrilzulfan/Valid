// HALAMAN: C:\laragon\www\valid-react\src\routes\pro.dashboard.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProDashboard } from '../pages/ProDashboard'

export const Route = createFileRoute('/pro/dashboard')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: ProDashboard,
})
