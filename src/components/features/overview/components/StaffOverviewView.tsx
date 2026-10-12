'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuMail,
  LuNewspaper,
  LuTruck,
  LuUserRoundSearch,
} from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { BarChart, DonutChart, LineChart } from '../../../ui/charts';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { QuickLeadTable } from '../../pickups/components/admin/QuickLeadTable';
import {
  useMarkQuickPickupRequestContacted,
  useQuickPickupRequests,
} from '../../pickups/hooks';
import type { PickupQuickRequestListItem } from '../../pickups/types';
import { PICKUP_STATUS_LABELS } from '../../pickups/types';
import { useStaffOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const LEADS_PREVIEW_SIZE = 5;

const dayLabel = (isoDate: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(
    new Date(isoDate),
  );

/** Same shape as AdminOverviewView, minus the Users stat — Staff has no
 * Users module/access, so the shared AdminOverviewStatsView endpoint
 * simply never returns `total_users` for a staff caller. Quick links
 * reuse OPERATIONAL_ROLES.staff.navItems, the same list
 * OperationalLayout passes to Sidebar.
 *
 * The "Uncontacted leads" stat + preview table below it both come from
 * the same `status: 'new'` query (a lead is only ever "new" — never
 * yet contacted) — its own `count` is the real server-side total, and
 * the first few of its `results` are shown directly via QuickLeadTable
 * (same table PickupRequestsView's Quick Leads tab uses), not a
 * separately-derived number. The charts below that are the same
 * Bar/Donut/LineChart blocks AdminOverviewView renders, built from the
 * same endpoint's data. */
const StaffOverviewView = () => {
  const stats = useStaffOverviewStats();
  const {
    requests: newLeads,
    count: newLeadsCount,
    loading: loadingLeads,
    error: leadsError,
    refetch: refetchLeads,
  } = useQuickPickupRequests({ status: 'new' });
  const { execute: markContacted } = useMarkQuickPickupRequestContacted();
  const [markingContactedId, setMarkingContactedId] = useState<string | null>(
    null,
  );

  const handleMarkContacted = async (lead: PickupQuickRequestListItem) => {
    setMarkingContactedId(lead.id);
    try {
      await markContacted(lead.id);
      refetchLeads();
    } finally {
      setMarkingContactedId(null);
    }
  };

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
      navItems={OPERATIONAL_ROLES.staff.navItems}
      ownHref="/staff"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuTruck}
            label="Pending pickups"
            value={stats.pendingPickups}
            href="/staff/pickups"
          />
          <OverviewStatCard
            icon={LuUserRoundSearch}
            label="Uncontacted leads"
            value={loadingLeads ? null : newLeadsCount}
            href="/staff/pickups"
          />
          <OverviewStatCard
            icon={LuMail}
            label="Pending messages"
            value={stats.pendingMessages}
            href="/staff/contact"
          />
          <OverviewStatCard
            icon={LuNewspaper}
            label="Published posts"
            value={stats.publishedPosts}
            href="/staff/blogs"
          />
        </OverviewStatGrid>
      }
      extra={
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionContainer className="lg:col-span-2">
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Daily pickup volume — last 30 days
              </h2>
              <LineChart
                data={dailyVolumeData}
                xKey="x"
                series={[{ key: 'count', label: 'Pickup requests' }]}
                loading={!stats.dailyVolume}
              />
            </SectionContainer>
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

          {(loadingLeads || newLeadsCount > 0) && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  Uncontacted leads
                </h2>
                <Link
                  href="/staff/pickups"
                  className="text-xs font-medium text-brand-600 hover:underline"
                >
                  View all
                </Link>
              </div>
              <QuickLeadTable
                leads={newLeads.slice(0, LEADS_PREVIEW_SIZE)}
                loading={loadingLeads}
                error={leadsError}
                onRetry={refetchLeads}
                basePath="/staff/pickups"
                onMarkContacted={handleMarkContacted}
                markingContactedId={markingContactedId}
              />
            </div>
          )}
        </>
      }
    />
  );
};

export { StaffOverviewView };
