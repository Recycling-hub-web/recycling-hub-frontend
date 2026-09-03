import { Suspense } from 'react';

import { DashboardRedirectView } from './_components/DashboardRedirectView';

export default function DashboardRedirectPage() {
  return (
    <Suspense fallback={null}>
      <DashboardRedirectView />
    </Suspense>
  );
}
