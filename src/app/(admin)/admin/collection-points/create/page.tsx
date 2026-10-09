import type { Metadata } from 'next';

import { CreateCollectionPointView } from '../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'New Collection Point — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCreateCollectionPointPage() {
  return <CreateCollectionPointView basePath="/admin/collection-points" />;
}
