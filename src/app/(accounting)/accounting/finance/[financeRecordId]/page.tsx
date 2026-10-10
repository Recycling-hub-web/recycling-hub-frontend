import type { Metadata } from 'next';

import { FinanceRecordDetailsView } from '../../../../../components/features/finance/components';

export const metadata: Metadata = {
  title: 'Finance Record — Recycling Hub Accounting',
  robots: { index: false, follow: false },
};

export default function AccountingFinanceRecordPage({
  params,
}: {
  params: { financeRecordId: string };
}) {
  return <FinanceRecordDetailsView recordId={params.financeRecordId} />;
}
