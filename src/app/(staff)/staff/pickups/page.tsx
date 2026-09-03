import type { Metadata } from 'next';

import { PickupRequestsView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupsPage() {
  return <PickupRequestsView basePath="/staff/pickups" />;
}
