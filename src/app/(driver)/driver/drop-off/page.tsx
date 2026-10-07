import type { Metadata } from 'next';

import { RouteDropOffView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Drop Off to Store — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverDropOffPage() {
  return <RouteDropOffView />;
}
