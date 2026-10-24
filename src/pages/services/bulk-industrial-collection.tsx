import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const BulkIndustrialCollectionPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Bulk & Industrial Collection — Recycling Hub"
      description="Recurring, volume-based e-waste collection for offices, warehouses, and factories, scheduled around your operations."
    />
    <ServiceDetailTemplate slug="bulk-industrial-collection" />
  </>
);

BulkIndustrialCollectionPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default BulkIndustrialCollectionPage;
