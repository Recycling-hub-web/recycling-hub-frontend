import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const CorporateEnterprisePage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Corporate & Enterprise E-Waste Solutions — Recycling Hub"
      description="Recurring bulk collection, certified data destruction, and ESG reporting for offices, corporate IT, and manufacturing facilities."
    />
    <SolutionDetailTemplate slug="corporate-enterprise" />
  </>
);

CorporateEnterprisePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default CorporateEnterprisePage;
