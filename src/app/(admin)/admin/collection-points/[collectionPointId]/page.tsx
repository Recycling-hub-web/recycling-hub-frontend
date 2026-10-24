import type { Metadata } from 'next';

import { CollectionPointDetailsView } from '../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Collection Point — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminCollectionPointPage({
  params,
}: {
  params: { collectionPointId: string };
}) {
  return (
    <CollectionPointDetailsView
      collectionPointId={params.collectionPointId}
      basePath="/admin/collection-points"
    />
  );
}
