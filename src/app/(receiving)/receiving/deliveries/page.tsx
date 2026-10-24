import type { Metadata } from 'next';

import { ReceivingDeliveriesView } from '../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Deliveries — Recycling Hub Receiving',
  robots: { index: false, follow: false },
};

export default function ReceivingDeliveriesPage() {
  return <ReceivingDeliveriesView />;
}
