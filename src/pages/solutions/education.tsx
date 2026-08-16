import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionDetailTemplate } from '../../components/public/solutions/SolutionDetailTemplate';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const EducationPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="E-Waste Solutions for Education — Recycling Hub"
      description="Bulk collection for computer lab upgrades and campus-wide IT refresh cycles, with certified destruction of student and staff data."
    />
    <SolutionDetailTemplate slug="education" />
  </>
);

EducationPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default EducationPage;
