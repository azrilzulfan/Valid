// HALAMAN: C:\laragon\www\valid-react\src\routes\p.$username.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { createFileRoute } from '@tanstack/react-router'
import { PublicProfile } from '../pages/PublicProfile'

export const Route = createFileRoute('/p/$username')({
  component: PublicProfile,
})
