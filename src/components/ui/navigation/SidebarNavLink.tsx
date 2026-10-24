import Link from 'next/link';

import type { NavItem } from './navItems';

type SidebarNavLinkProps = Omit<NavItem, 'children'> & {
  active: boolean;
};

/** One sidebar menu entry — icon + label, with the brand-colored active
 * state (tinted background plus a bar on the leading edge). Purely
 * presentational: the caller decides which entry is active (see
 * getActiveHref). */
const SidebarNavLink = ({
  href,
  label,
  icon: Icon,
  active,
}: SidebarNavLinkProps) => (
  <li className="relative">
    {/* Always rendered so the marker can grow/fade in instead of
        popping. */}
    <span
      className={`absolute inset-y-2 start-0 w-1 rounded-full bg-brand-600 transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none ${
        active ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
      }`}
      aria-hidden="true"
    />
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2.5 rounded-xl py-2.5 pe-3 ps-4 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${
        active
          ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-600/10'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  </li>
);

export { SidebarNavLink };
