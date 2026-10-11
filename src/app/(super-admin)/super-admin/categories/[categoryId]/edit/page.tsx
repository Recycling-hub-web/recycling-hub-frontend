import type { Metadata } from 'next';

import { EditCategoryView } from '../../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Edit Category — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminEditCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <EditCategoryView
      categoryId={params.categoryId}
      basePath="/super-admin/categories"
    />
  );
}
