import type { Metadata } from 'next';

import { OrderDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Order — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupRequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <OrderDetailsView
      requestId={params.requestId}
      basePath="/super-admin/pickups"
      requestsBasePath="/super-admin/pickup-requests"
    />
  );
}
