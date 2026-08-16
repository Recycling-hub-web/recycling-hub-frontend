import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ServicesGrid } from '../../components/public/services/ServicesGrid';
import { ServicesTrustBar } from '../../components/public/services/ServicesTrustBar';
import { ReusableHero } from '../../components/ui/hero';
import { SERVICES_HERO } from '../../constants/content';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ServicesPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Services — Recycling Hub E-Waste Collection & Disposal"
      description="Licensed e-waste collection, certified data destruction, material recovery, and compliance reporting — Recycling Hub's full service lineup."
    />
    <ReusableHero
      eyebrow={SERVICES_HERO.eyebrow}
      headline={SERVICES_HERO.headline}
      headlineAccent={SERVICES_HERO.headlineAccent}
      description={SERVICES_HERO.description}
    />
    <ServicesTrustBar />
    <ServicesGrid />
  </>
);

ServicesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ServicesPage;
