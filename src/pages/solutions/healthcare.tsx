import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const HealthcarePage: NextPageWithLayout = () => (
  <>
    <Meta
      title="E-Waste Solutions for Healthcare — Recycling Hub"
      description="Chain-of-custody-tracked collection and certified destruction for retired hospital and clinic IT equipment."
    />
    <SolutionDetailTemplate slug="healthcare" />
  </>
);

HealthcarePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default HealthcarePage;
