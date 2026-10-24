import type { Metadata } from 'next';

import { EditCategoryView } from '../../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Edit Category — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffEditCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <EditCategoryView
      categoryId={params.categoryId}
      basePath="/staff/categories"
    />
  );
}
