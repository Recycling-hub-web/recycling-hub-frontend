import type { Metadata } from 'next';

import { PickupRequestDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Request — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupRequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <PickupRequestDetailsView
      requestId={params.requestId}
      basePath="/super-admin/pickups"
    />
  );
}
