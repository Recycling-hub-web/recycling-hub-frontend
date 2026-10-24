import type { Metadata } from 'next';

import { CollectionPointsView } from '../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Collection Points — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCollectionPointsPage() {
  return <CollectionPointsView basePath="/staff/collection-points" />;
}
