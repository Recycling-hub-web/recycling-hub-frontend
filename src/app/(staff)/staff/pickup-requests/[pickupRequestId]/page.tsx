import type { Metadata } from 'next';

import { PickupRequestDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Request — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupRequestDetailsPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <PickupRequestDetailsView
      requestId={params.pickupRequestId}
      basePath="/staff/pickup-requests"
      ordersBasePath="/staff/pickups"
    />
  );
}
