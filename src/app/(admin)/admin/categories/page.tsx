import type { Metadata } from 'next';

import { CategoriesView } from '../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Material Categories — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCategoriesPage() {
  return <CategoriesView basePath="/admin/categories" />;
}
