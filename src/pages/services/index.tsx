import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServicesGrid } from '../../components/public/services/ServicesGrid';
import { ServicesTrustBar } from '../../components/public/services/ServicesTrustBar';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ServicesPage: NextPageWithLayout = () => {
  const {
    services: { hero },
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
    </>
  );
};

ServicesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ServicesPage;
