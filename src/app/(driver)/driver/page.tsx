import type { Metadata } from 'next';

import { SimpleOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Driver — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function DriverDashboardPage() {
  return <SimpleOverviewView role="driver" />;
}
