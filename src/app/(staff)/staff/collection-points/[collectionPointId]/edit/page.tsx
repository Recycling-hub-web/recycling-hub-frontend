import type { Metadata } from 'next';

import { EditCollectionPointView } from '../../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'Edit Collection Point — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffEditCollectionPointPage({
  params,
}: {
  params: { collectionPointId: string };
}) {
  return (
    <EditCollectionPointView
      collectionPointId={params.collectionPointId}
      basePath="/staff/collection-points"
    />
  );
}
