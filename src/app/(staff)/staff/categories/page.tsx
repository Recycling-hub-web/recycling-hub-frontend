import type { Metadata } from 'next';

import { CategoriesView } from '../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Material Categories — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCategoriesPage() {
  return <CategoriesView basePath="/staff/categories" />;
}
