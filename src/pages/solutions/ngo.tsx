import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const NgoPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="E-Waste Solutions for NGOs & Non-Profits — Recycling Hub"
      description="Flexible, lower-volume collection at partnership rates for nonprofits and community organizations."
    />
    <SolutionDetailTemplate slug="ngo" />
  </>
);

NgoPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default NgoPage;
