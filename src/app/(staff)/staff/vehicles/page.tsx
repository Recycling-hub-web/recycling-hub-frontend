import type { Metadata } from 'next';

import { VehiclesView } from '../../../../components/features/vehicles/components';

export const metadata: Metadata = {
  title: 'Vehicles — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffVehiclesPage() {
  return <VehiclesView basePath="/staff/vehicles" />;
}
