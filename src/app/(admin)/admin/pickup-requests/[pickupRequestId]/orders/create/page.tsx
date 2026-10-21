import type { Metadata } from 'next';

import { CreateOrderView } from '../../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Create Order — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreateOrderPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <CreateOrderView
      pickupRequestId={params.pickupRequestId}
      ordersBasePath="/admin/pickups"
      requestsBasePath="/admin/pickup-requests"
    />
  );
}
