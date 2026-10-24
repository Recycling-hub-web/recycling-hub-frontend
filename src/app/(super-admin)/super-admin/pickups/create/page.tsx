import type { Metadata } from 'next';

import { ConvertQuickLeadView } from '../../../../../components/features/pickups/components';

export const metadata: Metadata = {
  title: 'Follow Up On Lead — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreatePickupPage() {
  return <ConvertQuickLeadView basePath="/super-admin/pickups" />;
}
