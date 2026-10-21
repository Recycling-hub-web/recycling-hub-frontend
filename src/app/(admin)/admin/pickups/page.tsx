import type { Metadata } from 'next';

import { OrdersView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Orders — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupsPage() {
  return (
    <OrdersView
      basePath="/admin/pickups"
      requestsBasePath="/admin/pickup-requests"
    />
  );
}
