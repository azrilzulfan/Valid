// HALAMAN: C:\laragon\www\valid-react\src\routes\dashboard_.ai-interview.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute, redirect } from '@tanstack/react-router'
import { AiInterview } from '../pages/AiInterview'

export const Route = createFileRoute('/dashboard_/ai-interview')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('valid_firebase_token')) {
      throw redirect({ to: '/login' })
    }
  },
  component: AiInterview,
})
