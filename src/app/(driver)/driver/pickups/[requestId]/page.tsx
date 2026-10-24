import type { Metadata } from 'next';

import { DriverPickupDetailsView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Pickup Request — Recycling Hub Driver',
  robots: { index: false, follow: false },
};

export default function DriverPickupPage({
  params,
}: {
  params: { requestId: string };
}) {
  return <DriverPickupDetailsView requestId={params.requestId} />;
}
