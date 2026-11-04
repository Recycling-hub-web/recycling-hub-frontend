import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import {
  PickupTypeSelector,
  PublicPickupRequestForm,
  QuickPickupRequestForm,
} from '../components/features/pickups/components';
import { Meta } from '../components/layout/Meta';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const RequestPickupPage: NextPageWithLayout = () => {
  const {
    pickupRequest: { hero },
  } = useDictionary();
  // The public site offers two paths only: a callback (phone number
  // only) or a business/bulk request (the full form). null means
  // "still on the selector".
  const [choice, setChoice] = useState<'callback' | 'business' | null>(null);

  let content: ReactNode;
  if (choice === 'callback') {
    content = <QuickPickupRequestForm />;
  } else if (choice === 'business') {
    content = <PublicPickupRequestForm />;
  } else {
    content = (
      <PickupTypeSelector
        onSelectCallback={() => setChoice('callback')}
        onSelectBusiness={() => setChoice('business')}
      />
    );
  }

  return (
    <>
      <Meta
        title="Request a Pickup — Recycling Hub"
        description="Request a free, scheduled doorstep collection for your e-waste. No account needed."
      />
      <ReusableHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        headlineAccent={hero.headlineAccent}
        description={hero.description}
      />
      {content}
    </>
  );
};

RequestPickupPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default RequestPickupPage;
