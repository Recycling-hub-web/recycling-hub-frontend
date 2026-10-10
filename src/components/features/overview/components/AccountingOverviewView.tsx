'use client';

import { LuFileClock, LuWallet } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { useAccountingOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Accounting's own "what do I need to do today" — a stat row only, no
 * table and no chart (charts stay on Admin's own dashboard — see
 * AdminOverviewView's own docstring). Both numbers come from the same
 * `status: 'claimed'` query (see useAccountingOverviewStats) — a
 * driver has claimed it, accounting hasn't verified/reimbursed it
 * yet. */
const AccountingOverviewView = () => {
  const stats = useAccountingOverviewStats();

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
        </OverviewStatGrid>
      }
    />
  );
};

export { AccountingOverviewView };
