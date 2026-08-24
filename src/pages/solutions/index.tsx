import Link from 'next/link';
import type { ReactElement } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { Meta } from '../../components/layout/Meta';
import { SolutionsGrid } from '../../components/public/solutions/SolutionsGrid';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const SolutionsPage: NextPageWithLayout = () => {
  const {
    solutions: { hero, crossLink },
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
      <div className="bg-white pb-16 text-center md:pb-20">
        <Link
          href={crossLink.href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          {crossLink.text} {crossLink.cta}
          <LuArrowRight size={15} />
        </Link>
      </div>
    </>
  );
};

SolutionsPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default SolutionsPage;
