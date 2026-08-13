import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { AddOns } from '../components/public/pricing/AddOns';
import { ComparisonTable } from '../components/public/pricing/ComparisonTable';
import { PricingFaq } from '../components/public/pricing/PricingFaq';
import { PricingTiers } from '../components/public/pricing/PricingTiers';
import { PricingTrustBar } from '../components/public/pricing/PricingTrustBar';
import { ReusableHero } from '../components/ui/hero';
import { PAGE_HEROES } from '../constants/content';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const PricingPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="Pricing — Recycling Hub E-Invoice Integration"
      description="Simple, transparent pricing for Malaysian e-invoice compliance. No hidden fees, no long-term contracts."
    />
    <ReusableHero
      eyebrow={PAGE_HEROES.pricing.eyebrow}
      headline={PAGE_HEROES.pricing.headline}
      description={PAGE_HEROES.pricing.description}
    />
    <PricingTrustBar />
    <PricingTiers />
    <ComparisonTable />
    <AddOns />
    <PricingFaq />
  </>
);

PricingPage.getLayout = (page: ReactElement) => (
  <PublicLayout>{page}</PublicLayout>
);

export default PricingPage;
