import type { Metadata } from 'next';

import { DriverPickupsView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Requests — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverPickupsPage() {
  return <DriverPickupsView />;
}
