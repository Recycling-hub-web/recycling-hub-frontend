import Head from 'next/head';
import type { ReactElement } from 'react';

import { ProfileOverview } from '../../components/dashboard/ProfileOverview';
import { OperationalLayout } from '../../layouts/OperationalLayout';
import type { NextPageWithLayout } from '../../types/next';

const StaffDashboardPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Staff — Recycling Hub</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <ProfileOverview />
  </>
);

StaffDashboardPage.getLayout = (page: ReactElement) => (
  <OperationalLayout role="staff">{page}</OperationalLayout>
);

export default StaffDashboardPage;
