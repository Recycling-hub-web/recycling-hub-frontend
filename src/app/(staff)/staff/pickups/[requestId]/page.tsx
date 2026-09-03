import type { Metadata } from 'next';

import { PickupRequestDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Request — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupRequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <PickupRequestDetailsView
      requestId={params.requestId}
      basePath="/staff/pickups"
    />
  );
}
