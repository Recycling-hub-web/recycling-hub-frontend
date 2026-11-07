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
import { DonutChart } from '../../../ui/charts';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { QuickLeadTable } from '../../pickups/components/admin/QuickLeadTable';
import {
  useMarkQuickPickupRequestContacted,
  useQuickPickupRequests,
} from '../../pickups/hooks';
import type { PickupQuickRequestListItem } from '../../pickups/types';
import { usePickupWeek, useStaffOverviewStats } from '../hooks';
import { OrderStatusGaugeCard } from './OrderStatusGaugeCard';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { PickupHeatmapCard } from './PickupHeatmapCard';
import { PickupsThisWeekCard } from './PickupsThisWeekCard';
import { PickupVolumeChart } from './PickupVolumeChart';
import { RequestsThisWeekStat } from './RequestsThisWeekStat';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const LEADS_PREVIEW_SIZE = 5;

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
 * separately-derived number. The charts below that are the same blocks
 * AdminOverviewView renders: the Bar/Donut status breakdowns from the
 * same stats endpoint, and the shared PickupVolumeChart. */
const StaffOverviewView = () => {
  const stats = useStaffOverviewStats();
  const week = usePickupWeek();
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
      navItems={OPERATIONAL_ROLES.staff.navItems}
      ownHref="/staff"
      statGrid={
        <OverviewStatGrid>
          <RequestsThisWeekStat
            href="/staff/pickup-requests"
            week={week}
            className="col-span-2 lg:col-span-1 lg:row-span-2"
          />
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PickupsThisWeekCard
              requestsHref="/staff/pickup-requests"
              week={week}
            />
            <OrderStatusGaugeCard counts={stats.pickupStatusCounts} />
            <SectionContainer>
              <h2 className="mb-4 text-sm font-semibold text-slate-900">
                Finance records by status
              </h2>
              <DonutChart
                data={financeStatusData}
                loading={!stats.financeStatusCounts}
              />
            </SectionContainer>
            <PickupHeatmapCard />
            <PickupVolumeChart />
          </div>

          {(loadingLeads || newLeadsCount > 0) && (
            <div>
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
