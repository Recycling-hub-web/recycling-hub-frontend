import Head from 'next/head';
import type { ReactElement } from 'react';
import {
  LuBriefcase,
  LuBuilding2,
  LuCalendar,
  LuIdCard,
  LuMail,
  LuPhone,
} from 'react-icons/lu';

import { Card } from '../../components/ui/card/Card';
import { AppDate } from '../../components/ui/date/AppDate';
import { InfoRow } from '../../components/ui/InfoRow';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ROLE_LABELS } from '../../types/auth';
import type { NextPageWithLayout } from '../../types/next';

const DashboardPage: NextPageWithLayout = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Head>
        <title>Dashboard — Recycling Hub</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <PageHeader
        title={`Welcome, ${user.full_name.split(' ')[0]}`}
        subtitle={ROLE_LABELS[user.role]}
      />

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuMail className="size-4" />}
            label="Email"
            value={user.email}
          />
          <InfoRow
            icon={<LuPhone className="size-4" />}
            label="Phone"
            value={user.phone_number || '—'}
          />
          {user.profile && (
            <>
              <InfoRow
                icon={<LuIdCard className="size-4" />}
                label="Employee ID"
                value={user.profile.employee_id}
              />
              <InfoRow
                icon={<LuBuilding2 className="size-4" />}
                label="Department"
                value={user.profile.department || '—'}
              />
              <InfoRow
                icon={<LuBriefcase className="size-4" />}
                label="Position"
                value={user.profile.position || '—'}
              />
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Joining date"
                value={
                  <AppDate value={user.profile.joining_date} format="long" />
                }
              />
            </>
          )}
        </div>
      </Card>

      <p className="mt-6 text-sm text-slate-400">
        More of your dashboard — assigned tasks, pickups, and reports — is on
        the way.
      </p>
    </>
  );
};

DashboardPage.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default DashboardPage;
