import type { Metadata } from 'next';

import { SimpleOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Receiving — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function ReceivingDashboardPage() {
  return <SimpleOverviewView role="receiving_officer" />;
}
