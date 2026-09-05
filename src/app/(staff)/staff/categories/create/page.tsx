import type { Metadata } from 'next';

import { CreateCategoryView } from '../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'New Category — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreateCategoryPage() {
  return <CreateCategoryView basePath="/staff/categories" />;
}
