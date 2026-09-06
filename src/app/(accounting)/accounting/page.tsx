import type { Metadata } from 'next';

import { SimpleOverviewView } from '../../../components/features/overview/components';

export const metadata: Metadata = {
  title: 'Accounting — Recycling Hub',
  robots: { index: false, follow: false },
};

export default function AccountingDashboardPage() {
  return <SimpleOverviewView role="accounting" />;
}
