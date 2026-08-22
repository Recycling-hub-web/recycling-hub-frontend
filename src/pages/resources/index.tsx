import type { ReactElement } from 'react';

import { Meta } from '../../components/layout/Meta';
import { ResourcesGrid } from '../../components/public/resources/ResourcesGrid';
import { ReusableHero } from '../../components/ui/hero';
import { useDictionary } from '../../hooks/useDictionary';
import { PublicLayout } from '../../layouts/PublicLayout';
import type { NextPageWithLayout } from '../../types/next';

const ResourcesPage: NextPageWithLayout = () => {
  const {
    resources: { hero },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Resources — Recycling Hub E-Waste Guides & Compliance"
        description="Guides on DOE registration, SW110 compliance, certified data destruction, ESG reporting, and how to prepare for your e-waste pickup."
      />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        description={hero.description}
      />
      <ResourcesGrid />
    </>
  );
};

ResourcesPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default ResourcesPage;
