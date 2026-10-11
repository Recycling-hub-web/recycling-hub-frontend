import type { Metadata } from 'next';

import { PickupRequestsView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPickupsPage() {
  return <PickupRequestsView basePath="/super-admin/pickups" />;
}
