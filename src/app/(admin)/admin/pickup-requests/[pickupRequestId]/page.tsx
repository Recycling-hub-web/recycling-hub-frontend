import type { Metadata } from 'next';

import { PickupRequestDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Request — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupRequestDetailsPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <PickupRequestDetailsView
      requestId={params.pickupRequestId}
      basePath="/admin/pickup-requests"
      ordersBasePath="/admin/pickups"
    />
  );
}
