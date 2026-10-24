import type { Metadata } from 'next';

import { CollectionPointDetailsView } from '../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Collection Point — Recycling Hub Super Admin',
  robots: { index: false, follow: false },
};

export default function SuperAdminCollectionPointPage({
  params,
}: {
  params: { collectionPointId: string };
}) {
  return (
    <CollectionPointDetailsView
      collectionPointId={params.collectionPointId}
      basePath="/super-admin/collection-points"
    />
  );
}
