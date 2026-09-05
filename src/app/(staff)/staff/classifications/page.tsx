import type { Metadata } from 'next';

import { ClassificationsView } from '../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'Classifications — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffClassificationsPage() {
  return <ClassificationsView basePath="/staff/classifications" />;
}
