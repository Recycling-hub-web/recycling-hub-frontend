import type { Metadata } from 'next';

import { EditOrderView } from '../../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Edit Order — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditPickupPage({
  params,
}: {
  params: { requestId: string };
}) {
  return (
    <EditOrderView
      requestId={params.requestId}
      basePath="/super-admin/pickups"
    />
  );
}
