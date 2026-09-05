import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { B2BSection } from '../components/public/home/B2BSection';
import { ComparisonSection } from '../components/public/home/ComparisonSection';
import { ConnectorsStrip } from '../components/public/home/ConnectorsStrip';
import { DeliveryModels } from '../components/public/home/DeliveryModels';
import { FinalCTA } from '../components/public/home/FinalCTA';
import { HeroBlobSection } from '../components/public/home/HeroBlobSection';
import { LatestBlogSection } from '../components/public/home/LatestBlogSection';
import { ProblemIllustration } from '../components/public/home/ProblemIllustration';
import { ProblemStrip } from '../components/public/home/ProblemStrip';
import { SplitHeroSection } from '../components/public/home/SplitHeroSection';
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
    <SplitHeroSection />
    <TrustStrip />
    <ProblemIllustration />
    <ProblemStrip />
    <WhyRecyclingHub />
    <ComparisonSection />
    <HowItWorks />
    <DeliveryModels />
    <B2BSection />
    <ConnectorsStrip />
    <LatestBlogSection />
    <FaqSection />
    <FinalCTA />
  </>
);

HomePage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default HomePage;
