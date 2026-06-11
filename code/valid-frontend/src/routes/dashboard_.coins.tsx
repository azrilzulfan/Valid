// HALAMAN: C:\laragon\www\valid-react\src\routes\dashboard_.coins.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { Coins } from '../pages/Coins'

export const Route = createFileRoute('/dashboard_/coins')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: Coins,
})
