import Head from 'next/head';
import type { ReactElement } from 'react';

import { ProfileOverview } from '../../components/dashboard/ProfileOverview';
import { OperationalLayout } from '../../layouts/OperationalLayout';
import type { NextPageWithLayout } from '../../types/next';

const AccountingDashboardPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Accounting — Recycling Hub</title>
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <ProfileOverview />
  </>
);

AccountingDashboardPage.getLayout = (page: ReactElement) => (
  <OperationalLayout role="accounting">{page}</OperationalLayout>
);

export default AccountingDashboardPage;
