import type { Metadata } from 'next';

import { PickupRequestDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Request — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupRequestDetailsPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <PickupRequestDetailsView
      requestId={params.pickupRequestId}
      basePath="/super-admin/pickup-requests"
      ordersBasePath="/super-admin/pickups"
    />
  );
}
