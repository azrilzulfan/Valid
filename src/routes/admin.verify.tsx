import { createFileRoute } from '@tanstack/react-router';
import { AdminVerify } from '../pages/admin/AdminVerify';

export const Route = createFileRoute('/admin/verify')({
  component: AdminVerify,
});
