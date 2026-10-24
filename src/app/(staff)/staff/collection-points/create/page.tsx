import type { Metadata } from 'next';

import { CreateCollectionPointView } from '../../../../../components/features/collectionPoints/components';

export const metadata: Metadata = {
  title: 'New Collection Point — Recycling Hub Staff',
  robots: { index: false, follow: false },
};

export default function StaffCreateCollectionPointPage() {
  return <CreateCollectionPointView basePath="/staff/collection-points" />;
}
