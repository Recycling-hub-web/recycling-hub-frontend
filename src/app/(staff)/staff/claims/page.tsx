import type { Metadata } from 'next';

import { ClaimsView } from '../../../../components/features/claims/components';

export const metadata: Metadata = {
  title: 'Expense Claims — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffClaimsPage() {
  return <ClaimsView />;
}
