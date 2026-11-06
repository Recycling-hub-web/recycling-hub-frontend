import type { ReactElement } from 'react';

import { QuickPickupRequestForm } from '../components/features/pickups/components';
import { Meta } from '../components/layout/Meta';
import { HeroBlobSection } from '../components/public/home/HeroBlobSection';
import { LatestBlogSection } from '../components/public/home/LatestBlogSection';
import { TrustStrip } from '../components/public/home/TrustStrip';
import { WhyRecyclingHub } from '../components/public/home/WhyRecyclingHub';
import { FaqSection } from '../components/public/shared/FaqSection';
import { HowItWorks } from '../components/public/shared/HowItWorks';
import { AppConfig } from '../config/site.config';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const HomePage: NextPageWithLayout = () => (
  <>
    <Meta title={AppConfig.title} description={AppConfig.description} />
    <HeroBlobSection />
    <TrustStrip />
    <QuickPickupRequestForm />
    <WhyRecyclingHub />
    <HowItWorks />
    <LatestBlogSection />
    <FaqSection />
  </>
);

HomePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default HomePage;
