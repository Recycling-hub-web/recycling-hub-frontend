'use client';

import { LuMail, LuNewspaper, LuTruck, LuUsers } from 'react-icons/lu';

import { ADMIN_NAV_ITEMS } from '../../../layout/AdminSidebar';
import { BarChart, DonutChart, LineChart } from '../../../ui/charts';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useAdminOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const dayLabel = (isoDate: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
    new Date(isoDate),
  );

/** Replaces the old `redirect('/admin/users')` — /admin is now a real
 * dashboard. Quick links reuse ADMIN_NAV_ITEMS (the same list
 * AdminSidebar renders) rather than a second, separately-maintained
 * list of admin modules. The daily-volume trend chart is the one place
 * in the app a LineChart backed by a genuinely new endpoint
 * (CollectionRequestViewSet.daily_volume) lives — it's a real
 * cross-module/cross-driver aggregate, not something any one role's
 * own scoped data could produce. The status-breakdown Bar/DonutCharts
 * are the same pattern DriverOverviewView reuses for its own
 * (already-scoped) pickup/finance data. */
const AdminOverviewView = () => {
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

  const dailyVolumeData =
    stats.dailyVolume?.map((point) => ({
      x: dayLabel(point.date),
      count: point.count,
    })) ?? [];

  return (
    <RoleOverviewLayout
      navItems={ADMIN_NAV_ITEMS}
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
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Daily pickup volume — last 30 days
            </h2>
            <LineChart
              data={dailyVolumeData}
              xKey="x"
              series={[{ key: 'count', label: 'Pickup requests' }]}
              loading={!stats.dailyVolume}
            />
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
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
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Finance records by status
            </h2>
            <DonutChart
              data={financeStatusData}
              loading={!stats.financeStatusCounts}
            />
          </div>
        </div>
      }
    />
  );
};

export { AdminOverviewView };
