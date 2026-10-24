import type { Metadata } from 'next';

import { CreateOrderView } from '../../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Create Order — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreateOrderPage({
  params,
}: {
  params: { pickupRequestId: string };
}) {
  return (
    <CreateOrderView
      pickupRequestId={params.pickupRequestId}
      ordersBasePath="/super-admin/pickups"
      requestsBasePath="/super-admin/pickup-requests"
    />
  );
}
