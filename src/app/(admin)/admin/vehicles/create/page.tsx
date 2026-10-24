import type { Metadata } from 'next';

import { CreateVehicleView } from '../../../../../components/features/vehicles/components';

export const metadata: Metadata = {
  title: 'New Vehicle — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreateVehiclePage() {
  return <CreateVehicleView basePath="/admin/vehicles" />;
}
