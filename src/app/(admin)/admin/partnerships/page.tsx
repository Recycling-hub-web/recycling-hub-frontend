import type { Metadata } from 'next';

import { PartnersView } from '../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'Partnerships — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminPartnershipsPage() {
  return <PartnersView basePath="/admin/partnerships" />;
}
