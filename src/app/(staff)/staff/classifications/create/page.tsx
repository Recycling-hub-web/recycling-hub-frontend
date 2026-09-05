import type { Metadata } from 'next';

import { CreateClassificationView } from '../../../../../components/features/classifications/components';

export const metadata: Metadata = {
  title: 'New Classification — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreateClassificationPage() {
  return <CreateClassificationView basePath="/staff/classifications" />;
}
