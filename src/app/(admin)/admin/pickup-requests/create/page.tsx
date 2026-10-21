import type { Metadata } from 'next';

import { PickupRequestCreateView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'New Pickup Request — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPickupRequestCreatePage() {
  return <PickupRequestCreateView basePath="/admin/pickup-requests" />;
}
