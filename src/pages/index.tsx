import type { ReactElement } from 'react';

import { QuickPickupRequestForm } from '../components/features/pickups/components';
import { Meta } from '../components/layout/Meta';
import { PublicSeoSchema } from '../components/layout/PublicSeoSchema';
import { HeroBlobSection } from '../components/public/home/HeroBlobSection';
import { LatestBlogSection } from '../components/public/home/LatestBlogSection';
import { ServiceAreaSection } from '../components/public/home/ServiceAreaSection';
import { TrustStrip } from '../components/public/home/TrustStrip';
import { WhyRecyclingHub } from '../components/public/home/WhyRecyclingHub';
import { FaqSection } from '../components/public/shared/FaqSection';
import { HowItWorks } from '../components/public/shared/HowItWorks';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const HomePage: NextPageWithLayout = () => {
  const { seo } = useDictionary();
  return (
    <>
      <Meta {...seo.home} />
      <PublicSeoSchema page="home" />
      <HeroBlobSection />
      <TrustStrip />
      <QuickPickupRequestForm />
      <WhyRecyclingHub />
      <HowItWorks />
      <ServiceAreaSection />
      <LatestBlogSection />
      <FaqSection />
    </>
  );
};

HomePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default HomePage;
