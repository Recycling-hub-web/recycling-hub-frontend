import type { Metadata } from 'next';

import { CollectionPointsView } from '../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Collection Points — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCollectionPointsPage() {
  return <CollectionPointsView basePath="/admin/collection-points" />;
}
