'use client';

import { LuCalendarCheck, LuFileClock, LuWallet } from 'react-icons/lu';

import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { formatMYR } from '../../../../lib/money';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { DonutChart } from '../../../ui/charts';
import { STATUS_BADGE_VARIANT as FINANCE_STATUS_BADGE_VARIANT } from '../../finance/constants';
import { FINANCE_STATUS_LABELS } from '../../finance/types';
import { useAccountingOverviewStats, useAccountingVolume } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { PickupVolumeChart } from './PickupVolumeChart';
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
  const { t } = usePortalLocale();
  const stats = useAccountingOverviewStats();

  const financeStatusData = stats.financeStatusCounts
    ? (
        Object.keys(
          FINANCE_STATUS_LABELS,
        ) as (keyof typeof FINANCE_STATUS_LABELS)[]
      ).map((s) => ({
        key: s,
        label: t(FINANCE_STATUS_LABELS[s]),
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
            label={t('Unverified records')}
            value={stats.loading ? null : stats.count}
            href="/accounting/finance"
            error={stats.error}
            onRetry={stats.refetch}
          />
          <OverviewStatCard
            icon={LuWallet}
            label={t('Amount pending')}
            value={stats.loading ? null : formatMYR(stats.amountPending)}
            href="/accounting/finance"
            error={stats.error}
            onRetry={stats.refetch}
          />
          <OverviewStatCard
            icon={LuCalendarCheck}
            label={t('Reimbursed this month')}
            value={
              stats.loading ? null : formatMYR(stats.amountReimbursedThisMonth)
            }
            href="/accounting/finance"
            error={stats.error}
            onRetry={stats.refetch}
          />
        </OverviewStatGrid>
      }
      extra={
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <PickupVolumeChart
            useVolume={useAccountingVolume}
            title={t('Reimbursed volume')}
            seriesLabel={t('Reimbursements')}
            unitLabel={t('reimbursements processed')}
            emptyMessage={t('No reimbursements in this range.')}
          />
          <SectionContainer className="lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              {t('Finance records by status')}
            </h2>
            <DonutChart
              data={financeStatusData}
              loading={stats.loading}
              error={stats.error}
              onRetry={stats.refetch}
            />
          </SectionContainer>
        </div>
      }
    />
  );
};

export { AccountingOverviewView };
