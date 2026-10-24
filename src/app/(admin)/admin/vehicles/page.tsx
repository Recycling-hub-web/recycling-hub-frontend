import type { Metadata } from 'next';

import { VehiclesView } from '../../../../components/features/vehicles/components';

export const metadata: Metadata = {
  title: 'Vehicles — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminVehiclesPage() {
  return <VehiclesView basePath="/admin/vehicles" />;
}
