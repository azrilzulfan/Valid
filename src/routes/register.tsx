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
