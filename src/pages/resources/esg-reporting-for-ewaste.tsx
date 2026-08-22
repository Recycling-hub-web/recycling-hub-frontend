import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourceDetailTemplate } from '../../components/public/resources/ResourceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const EsgReportingForEwastePage: NextPageWithLayout = () => (
  <>
    <Meta
      title="ESG & Sustainability Reporting for E-Waste — Recycling Hub"
      description="How e-waste collection data turns into something your sustainability team can put directly into an ESG disclosure."
    />
    <ResourceDetailTemplate slug="esg-reporting-for-ewaste" />
  </>
);

EsgReportingForEwastePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default EsgReportingForEwastePage;
