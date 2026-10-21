import type { Metadata } from 'next';

import { ClaimForm } from '../../../../../components/features/claims/components';

export const metadata: Metadata = {
  title: 'New Expense Claim — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverNewClaimPage() {
  return <ClaimForm basePath="/driver/claims" />;
}
