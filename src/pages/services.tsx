import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { DeliveryModels } from '../components/public/home/DeliveryModels';
import { ComplianceSecurity } from '../components/public/services/ComplianceSecurity';
import { ProductFeatures } from '../components/public/services/ProductFeatures';
import { ServiceOverview } from '../components/public/services/ServiceOverview';
import { ServiceProcess } from '../components/public/services/ServiceProcess';
import { SupportedSystems } from '../components/public/services/SupportedSystems';
import { BookDemo } from '../components/public/shared/BookDemo';
import { FaqSection } from '../components/public/shared/FaqSection';
import { ReusableHero } from '../components/ui/hero';
import { PAGE_HEROES } from '../constants/content';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const ServicesPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Services — Recycling Hub E-Waste Collection & Disposal"
      description="Licensed e-waste collection for individuals and businesses across Malaysia — certified data destruction, DOE/SW110 compliance, and ESG reporting."
    />
    <ReusableHero
      eyebrow={PAGE_HEROES.services.eyebrow}
      headline={PAGE_HEROES.services.headline}
      headlineAccent={PAGE_HEROES.services.headlineAccent}
      description={PAGE_HEROES.services.description}
    />
    <ServiceOverview />
    <ProductFeatures />
    <SupportedSystems />
    <ServiceProcess />
    <DeliveryModels />
    <ComplianceSecurity />
    <FaqSection />
    <BookDemo />
  </>
);

ServicesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ServicesPage;
