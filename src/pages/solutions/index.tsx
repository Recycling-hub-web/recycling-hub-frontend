import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionsGrid } from '../../components/public/solutions/SolutionsGrid';
import { ReusableHero } from '../../components/ui/hero';
import { SOLUTIONS_HERO } from '../../constants/content';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const SolutionsPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Solutions — Recycling Hub E-Waste Collection"
      description="Tailored e-waste collection, certified data destruction, and compliance reporting for corporate, household, government, education, healthcare, and nonprofit sectors."
    />
    <ReusableHero
      eyebrow={SOLUTIONS_HERO.eyebrow}
      headline={SOLUTIONS_HERO.headline}
      headlineAccent={SOLUTIONS_HERO.headlineAccent}
      description={SOLUTIONS_HERO.description}
    />
    <SolutionsGrid />
  </>
);

SolutionsPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default SolutionsPage;
