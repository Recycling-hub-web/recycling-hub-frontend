import type { Metadata } from 'next';

import { ProfileOverview } from '../../../components/dashboard/ProfileOverview';

export const metadata: Metadata = {
  title: 'Staff — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function StaffDashboardPage() {
  return <ProfileOverview />;
}
