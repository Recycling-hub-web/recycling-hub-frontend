import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const CollectionPickupPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="E-Waste Collection & Pickup — Recycling Hub"
      description="Free, scheduled doorstep collection for individual and household electronics across Malaysia."
    />
    <ServiceDetailTemplate slug="collection-pickup" />
  </>
);

CollectionPickupPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default CollectionPickupPage;
