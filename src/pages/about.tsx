import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { CoreInsightBanner } from '../components/public/about/CoreInsightBanner';
import { FoundationSection } from '../components/public/about/FoundationSection';
import { MissionStatement } from '../components/public/about/MissionStatement';
import { StatisticsSection } from '../components/public/about/StatisticsSection';
import { WhoWeWorkWith } from '../components/public/about/WhoWeWorkWith';
import { BookDemo } from '../components/public/shared/BookDemo';
import { ReusableHero } from '../components/ui/hero';
import { PAGE_HEROES } from '../constants/content';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const AboutPage: NextPageWithLayout = () => (
  <>
    <Meta
      title="About — Recycling Hub E-Waste Collection & Disposal"
      description="A Malaysia-based team dedicated to DOE-registered, fully documented e-waste collection and disposal for households and businesses."
    />
    <ReusableHero
      eyebrow={PAGE_HEROES.about.eyebrow}
      headline={PAGE_HEROES.about.headline}
      headlineAccent={PAGE_HEROES.about.headlineAccent}
      description={PAGE_HEROES.about.description}
    />
    <FoundationSection />
    <div className="sticky top-20 z-[10] overflow-hidden rounded-t-3xl">
      <MissionStatement />
    </div>
    <div className="sticky top-20 z-[15] overflow-hidden rounded-t-3xl">
      <CoreInsightBanner />
    </div>
    <div className="relative z-[20]">
      <StatisticsSection />
    </div>
    <div className="relative z-[30]">
      <WhoWeWorkWith />
    </div>
    <div className="relative z-[35]">
      <BookDemo />
    </div>
  </>
);

AboutPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default AboutPage;
