import type { Metadata } from 'next';

import { PickupRequestsListView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupRequestsPage() {
  return <PickupRequestsListView basePath="/super-admin/pickup-requests" />;
}
