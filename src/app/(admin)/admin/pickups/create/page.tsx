import type { Metadata } from 'next';

import { CreatePickupRequestView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'New Pickup Request — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreatePickupPage() {
  return <CreatePickupRequestView basePath="/admin/pickups" />;
}
