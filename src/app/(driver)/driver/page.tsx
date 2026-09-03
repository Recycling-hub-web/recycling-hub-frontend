import type { Metadata } from 'next';

import { ProfileOverview } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Driver — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function DriverDashboardPage() {
  return <ProfileOverview />;
}
