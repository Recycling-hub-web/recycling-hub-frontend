import { LuLayoutDashboard } from 'react-icons/lu';

import type { NavItem } from '../components/layout/Sidebar';
import type { UserRole } from '../types/auth';

type OperationalRole = Exclude<UserRole, 'admin' | 'resident'>;

type OperationalRoleConfig = {
  route: string;
  navItems: NavItem[];
};

// Each role's own route + sidebar. Only "Overview" is wired to a real page
// today — role-specific sections (assigned tasks, pickups, reports) land
// here as that workflow work gets built, same "roles first, then
// workflows" pattern AdminSidebar started with (Users-only, before pickups/
// collection points/reports existed).
const OPERATIONAL_ROLES: Record<OperationalRole, OperationalRoleConfig> = {
  staff: {
    route: '/staff',
    navItems: [{ href: '/staff', label: 'Overview', icon: LuLayoutDashboard }],
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
