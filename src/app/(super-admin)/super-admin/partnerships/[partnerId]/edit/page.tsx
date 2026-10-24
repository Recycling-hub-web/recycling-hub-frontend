import type { Metadata } from 'next';

import { EditPartnerView } from '../../../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'Edit Partner — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditPartnerPage({
  params,
}: {
  params: { partnerId: string };
}) {
  return (
    <EditPartnerView
      partnerId={params.partnerId}
      basePath="/super-admin/partnerships"
    />
  );
}
