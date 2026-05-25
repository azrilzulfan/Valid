import { createFileRoute } from '@tanstack/react-router'
import { ProReviewRoom } from '../pages/ProReviewRoom'

export const Route = createFileRoute('/pro/review/$id')({
  component: ProReviewRoom,
})
