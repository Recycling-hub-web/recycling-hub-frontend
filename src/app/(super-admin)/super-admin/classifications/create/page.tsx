import type { Metadata } from 'next';

import { CreateClassificationView } from '../../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'New Classification — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreateClassificationPage() {
  return <CreateClassificationView basePath="/super-admin/classifications" />;
}
