import type { Metadata } from 'next';

import { ReceivingOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Receiving — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function ReceivingDashboardPage() {
  return <ReceivingOverviewView />;
}
