import type { Metadata } from 'next';

import { CategoryDetailsView } from '../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'Category — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  return (
    <CategoryDetailsView
      categoryId={params.categoryId}
      basePath="/staff/categories"
    />
  );
}
