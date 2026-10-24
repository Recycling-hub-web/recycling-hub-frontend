import type { Metadata } from 'next';

import { OrdersView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Orders — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupsPage() {
  return (
    <OrdersView
      basePath="/staff/pickups"
      requestsBasePath="/staff/pickup-requests"
    />
  );
}
