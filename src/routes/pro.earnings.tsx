import { createFileRoute } from '@tanstack/react-router'
import { ProEarnings } from '../pages/ProEarnings'

export const Route = createFileRoute('/pro/earnings')({
  component: ProEarnings,
})
