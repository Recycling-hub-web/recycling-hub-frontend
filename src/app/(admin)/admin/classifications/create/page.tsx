import type { Metadata } from 'next';

import { CreateClassificationView } from '../../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'New Classification — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreateClassificationPage() {
  return <CreateClassificationView basePath="/admin/classifications" />;
}
