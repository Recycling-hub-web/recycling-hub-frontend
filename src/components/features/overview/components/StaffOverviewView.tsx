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
import { QuickLeadTable } from '../../pickups/components/QuickLeadTable';
import {
  useMarkQuickPickupRequestContacted,
  useQuickPickupRequests,
} from '../../pickups/hooks';
import type { PickupQuickRequestListItem } from '../../pickups/types';
import { useStaffOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

const LEADS_PREVIEW_SIZE = 5;

/** Same shape as AdminOverviewView, minus the Users stat — Staff has no
 * Users module/access. Quick links reuse
 * OPERATIONAL_ROLES.staff.navItems, the same list OperationalLayout
 * passes to Sidebar.
 *
 * The "Uncontacted leads" stat + preview table below it both come from
 * the same `status: 'new'` query (a lead is only ever "new" — never
 * yet contacted) — its own `count` is the real server-side total, and
 * the first few of its `results` are shown directly via QuickLeadTable
 * (same table PickupRequestsView's Quick Leads tab uses), not a
 * separately-derived number. */
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
        (loadingLeads || newLeadsCount > 0) && (
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
        )
      }
    />
  );
};

export { StaffOverviewView };
