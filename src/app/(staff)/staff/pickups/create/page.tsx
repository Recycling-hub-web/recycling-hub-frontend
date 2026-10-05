import type { Metadata } from 'next';

import { CreatePickupRequestView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'New Pickup Request — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreatePickupPage() {
  return <CreatePickupRequestView basePath="/staff/pickups" />;
}
