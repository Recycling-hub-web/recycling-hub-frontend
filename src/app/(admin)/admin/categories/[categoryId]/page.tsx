import type { Metadata } from 'next';

import { CategoryDetailsView } from '../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Category — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <CategoryDetailsView
      categoryId={params.categoryId}
      basePath="/admin/categories"
    />
  );
}
