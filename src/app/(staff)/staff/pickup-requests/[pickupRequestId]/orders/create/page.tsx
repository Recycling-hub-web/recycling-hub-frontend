import type { Metadata } from 'next';

import { CreateOrderView } from '../../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Create Order — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreateOrderPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <CreateOrderView
      pickupRequestId={params.pickupRequestId}
      ordersBasePath="/staff/pickups"
      requestsBasePath="/staff/pickup-requests"
    />
  );
}
