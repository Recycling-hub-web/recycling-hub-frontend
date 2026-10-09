import type { Metadata } from 'next';

import { CollectionPointDetailsView } from '../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Collection Point — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCollectionPointPage({
  params,
}: {
  params: { collectionPointId: string };
}) {
  return (
    <CollectionPointDetailsView
      collectionPointId={params.collectionPointId}
      basePath="/staff/collection-points"
    />
  );
}
