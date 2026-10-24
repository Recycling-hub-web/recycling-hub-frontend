import type { Metadata } from 'next';

import { PartnersView } from '../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'Partnerships — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminPartnershipsPage() {
  return <PartnersView basePath="/super-admin/partnerships" />;
}
