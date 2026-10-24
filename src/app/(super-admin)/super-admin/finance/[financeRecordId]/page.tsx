import type { Metadata } from 'next';

import { FinanceRecordDetailsView } from '../../../../../components/features/finance/components';

export const metadata: Metadata = {
  title: 'Finance Record — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminFinanceRecordPage({
  params,
}: {
  params: { financeRecordId: string };
}) {
  return <FinanceRecordDetailsView recordId={params.financeRecordId} />;
}
