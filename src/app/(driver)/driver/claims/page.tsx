import type { Metadata } from 'next';

import { ClaimsView } from '../../../../components/features/claims/components';

export const metadata: Metadata = {
  title: 'Expense Claims — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverClaimsPage() {
  return <ClaimsView />;
}
