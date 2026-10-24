import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourceDetailTemplate } from '../../components/public/resources/ResourceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const PreparingDevicesForPickupPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="How to Prepare Your Devices for Pickup — Recycling Hub"
      description="A practical checklist before your free doorstep collection, so pickup goes smoothly and your data stays yours."
    />
    <ResourceDetailTemplate slug="preparing-devices-for-pickup" />
  </>
);

PreparingDevicesForPickupPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default PreparingDevicesForPickupPage;
