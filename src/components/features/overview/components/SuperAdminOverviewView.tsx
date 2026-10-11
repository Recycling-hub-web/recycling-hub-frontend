'use client';

import { LuCrown, LuShieldCheck } from 'react-icons/lu';

import { SUPER_ADMIN_NAV_ITEMS } from '../../../layout/SuperAdminSidebar';
import { useRoleLimits } from '../../users/hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Super Admin's own landing page (/super-admin) — separate from
 * AdminOverviewView, which Super Admin no longer lands on by default
 * (see ROLE_HOME). Quick links reuse SUPER_ADMIN_NAV_ITEMS (the same
 * list SuperAdminSidebar renders, "Admin Workspace" included) rather
 * than a second, separately-maintained list. */
const SuperAdminOverviewView = () => {
  const { limits, loading } = useRoleLimits();

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
        </OverviewStatGrid>
      }
    />
  );
};

export { SuperAdminOverviewView };
