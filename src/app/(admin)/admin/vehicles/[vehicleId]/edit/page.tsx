import type { Metadata } from 'next';

import { EditVehicleView } from '../../../../../../components/features/vehicles/components';

export const metadata: Metadata = {
  title: 'Edit Vehicle — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminEditVehiclePage({
  params,
}: {
  params: { vehicleId: string };
}) {
  return (
    <EditVehicleView vehicleId={params.vehicleId} basePath="/admin/vehicles" />
  );
}
