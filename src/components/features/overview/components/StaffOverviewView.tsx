'use client';

import { LuMail, LuNewspaper, LuTruck } from 'react-icons/lu';

import { OPERATIONAL_ROLES } from '../../../../layouts/operationalRoles';
import { useStaffOverviewStats } from '../hooks';
import { OverviewStatCard } from './OverviewStatCard';
import { OverviewStatGrid } from './OverviewStatGrid';
import { RoleOverviewLayout } from './RoleOverviewLayout';

/** Same shape as AdminOverviewView, minus the Users stat — Staff has no
 * Users module/access. Quick links reuse
 * OPERATIONAL_ROLES.staff.navItems, the same list OperationalLayout
 * passes to Sidebar. */
const StaffOverviewView = () => {
  const stats = useStaffOverviewStats();

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
    />
  );
};

export { StaffOverviewView };
