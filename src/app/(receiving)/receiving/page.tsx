import type { Metadata } from 'next';

import { ProfileOverview } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Receiving — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function ReceivingDashboardPage() {
  return <ProfileOverview />;
}
