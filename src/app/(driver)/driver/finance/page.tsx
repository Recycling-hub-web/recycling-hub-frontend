import type { Metadata } from 'next';

import { FinanceRecordsView } from '../../../../components/features/finance/components';

export const metadata: Metadata = {
  title: 'Finance Records — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverFinancePage() {
  return <FinanceRecordsView />;
}
