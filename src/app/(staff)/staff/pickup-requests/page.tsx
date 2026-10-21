import type { Metadata } from 'next';

import { PickupRequestsListView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupRequestsPage() {
  return <PickupRequestsListView basePath="/staff/pickup-requests" />;
}
