import type { Metadata } from 'next';

import { CreateVehicleView } from '../../../../../components/features/vehicles/components';

export const metadata: Metadata = {
  title: 'New Vehicle — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreateVehiclePage() {
  return <CreateVehicleView basePath="/staff/vehicles" />;
}
