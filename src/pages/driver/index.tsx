import Head from 'next/head';
import type { ReactElement } from 'react';

import { ProfileOverview } from '../../components/dashboard/ProfileOverview';
import { OperationalLayout } from '../../layouts/OperationalLayout';
import type { NextPageWithLayout } from '../../types/next';

const DriverDashboardPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Driver — Recycling Hub</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <ProfileOverview />
  </>
);

DriverDashboardPage.getLayout = (page: ReactElement) => (
  <OperationalLayout role="driver">{page}</OperationalLayout>
);

export default DriverDashboardPage;
