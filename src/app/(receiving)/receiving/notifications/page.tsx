import type { Metadata } from 'next';

import { NotificationsView } from '../../../../components/features/notifications/components';

export const metadata: Metadata = {
  title: 'Notifications — Recycling Hub Receiving',
  robots: { index: false, follow: false },
};

export default function ReceivingNotificationsPage() {
  return <NotificationsView />;
}
