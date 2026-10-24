import type { Metadata } from 'next';

import { CreateCategoryView } from '../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'New Category — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreateCategoryPage() {
  return <CreateCategoryView basePath="/admin/categories" />;
}
