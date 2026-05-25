import { createFileRoute } from '@tanstack/react-router'
import { Professionals } from '../pages/Professionals'

export const Route = createFileRoute('/dashboard_/professionals')({
  component: Professionals,
})
