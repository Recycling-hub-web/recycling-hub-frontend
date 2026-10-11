import type { Metadata } from 'next';

import { PartnerDetailsView } from '../../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'Partner Details — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPartnerDetailsPage({
  params,
}: {
  params: { partnerId: string };
}) {
  return (
    <PartnerDetailsView
      partnerId={params.partnerId}
      basePath="/super-admin/partnerships"
    />
  );
}
