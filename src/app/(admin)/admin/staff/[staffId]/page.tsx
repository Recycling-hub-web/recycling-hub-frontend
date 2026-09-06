import type { Metadata } from 'next';

import { StaffDetailsView } from '../../../../../components/features/staff/components';

export const metadata: Metadata = {
  title: 'Staff Profile — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function StaffDetailsPage({
  params,
}: {
  params: { staffId: string };
}) {
  return <StaffDetailsView staffId={params.staffId} />;
}
