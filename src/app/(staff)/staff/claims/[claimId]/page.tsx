import type { Metadata } from 'next';

import { ClaimDetailsView } from '../../../../../components/features/claims/components';

export const metadata: Metadata = {
  title: 'Expense Claim — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffClaimPage({
  params,
}: {
  params: { claimId: string };
}) {
  return <ClaimDetailsView claimId={params.claimId} />;
}
