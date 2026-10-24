import type { Metadata } from 'next';

import { PickupRequestCreateView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'New Pickup Request — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupRequestCreatePage() {
  return <PickupRequestCreateView basePath="/super-admin/pickup-requests" />;
}
