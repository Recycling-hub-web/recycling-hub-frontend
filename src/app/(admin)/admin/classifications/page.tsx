import type { Metadata } from 'next';

import { ClassificationsView } from '../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'Classifications — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminClassificationsPage() {
  return <ClassificationsView basePath="/admin/classifications" />;
}
