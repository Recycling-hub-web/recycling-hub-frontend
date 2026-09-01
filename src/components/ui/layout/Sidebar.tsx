import Link from 'next/link';
import { useRouter } from 'next/router';
import type { IconType } from 'react-icons';

type NavItem = {
  href: string;
  label: string;
  icon: IconType;
};

type SidebarProps = {
  navItems: NavItem[];
};

/** Reusable sidebar shell for every authenticated layout (Admin, and the
 * shared Staff/Driver/Receiving Officer/Accounting dashboard) — each
 * layout just supplies its own `navItems`. Active-route highlighting via
 * an exact `router.pathname` match. */
const Sidebar = ({ navItems }: SidebarProps) => {
  const router = useRouter();

  return (
    <nav className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-6">
      <Link
        href="/"
        className="mb-8 px-3 font-montserrat text-lg font-bold text-neutral-950"
      >
        Recycling Hub
      </Link>
      <ul className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { Sidebar };
export type { NavItem };
