import type { Metadata } from 'next';

import { ConvertQuickLeadView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Follow Up On Lead — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreatePickupPage() {
  return <ConvertQuickLeadView basePath="/staff/pickups" />;
}
