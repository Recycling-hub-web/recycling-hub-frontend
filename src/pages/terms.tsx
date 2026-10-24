import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { LegalContent } from '../components/public/legal/LegalContent';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const TermsPage: NextPageWithLayout = () => {
  const {
    legal: { terms: content },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Terms of Service — Recycling Hub"
        description="The terms and conditions governing your use of Recycling Hub's e-waste collection and disposal services."
      />

      <ReusableHero
        eyebrow={content.hero.eyebrow}
        headline={content.hero.headline}
        description={content.hero.description}
      />

      <LegalContent
        lastUpdatedLine={content.lastUpdatedLine}
        sections={content.sections}
      />
    </>
  );
};

TermsPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default TermsPage;
