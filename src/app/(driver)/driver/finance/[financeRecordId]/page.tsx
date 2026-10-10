import type { Metadata } from 'next';

import { FinanceRecordDetailsView } from '../../../../../components/features/finance/components';

export const metadata: Metadata = {
  title: 'Finance Record — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverFinanceRecordPage({
  params,
}: {
  params: { financeRecordId: string };
}) {
  return <FinanceRecordDetailsView recordId={params.financeRecordId} />;
}
