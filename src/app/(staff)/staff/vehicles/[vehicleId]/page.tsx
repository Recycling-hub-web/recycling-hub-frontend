import type { Metadata } from 'next';

import { VehicleDetailsView } from '../../../../../components/features/vehicles/components';

export const metadata: Metadata = {
  title: 'Vehicle — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffVehiclePage({
  params,
}: {
  params: { vehicleId: string };
}) {
  return (
    <VehicleDetailsView
      vehicleId={params.vehicleId}
      basePath="/staff/vehicles"
    />
  );
}
