import { LuLayoutDashboard, LuMail } from 'react-icons/lu';

import type { NavItem } from '../components/layout/Sidebar';
import type { UserRole } from '../types/auth';

type OperationalRole = Exclude<UserRole, 'admin' | 'resident'>;

type OperationalRoleConfig = {
  route: string;
  navItems: NavItem[];
};

// Each role's own route + sidebar. Only "Overview" (and, for staff,
// "Contact") is wired to real pages today — the rest of each role's
// section (assigned tasks, pickups, reports) lands here as that workflow
// work gets built, same "roles first, then workflows" pattern the admin
// sidebar started with. Staff sees the same Contact inbox admin does
// (ContactMessagesView, basePath="/staff/contact") but without delete —
// enforced on the backend too (ContactMessageViewSet.get_permissions),
// not just a hidden button here.
const OPERATIONAL_ROLES: Record<OperationalRole, OperationalRoleConfig> = {
  staff: {
    route: '/staff',
    navItems: [
      { href: '/staff', label: 'Overview', icon: LuLayoutDashboard },
      { href: '/staff/contact', label: 'Contact', icon: LuMail },
    ],
  },
  driver: {
    route: '/driver',
    navItems: [{ href: '/driver', label: 'Overview', icon: LuLayoutDashboard }],
  },
  receiving_officer: {
    route: '/receiving',
    navItems: [
      { href: '/receiving', label: 'Overview', icon: LuLayoutDashboard },
    ],
  },
  accounting: {
    route: '/accounting',
    navItems: [
      { href: '/accounting', label: 'Overview', icon: LuLayoutDashboard },
    ],
  },
};

export { OPERATIONAL_ROLES };
export type { OperationalRole };
