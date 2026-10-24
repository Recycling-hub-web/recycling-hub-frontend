import type { Metadata } from 'next';

import { OrderDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Order — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupRequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <OrderDetailsView
      requestId={params.requestId}
      basePath="/staff/pickups"
      requestsBasePath="/staff/pickup-requests"
    />
  );
}
