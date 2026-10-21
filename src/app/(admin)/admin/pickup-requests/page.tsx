import type { Metadata } from 'next';

import { PickupRequestsListView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupRequestsPage() {
  return <PickupRequestsListView basePath="/admin/pickup-requests" />;
}
