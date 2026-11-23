import type { ReactElement } from 'react';
import { useEffect, useRef, useState } from 'react';

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
    pickupRequest: { hero: defaultHero, businessHero, typeSelector },
  } = useDictionary();
  // The public site offers two paths only: a callback (phone number
  // only) or a business/bulk request (the full form). null means
  // "still on the selector".
  const [choice, setChoice] = useState<'callback' | 'business' | null>(null);

  const hero = choice === 'business' ? businessHero : defaultHero;
  const flowRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    flowRef.current?.scrollIntoView({ block: 'start' });
    flowRef.current?.focus({ preventScroll: true });
  }, [choice]);

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
      <div
        ref={flowRef}
        tabIndex={-1}
        className="scroll-mt-24 focus:outline-none md:scroll-mt-28"
      >
        {choice === null && (
          <PickupTypeSelector
            onSelectCallback={() => setChoice('callback')}
            onSelectBusiness={() => setChoice('business')}
          />
        )}
        {choice !== null && (
          <div className="mx-auto mb-5 max-w-6xl px-5 md:px-8">
            <p className="mb-2 text-sm font-semibold text-neutral-950">
              {choice === 'business'
                ? typeSelector.business.title
                : typeSelector.callback.title}
            </p>
            {choice === 'business' && (
              <p className="mb-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {businessHero.description}
              </p>
            )}
            <button
              type="button"
              onClick={() => setChoice(null)}
              className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-brand-800 underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-700"
            >
              {typeSelector.changeOption}
            </button>
          </div>
        )}
        {/* Keep drafts mounted when the visitor changes request type. */}
        <div hidden={choice !== 'callback'}>
          <QuickPickupRequestForm />
        </div>
        <div hidden={choice !== 'business'}>
          <PublicPickupRequestForm />
        </div>
      </div>
    </>
  );
};

RequestPickupPage.getLayout = (page: ReactElement) => (
  <PublicLayout navVariant="light" floatingContact={false}>
    {page}
  </PublicLayout>
);

export default RequestPickupPage;
