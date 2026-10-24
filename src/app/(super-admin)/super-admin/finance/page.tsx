import type { Metadata } from 'next';

import { FinanceRecordsView } from '../../../../components/features/finance/components';

export const metadata: Metadata = {
  title: 'Finance Records — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminFinancePage() {
  return <FinanceRecordsView />;
}
