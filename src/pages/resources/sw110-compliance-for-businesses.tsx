import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourceDetailTemplate } from '../../components/public/resources/ResourceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const Sw110ComplianceForBusinessesPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="SW110 Compliance for Businesses — Recycling Hub"
      description="What SW110 scheduled-waste classification means for offices, warehouses, and factories generating e-waste."
    />
    <ResourceDetailTemplate slug="sw110-compliance-for-businesses" />
  </>
);

Sw110ComplianceForBusinessesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default Sw110ComplianceForBusinessesPage;
