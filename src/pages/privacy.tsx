import type { ReactElement } from 'react';

import { Meta } from '../components/layout/Meta';
import { LegalContent } from '../components/public/legal/LegalContent';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const PrivacyPage: NextPageWithLayout = () => {
  const {
    legal: { privacy: content },
  } = useDictionary();

  return (
    <>
      <Meta
        title="Privacy Policy — Recycling Hub"
        description="How Recycling Hub collects, uses, and protects your personal data in accordance with Malaysia's Personal Data Protection Act 2010."
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

PrivacyPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default PrivacyPage;
