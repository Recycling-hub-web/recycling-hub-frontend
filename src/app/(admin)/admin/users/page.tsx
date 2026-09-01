import type { Metadata } from 'next';

import { AdminUsersView } from './AdminUsersView';

export const metadata: Metadata = {
  title: 'Users — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
