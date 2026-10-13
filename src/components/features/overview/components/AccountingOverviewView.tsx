'use client';

import { LuCalendarCheck, LuFileClock, LuWallet } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { DonutChart } from '../../../ui/charts';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { useAccountingOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Accounting's own "what do I need to do today" — the first two
 * tiles come from the same `status: 'claimed'` aggregate
 * (useAccountingOverviewStats, backed by AccountingOverviewStatsView) —
 * a driver has claimed it, accounting hasn't verified/reimbursed it
 * yet. "Amount pending" is now a real server-side Sum, not a
 * client-side sum capped at 200 fetched rows. "Reimbursed this month"
 * and the status-breakdown chart are new, mirroring the chart treatment
 * Admin/Driver/Staff/Receiving already have. */
const AccountingOverviewView = () => {
  const stats = useAccountingOverviewStats();

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
      navItems={OPERATIONAL_ROLES.accounting.navItems}
      ownHref="/accounting"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuFileClock}
            label="Unverified records"
            value={stats.loading ? null : stats.count}
            href="/accounting/finance"
          />
          <OverviewStatCard
            icon={LuWallet}
            label="Amount pending"
            value={stats.loading ? null : `RM${stats.amountPending.toFixed(2)}`}
            href="/accounting/finance"
          />
          <OverviewStatCard
            icon={LuCalendarCheck}
            label="Reimbursed this month"
            value={
              stats.loading
                ? null
                : `RM${stats.amountReimbursedThisMonth.toFixed(2)}`
            }
            href="/accounting/finance"
          />
        </OverviewStatGrid>
      }
      extra={
        <div className="grid grid-cols-1 gap-4">
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

export { AccountingOverviewView };
