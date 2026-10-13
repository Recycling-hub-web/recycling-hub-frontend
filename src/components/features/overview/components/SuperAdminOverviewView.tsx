'use client';

import {
  LuBuilding2,
  LuCrown,
  LuMapPin,
  LuShieldCheck,
  LuTruck,
  LuWallet,
} from 'react-icons/lu';

import { ROLE_LABELS, type UserRole } from '../../../../types/auth';
import { SUPER_ADMIN_NAV_ITEMS } from '../../../layout/SuperAdminSidebar';
import { SectionContainer } from '../../../ui/card/SectionContainer';
import { BarChart } from '../../../ui/charts';
import { useRoleLimits } from '../../users/hooks';
import { useSuperAdminOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Super Admin's own landing page (/super-admin) — separate from
 * AdminOverviewView, which Super Admin no longer lands on by default
 * (see ROLE_HOME). Quick links reuse SUPER_ADMIN_NAV_ITEMS (the same
 * list SuperAdminSidebar renders) rather than a second, separately-
 * maintained list. Seat limits (admin/super-admin usage) stay on
 * useRoleLimits, their own real backend mechanism; everything else
 * below is organization-wide operational/finance data
 * (useSuperAdminOverviewStats, SuperAdminOverviewStatsView) this page
 * didn't have before. */
const SuperAdminOverviewView = () => {
  const { limits, loading } = useRoleLimits();
  const stats = useSuperAdminOverviewStats();

  const usersByRoleData = stats.usersByRole
    ? (Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({
        label: ROLE_LABELS[role],
        count: stats.usersByRole![role],
      }))
    : [];

  return (
    <RoleOverviewLayout
      navItems={SUPER_ADMIN_NAV_ITEMS}
      ownHref="/super-admin"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuShieldCheck}
            label="Admins"
            value={
              loading || !limits
                ? null
                : `${limits.admin_used} of ${limits.admin_limit}`
            }
            href="/super-admin/administrators"
          />
          <OverviewStatCard
            icon={LuCrown}
            label="Super Admins"
            value={
              loading || !limits
                ? null
                : `${limits.super_admin_used} of ${limits.super_admin_limit}`
            }
            href="/super-admin/administrators"
          />
          <OverviewStatCard
            icon={LuTruck}
            label="Pickups this month"
            value={stats.totalPickupsThisMonth}
          />
          <OverviewStatCard
            icon={LuWallet}
            label="Reimbursed this month"
            value={
              stats.totalReimbursedThisMonth === null
                ? null
                : `RM${stats.totalReimbursedThisMonth.toFixed(2)}`
            }
          />
          <OverviewStatCard
            icon={LuMapPin}
            label="Active collection points"
            value={stats.activeCollectionPoints}
          />
          <OverviewStatCard
            icon={LuBuilding2}
            label="Active service areas"
            value={stats.activeServiceAreas}
          />
        </OverviewStatGrid>
      }
      extra={
        <div className="grid grid-cols-1 gap-4">
          <SectionContainer>
            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Users by role
            </h2>
            <BarChart
              data={usersByRoleData}
              xKey="label"
              series={[
                {
                  key: 'count',
                  label: 'Users',
                  color: '#007535',
                },
              ]}
              loading={!stats.usersByRole}
            />
          </SectionContainer>
        </div>
      }
    />
  );
};

export { SuperAdminOverviewView };
