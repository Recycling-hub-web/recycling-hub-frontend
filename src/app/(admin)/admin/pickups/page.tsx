import type { Metadata } from 'next';

import { PickupRequestsView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupsPage() {
  return <PickupRequestsView basePath="/admin/pickups" />;
}
