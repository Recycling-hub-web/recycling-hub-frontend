import type { Metadata } from 'next';

import { CreateCollectionPointView } from '../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'New Collection Point — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCreateCollectionPointPage() {
  return (
    <CreateCollectionPointView basePath="/super-admin/collection-points" />
  );
}
