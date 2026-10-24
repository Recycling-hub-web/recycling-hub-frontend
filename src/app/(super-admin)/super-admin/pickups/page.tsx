import type { Metadata } from 'next';

import { OrdersView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Orders — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupsPage() {
  return (
    <OrdersView
      basePath="/super-admin/pickups"
      requestsBasePath="/super-admin/pickup-requests"
    />
  );
}
