import Link from 'next/link';
import type { ReactElement } from 'react';
import { LuArrowRight } from 'react-icons/lu';

import { Meta } from '../../components/layout/Meta';
import { FeatureTabs } from '../../components/public/home/FeatureTabs';
import { ServicesGrid } from '../../components/public/services/ServicesGrid';
import { ServicesTrustBar } from '../../components/public/services/ServicesTrustBar';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ServicesPage: NextPageWithLayout = () => {
  const {
    services: { hero, crossLink },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Services — Recycling Hub E-Waste Collection & Disposal"
        description="Licensed e-waste collection, certified data destruction, material recovery, and compliance reporting — Recycling Hub's full service lineup."
      />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        headlineAccent={hero.headlineAccent}
        description={hero.description}
      />
      <ServicesTrustBar />
      <ServicesGrid />
      <FeatureTabs />
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

ServicesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ServicesPage;
