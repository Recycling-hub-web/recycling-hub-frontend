import type { Metadata } from 'next';

import { PickupRequestEditView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Pickup Request — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupRequestEditPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <PickupRequestEditView
      requestId={params.pickupRequestId}
      basePath="/staff/pickup-requests"
    />
  );
}
