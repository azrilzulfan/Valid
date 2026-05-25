import { createFileRoute } from '@tanstack/react-router'
import { AiInterview } from '../pages/AiInterview'

export const Route = createFileRoute('/dashboard_/ai-interview')({
  component: AiInterview,
})
