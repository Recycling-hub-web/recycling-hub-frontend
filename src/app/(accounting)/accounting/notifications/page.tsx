import type { Metadata } from 'next';

import { NotificationsView } from '../../../../components/features/notifications/components';

export const metadata: Metadata = {
  title: 'Notifications — Recycling Hub Accounting',
  robots: { index: false, follow: false },
};

export default function AccountingNotificationsPage() {
  return <NotificationsView />;
}
