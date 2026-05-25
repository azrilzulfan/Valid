import { createFileRoute } from '@tanstack/react-router';
import { AdminCoins } from '../pages/admin/AdminCoins';

export const Route = createFileRoute('/admin/coins')({
  component: AdminCoins,
});
