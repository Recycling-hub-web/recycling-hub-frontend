import type { Metadata } from 'next';

import { EditPickupRequestView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Pickup Request — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditPickupPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <EditPickupRequestView
      requestId={params.requestId}
      basePath="/super-admin/pickups"
    />
  );
}
