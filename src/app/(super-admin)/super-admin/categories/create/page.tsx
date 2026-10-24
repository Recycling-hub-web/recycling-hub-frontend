import type { Metadata } from 'next';

import { CreateCategoryView } from '../../../../../components/features/categories/components';

export const metadata: Metadata = {
  title: 'New Category — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreateCategoryPage() {
  return <CreateCategoryView basePath="/super-admin/categories" />;
}
