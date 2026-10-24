import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const MaterialRecoveryPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Recycling & Material Recovery — Recycling Hub"
      description="Licensed downstream processing that recovers reusable materials and keeps e-waste out of landfill."
    />
    <ServiceDetailTemplate slug="material-recovery" />
  </>
);

MaterialRecoveryPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default MaterialRecoveryPage;
