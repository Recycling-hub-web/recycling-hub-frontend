import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourceDetailTemplate } from '../../components/public/resources/ResourceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const CertifiedDataDestructionGuidePage: NextPageWithLayout = () => (
  <>
    <Meta
      title="How Certified Data Destruction Works — Recycling Hub"
      description="What actually happens to the data on your old phones, laptops, and hard drives before they're recycled."
    />
    <ResourceDetailTemplate slug="certified-data-destruction-guide" />
  </>
);

CertifiedDataDestructionGuidePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default CertifiedDataDestructionGuidePage;
