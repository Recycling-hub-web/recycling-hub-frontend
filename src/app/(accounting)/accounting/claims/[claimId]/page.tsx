import type { Metadata } from 'next';

import { ClaimDetailsView } from '../../../../../components/features/claims/components';

export const metadata: Metadata = {
  title: 'Expense Claim — Recycling Hub Accounting',
  robots: { index: false, follow: false },
};

export default function AccountingClaimPage({
  params,
}: {
  params: { claimId: string };
}) {
  return <ClaimDetailsView claimId={params.claimId} />;
}
