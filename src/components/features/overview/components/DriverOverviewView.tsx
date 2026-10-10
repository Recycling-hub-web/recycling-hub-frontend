'use client';

import Link from 'next/link';
import { LuPackage, LuPackageCheck, LuRoute } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { BarChart, DonutChart } from '../../../ui/charts';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { STATUS_BADGE_VARIANT } from '../../pickups/constants';
import { PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useDriverOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const PREVIEW_SIZE = 5;
const columnCount = 3;

/** Driver's own "what do I need to do today" — a stat row, the same
 * pickup/finance status-breakdown charts Admin's dashboard uses (see
 * AdminOverviewView), and a short preview table of their own assigned
 * stops (same shape as Staff's uncontacted-leads table and Receiving
 * Officer's awaiting-close table). Unlike Admin's charts, these need
 * no new backend endpoint at all — CollectionRequestViewSet and
 * FinanceRecordViewSet already scope a driver's own list calls to
 * "mine" server-side (see useDriverOverviewStats), so a per-status
 * count here is already this driver's own data, not a cross-driver
 * aggregate. The assigned-pickups table reuses the exact
 * `status: 'scheduled'` rows the stat tiles are already built from —
 * no second fetch. No claim/collect actions here — those stay on the
 * real task list at /driver/pickups; this is a glance, not a second
 * place to do the work. "Open route" isn't a dedicated endpoint —
 * every pickup list row already carries its own `route` field, so an
 * open route's stop count is just how many of the driver's own
 * `scheduled` rows currently point at a route still `status: 'open'`. */
const DriverOverviewView = () => {
  const stats = useDriverOverviewStats();

  let routeValue: string | null = null;
  if (!stats.routeLoading) {
    routeValue =
      stats.openRouteStops > 0
        ? `${stats.openRouteStops} stop${stats.openRouteStops === 1 ? '' : 's'}`
        : 'None';
  }

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

  const renderRows = () => {
    if (stats.assignedLoading) return <TableLoadingRow colSpan={columnCount} />;
    if (stats.assignedError)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={stats.assignedError}
          onRetry={stats.refetchAssigned}
        />
      );
    if (stats.assigned.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No assigned pickups right now"
        />
      );
    }
    return stats.assigned.slice(0, PREVIEW_SIZE).map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">{r.full_name}</td>
        <td className="px-6 py-4 text-slate-500">{r.category.name}</td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[r.status]}>
            {PICKUP_STATUS_LABELS[r.status]}
          </StatusBadge>
        </td>
      </tr>
    ));
  };

  return (
    <RoleOverviewLayout
      navItems={OPERATIONAL_ROLES.driver.navItems}
      ownHref="/driver"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuPackage}
            label="Available pickups"
            value={stats.availableCount}
            href="/driver/pickups"
          />
          <OverviewStatCard
            icon={LuPackageCheck}
            label="My assigned pickups"
            value={stats.assignedCount}
            href="/driver/pickups"
          />
          <OverviewStatCard
            icon={LuRoute}
            label="Open route"
            value={routeValue}
            href="/driver/pickups"
          />
        </OverviewStatGrid>
      }
      extra={
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                My pickups by status
              </h2>
              <BarChart
                data={pickupStatusData}
                xKey="label"
                series={[
                  {
                    key: 'count',
                    label: 'Pickups',
                    color: '#007535',
                  },
                ]}
                loading={!stats.pickupStatusCounts}
              />
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                My money by status
              </h2>
              <DonutChart
                data={financeStatusData}
                loading={!stats.financeStatusCounts}
              />
            </div>
          </div>

          {(stats.assignedLoading || stats.assigned.length > 0) && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  My assigned pickups
                </h2>
                <Link
                  href="/driver/pickups"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              <TableWrapper>
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-slate-500">
                        Requester
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-500">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left font-semibold text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {renderRows()}
                  </tbody>
                </table>
              </TableWrapper>
            </div>
          )}
        </>
      }
    />
  );
};

export { DriverOverviewView };
