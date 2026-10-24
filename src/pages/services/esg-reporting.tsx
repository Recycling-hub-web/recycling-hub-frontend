import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServiceDetailTemplate } from '../../components/public/services/ServiceDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const EsgReportingPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="ESG & Sustainability Reporting — Recycling Hub"
      description="Diversion and impact reporting for every bulk collection, formatted for direct use in ESG disclosures."
    />
    <ServiceDetailTemplate slug="esg-reporting" />
  </>
);

EsgReportingPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default EsgReportingPage;
