import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const IndividualsHouseholdsPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="E-Waste Solutions for Individuals & Households — Recycling Hub"
      description="Free doorstep pickup and instant DuitNow payment for personal electronics — no minimums, no paperwork."
    />
    <SolutionDetailTemplate slug="individuals-households" />
  </>
);

IndividualsHouseholdsPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default IndividualsHouseholdsPage;
