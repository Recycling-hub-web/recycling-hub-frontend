import type { Metadata } from 'next';

import { ClaimDetailsView } from '../../../../../components/features/claims/components';

export const metadata: Metadata = {
  title: 'Expense Claim — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminClaimPage({
  params,
}: {
  params: { claimId: string };
}) {
  return <ClaimDetailsView claimId={params.claimId} />;
}
