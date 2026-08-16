import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const GovernmentGlcPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="E-Waste Solutions for Government & GLC — Recycling Hub"
      description="Procurement-ready compliance and transparent documentation for public sector agencies and government-linked companies."
    />
    <SolutionDetailTemplate slug="government-glc" />
  </>
);

GovernmentGlcPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default GovernmentGlcPage;
