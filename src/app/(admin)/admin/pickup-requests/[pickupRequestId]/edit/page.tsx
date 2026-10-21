import type { Metadata } from 'next';

import { PickupRequestEditView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Pickup Request — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupRequestEditPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <PickupRequestEditView
      requestId={params.pickupRequestId}
      basePath="/admin/pickup-requests"
    />
  );
}
