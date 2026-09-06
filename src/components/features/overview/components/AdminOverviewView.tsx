'use client';

import { LuMail, LuNewspaper, LuTruck, LuUsers } from 'react-icons/lu';

import { ADMIN_NAV_ITEMS } from '../../../layout/AdminSidebar';
import { useAdminOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Replaces the old `redirect('/admin/users')` — /admin is now a real
 * dashboard. Quick links reuse ADMIN_NAV_ITEMS (the same list
 * AdminSidebar renders) rather than a second, separately-maintained
 * list of admin modules. */
const AdminOverviewView = () => {
  const stats = useAdminOverviewStats();

  return (
    <RoleOverviewLayout
      navItems={ADMIN_NAV_ITEMS}
      ownHref="/admin"
      statGrid={
        <OverviewStatGrid>
          <OverviewStatCard
            icon={LuUsers}
            label="Total users"
            value={stats.totalUsers}
            href="/admin/users"
          />
          <OverviewStatCard
            icon={LuTruck}
            label="Pending pickups"
            value={stats.pendingPickups}
            href="/admin/pickups"
          />
          <OverviewStatCard
            icon={LuMail}
            label="Pending messages"
            value={stats.pendingMessages}
            href="/admin/contact"
          />
          <OverviewStatCard
            icon={LuNewspaper}
            label="Published posts"
            value={stats.publishedPosts}
            href="/admin/blogs"
          />
        </OverviewStatGrid>
      }
    />
  );
};

export { AdminOverviewView };
