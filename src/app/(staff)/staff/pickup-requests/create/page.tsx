import type { Metadata } from 'next';

import { PickupRequestCreateView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'New Pickup Request — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPickupRequestCreatePage() {
  return <PickupRequestCreateView basePath="/staff/pickup-requests" />;
}
