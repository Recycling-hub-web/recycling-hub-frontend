import type { Metadata } from 'next';

import { CreatePickupRequestView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'New Pickup Request — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreatePickupPage() {
  return <CreatePickupRequestView basePath="/super-admin/pickups" />;
}
