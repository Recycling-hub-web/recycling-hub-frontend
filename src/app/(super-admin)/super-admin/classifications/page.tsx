import type { Metadata } from 'next';

import { ClassificationsView } from '../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'Classifications — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminClassificationsPage() {
  return <ClassificationsView basePath="/super-admin/classifications" />;
}
