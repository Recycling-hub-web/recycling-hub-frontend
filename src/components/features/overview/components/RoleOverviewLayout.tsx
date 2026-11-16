import type { ReactNode } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { ROLE_LABELS } from '../../../../types/auth';
import { PageContainer } from '../../../layout/PageContainer';
import type { NavItem } from '../../../layout/Sidebar';
import { PageHeader } from '../../../ui/PageHeader';
import { MobileCommandCard } from './MobileCommandCard';
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
  /** Anything bigger than a stat row — a chart (Admin only) or a short
   * table (Staff/Receiving Officer) — rendered below the stats. */
  extra?: ReactNode;
};

/** The page shell every role's Overview composes: welcome header,
 * optional stats, and the user's own profile (modules are reached from
 * the sidebar / tab bar). Shows the original "more is on the way"
 * placeholder note only while the role has no module besides Overview —
 * once it gains one this note quietly disappears on its own. */
const RoleOverviewLayout = ({
  navItems,
  ownHref,
  statGrid,
  extra,
}: RoleOverviewLayoutProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const hasModules = navItems.some((item) => item.href !== ownHref);

  return (
    <PageContainer variant="table">
      <PageHeader
        title={`Welcome, ${user.full_name.split(' ')[0]}`}
        subtitle={ROLE_LABELS[user.role]}
      />

      <MobileCommandCard navItems={navItems} />

      {/* One consistent gap between every section below the header —
       * works whether `extra` is a single block or (Staff/Driver/
       * Receiving) a Fragment of several, since a Fragment doesn't
       * wrap and its children become direct siblings here too. */}
      <div className="space-y-6">
        {statGrid}

        {extra}

        <ProfileSummaryCard />

        {!hasModules && (
          <p className="text-sm text-slate-400">
            More of your dashboard — assigned tasks, pickups, and reports — is
            on the way.
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export { RoleOverviewLayout };
