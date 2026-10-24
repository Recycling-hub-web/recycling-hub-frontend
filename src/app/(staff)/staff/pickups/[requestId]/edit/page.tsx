import type { Metadata } from 'next';

import { EditOrderView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Order — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffEditPickupPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <EditOrderView requestId={params.requestId} basePath="/staff/pickups" />
  );
}
