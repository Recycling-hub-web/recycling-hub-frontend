import type { Metadata } from 'next';

import { CategoriesView } from '../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Material Categories — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCategoriesPage() {
  return <CategoriesView basePath="/super-admin/categories" />;
}
