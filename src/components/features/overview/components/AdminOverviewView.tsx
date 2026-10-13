'use client';

import { LuMail, LuNewspaper, LuTruck, LuUsers } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { adminNavItemsFor } from '../../../../layouts/navigation';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { BarChart, DonutChart } from '../../../ui/charts';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useAdminOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { PickupVolumeChart } from './PickupVolumeChart';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Replaces the old `redirect('/admin/users')` — /admin is now a real
 * dashboard. Quick links reuse adminNavItemsFor (the same role-aware
 * list AdminLayout's sidebar renders) rather than a second, separately-maintained
 * list of admin modules. The pickup volume trend (PickupVolumeChart,
 * shared with Staff) has its own endpoint and range picker — it's a real
 * cross-module/cross-driver aggregate, not something any one role's
 * own scoped data could produce. The status-breakdown Bar/DonutCharts
 * are the same pattern DriverOverviewView reuses for its own
 * (already-scoped) pickup/finance data. */
const AdminOverviewView = () => {
  const { user } = useAuth();
  const stats = useAdminOverviewStats();

  const pickupStatusData = stats.pickupStatusCounts
    ? (
        Object.keys(
          PICKUP_STATUS_LABELS,
        ) as (keyof typeof PICKUP_STATUS_LABELS)[]
      ).map((s) => ({
        label: PICKUP_STATUS_LABELS[s],
        count: stats.pickupStatusCounts![s],
      }))
    : [];

  const financeStatusData = stats.financeStatusCounts
    ? (
        Object.keys(
          FINANCE_STATUS_LABELS,
        ) as (keyof typeof FINANCE_STATUS_LABELS)[]
      ).map((s) => ({
        key: s,
        label: FINANCE_STATUS_LABELS[s],
        value: stats.financeStatusCounts![s],
        variant: FINANCE_STATUS_BADGE_VARIANT[s],
      }))
    : [];

  return (
    <RoleOverviewLayout
      navItems={adminNavItemsFor(user?.role)}
      ownHref="/admin"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuUsers}
            label="Total users"
            value={stats.totalUsers}
            href="/admin/users"
          />
          <OverviewStatCard
            icon={LuTruck}
            label="Pending pickups"
            value={stats.pendingPickups}
            href="/admin/pickups"
          />
          <OverviewStatCard
            icon={LuMail}
            label="Pending messages"
            value={stats.pendingMessages}
            href="/admin/contact"
          />
          <OverviewStatCard
            icon={LuNewspaper}
            label="Published posts"
            value={stats.publishedPosts}
            href="/admin/blogs"
          />
        </OverviewStatGrid>
      }
      extra={
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PickupVolumeChart />
          <SectionContainer>
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Pickup requests by status
            </h2>
            <BarChart
              data={pickupStatusData}
              xKey="label"
              series={[
                {
                  key: 'count',
                  label: 'Requests',
                  color: '#007535',
                },
              ]}
              loading={!stats.pickupStatusCounts}
            />
          </SectionContainer>
          <SectionContainer>
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Finance records by status
            </h2>
            <DonutChart
              data={financeStatusData}
              loading={!stats.financeStatusCounts}
            />
          </SectionContainer>
        </div>
      }
    />
  );
};

export { AdminOverviewView };
