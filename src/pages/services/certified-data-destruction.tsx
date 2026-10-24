import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const CertifiedDataDestructionPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Certified Data Destruction — Recycling Hub"
      description="Serialized, chain-of-custody-tracked destruction of data-bearing devices before recycling."
    />
    <ServiceDetailTemplate slug="certified-data-destruction" />
  </>
);

CertifiedDataDestructionPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default CertifiedDataDestructionPage;
