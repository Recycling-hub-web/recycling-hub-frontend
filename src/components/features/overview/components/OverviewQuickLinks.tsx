import Link from 'next/link';

import type { NavItem } from '../../../layout/Sidebar';

type OverviewQuickLinksProps = {
  /** A role's full sidebar nav config (ADMIN_NAV_ITEMS /
   * OPERATIONAL_ROLES[role].navItems) — reused as-is rather than a
   * second, separately-maintained list of "modules this role has". */
  navItems: NavItem[];
  /** The role's own "Overview" href — excluded so this never links to
   * itself. */
  ownHref: string;
};

/** One link-card per module a role actually has. Renders nothing when
 * that's zero modules (today's reality for Driver/Receiving
 * Officer/Accounting) — the caller's "more is on the way" note covers
 * that case instead. */
const OverviewQuickLinks = ({ navItems, ownHref }: OverviewQuickLinksProps) => {
  const items = navItems.filter((item) => item.href !== ownHref);

  if (items.length === 0) return null;

  return (
    <div className="mb-5" data-testid="overview-quick-links">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Quick links
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-start gap-2.5 rounded-2xl border border-slate-100 bg-white p-4 transition-colors hover:border-brand-200"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
              <Icon className="size-4" />
            </span>
            <span className="text-sm font-semibold text-neutral-950">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { OverviewQuickLinks };
