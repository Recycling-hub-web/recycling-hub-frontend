import type { Metadata } from 'next';

import { NotificationsView } from '../../../../components/features/notifications/components';

export const metadata: Metadata = {
  title: 'Notifications — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminNotificationsPage() {
  return <NotificationsView />;
}
