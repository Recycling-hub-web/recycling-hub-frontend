import type { ReactNode } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { ROLE_LABELS } from '../../../../types/auth';
import type { NavItem } from '../../../layout/Sidebar';
import { PageHeader } from '../../../ui/PageHeader';
import { OverviewQuickLinks } from './OverviewQuickLinks';
import { ProfileSummaryCard } from './ProfileSummaryCard';

type RoleOverviewLayoutProps = {
  /** The role's full sidebar nav config (ADMIN_NAV_ITEMS /
   * OPERATIONAL_ROLES[role].navItems). */
  navItems: NavItem[];
  /** The role's own "Overview" href, e.g. `/admin` or `/driver`. */
  ownHref: string;
  /** Admin/Staff pass their OverviewStatGrid here; the three roles with
   * no workflow data yet omit it. */
  statGrid?: ReactNode;
};

/** The page shell every role's Overview composes: welcome header,
 * optional stats, quick links to whatever modules this role actually
 * has, and the user's own profile. Shows the original "more is on the
 * way" placeholder note only while there are no quick links yet — once
 * a role gains its first real module this note quietly disappears on
 * its own. */
const RoleOverviewLayout = ({
  navItems,
  ownHref,
  statGrid,
}: RoleOverviewLayoutProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const hasQuickLinks = navItems.some((item) => item.href !== ownHref);

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.full_name.split(' ')[0]}`}
        subtitle={ROLE_LABELS[user.role]}
      />

      {statGrid}

      <OverviewQuickLinks navItems={navItems} ownHref={ownHref} />

      <ProfileSummaryCard />

      {!hasQuickLinks && (
        <p className="mt-6 text-sm text-slate-400">
          More of your dashboard — assigned tasks, pickups, and reports — is on
          the way.
        </p>
      )}
    </>
  );
};

export { RoleOverviewLayout };
