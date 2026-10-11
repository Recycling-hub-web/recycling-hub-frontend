import type { Metadata } from 'next';

import { CategoryDetailsView } from '../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Category — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <CategoryDetailsView
      categoryId={params.categoryId}
      basePath="/super-admin/categories"
    />
  );
}
