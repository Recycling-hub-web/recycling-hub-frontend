import type { Metadata } from 'next';

import { EditCollectionPointView } from '../../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Edit Collection Point — Recycling Hub Admin',
  robots: { index: false, follow: false },
};

export default function AdminEditCollectionPointPage({
  params,
}: {
  params: { collectionPointId: string };
}) {
  return (
    <EditCollectionPointView
      collectionPointId={params.collectionPointId}
      basePath="/admin/collection-points"
    />
  );
}
