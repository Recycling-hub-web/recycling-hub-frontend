'use client';

import Link from 'next/link';
import { LuPackage, LuPackageCheck, LuRoute, LuTruck } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { BarChart, DonutChart } from '../../../ui/charts';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { DRIVER_FINANCE_STATUS_LABELS } from '../../finance/types';
import { STATUS_BADGE_VARIANT } from '../../pickups/constants';
import { itemsSummary, PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useDriverOverviewStats, useDriverPickupVolume } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { PickupVolumeChart } from './PickupVolumeChart';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const PREVIEW_SIZE = 5;
const columnCount = 3;

/** Driver-scoped task counts, status charts and an assigned-pickups preview.
 * Route stops come from the server aggregate; preview rows reuse the scheduled
 * orders query. Collection actions stay on the dedicated pickups page. */
const DriverOverviewView = () => {
  const stats = useDriverOverviewStats();

  let routeValue: string | null = null;
  if (!stats.routeLoading && !stats.routeError) {
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
          DRIVER_FINANCE_STATUS_LABELS,
        ) as (keyof typeof DRIVER_FINANCE_STATUS_LABELS)[]
      ).map((s) => ({
        key: s,
        label: DRIVER_FINANCE_STATUS_LABELS[s],
        value: stats.financeStatusCounts![s],
        variant:
          s === 'claimed' || s === 'verified'
            ? ('success' as const)
            : FINANCE_STATUS_BADGE_VARIANT[s],
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
          icon={<LuTruck className="size-6" />}
          title="No assigned pickups right now"
          subtitle="Pickups assigned to you will show up here."
        />
      );
    }
    return stats.assigned.slice(0, PREVIEW_SIZE).map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">
          {r.pickup_request.full_name}
        </td>
        <td className="px-6 py-4 text-slate-500">{itemsSummary(r.items)}</td>
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
            error={stats.availableError}
            onRetry={stats.refetchAvailable}
            value={stats.availableCount}
            href="/driver/pickups"
          />
          <OverviewStatCard
            icon={LuPackageCheck}
            label="My assigned pickups"
            error={stats.assignedError}
            onRetry={stats.refetchAssigned}
            value={stats.assignedCount}
            href="/driver/pickups"
          />
          <OverviewStatCard
            icon={LuRoute}
            label="Open route"
            error={stats.routeError}
            onRetry={stats.refetchRoute}
            value={routeValue}
            href="/driver/pickups"
          />
        </OverviewStatGrid>
      }
      extra={
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PickupVolumeChart
              useVolume={useDriverPickupVolume}
              title="My pickup volume"
              seriesLabel="My pickups"
              unitLabel="pickups created"
              emptyMessage="No pickups in this range."
            />
            <SectionContainer>
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
                loading={stats.statusLoading}
                error={stats.statusError}
                onRetry={stats.refetchStatuses}
              />
            </SectionContainer>
            <SectionContainer>
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                My money by status
              </h2>
              <DonutChart
                data={financeStatusData}
                loading={stats.statusLoading}
                error={stats.statusError}
                onRetry={stats.refetchStatuses}
              />
            </SectionContainer>
          </div>

          {(stats.assignedLoading ||
            stats.assignedError ||
            stats.assigned.length > 0) && (
            <div>
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
