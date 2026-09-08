import type { Metadata } from 'next';

import { PartnersView } from '../../../../components/features/partnerships/components';

export const metadata: Metadata = {
  title: 'Partnerships — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffPartnershipsPage() {
  return <PartnersView basePath="/staff/partnerships" />;
}
