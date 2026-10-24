import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

import {
  PickupTypeSelector,
  PublicPickupRequestForm,
  QuickPickupRequestForm,
} from '../components/features/pickups/components';
import type { PickupRequestType } from '../components/features/pickups/types';
import { Meta } from '../components/layout/Meta';
import { ReusableHero } from '../components/ui/hero';
import { useDictionary } from '../hooks/useDictionary';
import { PublicLayout } from '../layouts/PublicLayout';
import type { NextPageWithLayout } from '../types/next';

const RequestPickupPage: NextPageWithLayout = () => {
  const {
    pickupRequest: { hero },
  } = useDictionary();
  // Full-form choices stay on this same page/flow — the form has its
  // own type toggle (same icon+label design as PickupTypeSelector) that
  // switches this directly, no need to clear back to the selector to
  // change it. The quick (type+phone only) path is a separate, third
  // view — null means "still on the selector".
  const [requestType, setRequestType] = useState<PickupRequestType | null>(
    null,
  );
  const [quick, setQuick] = useState(false);

  let content: ReactNode;
  if (quick) {
    content = <QuickPickupRequestForm />;
  } else if (requestType) {
    content = (
      <PublicPickupRequestForm
        requestType={requestType}
        onSelectType={setRequestType}
      />
    );
  } else {
    content = (
      <PickupTypeSelector
        onSelect={setRequestType}
        onSelectQuick={() => setQuick(true)}
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
