import Head from 'next/head';
import type { ReactElement } from 'react';

import { ProfileOverview } from '../../components/dashboard/ProfileOverview';
import { OperationalLayout } from '../../layouts/OperationalLayout';
import type { NextPageWithLayout } from '../../types/next';

const ReceivingDashboardPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Receiving — Recycling Hub</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <ProfileOverview />
  </>
);

ReceivingDashboardPage.getLayout = (page: ReactElement) => (
  <OperationalLayout role="receiving_officer">{page}</OperationalLayout>
);

export default ReceivingDashboardPage;
