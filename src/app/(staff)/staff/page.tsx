import type { Metadata } from 'next';

import { StaffOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Staff — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function StaffDashboardPage() {
  return <StaffOverviewView />;
}
