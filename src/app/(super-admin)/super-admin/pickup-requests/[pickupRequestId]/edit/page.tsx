import type { Metadata } from 'next';

import { PickupRequestEditView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Pickup Request — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupRequestEditPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <PickupRequestEditView
      requestId={params.pickupRequestId}
      basePath="/super-admin/pickup-requests"
    />
  );
}
