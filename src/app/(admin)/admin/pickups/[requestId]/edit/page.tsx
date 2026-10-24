import type { Metadata } from 'next';

import { EditOrderView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Order — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminEditPickupPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <EditOrderView requestId={params.requestId} basePath="/admin/pickups" />
  );
}
