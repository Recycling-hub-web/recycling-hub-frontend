import type { Metadata } from 'next';

import { ProfileOverview } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Staff — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function StaffDashboardPage() {
  return <ProfileOverview />;
}
