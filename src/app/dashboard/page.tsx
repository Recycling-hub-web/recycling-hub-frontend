import { Suspense } from 'react';

import { DashboardRedirectView } from '../../components/features/auth/components';

export default function DashboardRedirectPage() {
  return (
    <Suspense fallback={null}>
      <DashboardRedirectView />
    </Suspense>
  );
}
