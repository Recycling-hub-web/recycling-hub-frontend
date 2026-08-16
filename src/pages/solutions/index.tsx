import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { SolutionsGrid } from '../../components/public/solutions/SolutionsGrid';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const SolutionsPage: NextPageWithLayout = () => {
  const {
    solutions: { hero },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Solutions — Recycling Hub E-Waste Collection"
        description="Tailored e-waste collection, certified data destruction, and compliance reporting for corporate, household, government, education, healthcare, and nonprofit sectors."
      />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        headlineAccent={hero.headlineAccent}
        description={hero.description}
      />
      <SolutionsGrid />
    </>
  );
};

SolutionsPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default SolutionsPage;
