'use client';

import Link from 'next/link';
import { LuCalendarCheck, LuPackageCheck } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { BarChart, LineChart } from '../../../ui/charts';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import { STATUS_BADGE_VARIANT } from '../../pickups/constants';
import { itemsSummary, PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useReceivingOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const PREVIEW_SIZE = 5;
const columnCount = 3;

const dayLabel = (isoDate: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
    new Date(isoDate),
  );

/** Receiving Officer's own "what do I need to do today" — the awaiting-
 * close tile + preview table both come from the same `status:
 * 'delivered'` query ReceivingDeliveriesView's own default filter
 * already uses (see useReceivingOverviewStats). No verify/close action
 * here — that stays on the full Deliveries page; this is a glance, not
 * a second place to do the work. "Closed this month" + the
 * delivered/closed breakdown + the trend chart are real new aggregates
 * (ReceivingOverviewStatsView) this role didn't have before. */
const ReceivingOverviewView = () => {
  const {
    awaitingCloseCount,
    closedThisMonth,
    pickupStatusCounts,
    dailyClosedVolume,
    deliveries,
    loading,
    error,
    refetch,
  } = useReceivingOverviewStats();

  const pickupStatusData = pickupStatusCounts
    ? (['delivered', 'closed'] as const).map((s) => ({
        label: PICKUP_STATUS_LABELS[s],
        count: pickupStatusCounts[s],
      }))
    : [];

  const dailyVolumeData =
    dailyClosedVolume?.map((point) => ({
      x: dayLabel(point.date),
      count: point.count,
    })) ?? [];

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={refetch}
        />
      );
    if (deliveries.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="Nothing awaiting close right now"
        />
      );
    }
    return deliveries.slice(0, PREVIEW_SIZE).map((d) => (
      <tr key={d.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">{d.full_name}</td>
        <td className="px-6 py-4 text-slate-500">{itemsSummary(d.items)}</td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[d.status]}>
            {PICKUP_STATUS_LABELS[d.status]}
          </StatusBadge>
        </td>
      </tr>
    ));
  };

  return (
    <RoleOverviewLayout
      navItems={OPERATIONAL_ROLES.receiving_officer.navItems}
      ownHref="/receiving"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuPackageCheck}
            label="Awaiting close"
            value={awaitingCloseCount}
            href="/receiving/deliveries"
          />
          <OverviewStatCard
            icon={LuCalendarCheck}
            label="Closed this month"
            value={closedThisMonth}
            href="/receiving/deliveries"
          />
        </OverviewStatGrid>
      }
      extra={
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionContainer className="lg:col-span-2">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Daily closed deliveries — last 30 days
              </h2>
              <LineChart
                data={dailyVolumeData}
                xKey="x"
                series={[{ key: 'count', label: 'Closed' }]}
                loading={!dailyClosedVolume}
              />
            </SectionContainer>
            <SectionContainer>
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Deliveries by status
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
                loading={!pickupStatusCounts}
              />
            </SectionContainer>
          </div>

          {(loading || deliveries.length > 0) && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Awaiting close
                </h2>
                <Link
                  href="/receiving/deliveries"
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

export { ReceivingOverviewView };
