// HALAMAN: C:\laragon\www\valid-react\src\routes\dashboard.index.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '../pages/Dashboard'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})
