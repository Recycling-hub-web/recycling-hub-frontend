import type { Metadata } from 'next';

import { FinanceRecordsView } from '../../../../components/features/finance/components';

export const metadata: Metadata = {
  title: 'Finance Records — Recycling Hub Accounting',
  robots: { index: false, follow: false },
};

export default function AccountingFinancePage() {
  return <FinanceRecordsView />;
}
