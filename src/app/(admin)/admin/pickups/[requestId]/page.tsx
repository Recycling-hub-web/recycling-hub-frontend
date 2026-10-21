import type { Metadata } from 'next';

import { OrderDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Order — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupRequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <OrderDetailsView
      requestId={params.requestId}
      basePath="/admin/pickups"
      requestsBasePath="/admin/pickup-requests"
    />
  );
}
