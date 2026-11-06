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
    pickupRequest: { hero, typeSelector },
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
      {choice && (
        <div className="mx-auto max-w-2xl px-5 md:px-8">
          <button
            type="button"
            onClick={() => setChoice(null)}
            className="min-h-11 rounded-lg px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            ← {typeSelector.changeOption}
          </button>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {choice === 'callback'
              ? typeSelector.callback.description
              : typeSelector.business.description}
          </p>
        </div>
      )}
      {content}
    </>
  );
};

RequestPickupPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light">{page}</PublicLayout>
);

export default RequestPickupPage;
