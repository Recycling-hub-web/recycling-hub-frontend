import {
  LuHardDrive,
  LuLayers,
  LuLayoutDashboard,
  LuMail,
  LuTag,
  LuTruck,
} from 'react-icons/lu';

import type { NavItem } from '../components/layout/Sidebar';
import type { UserRole } from '../types/auth';

type OperationalRole = Exclude<UserRole, 'admin' | 'resident'>;

type OperationalRoleConfig = {
  route: string;
  navItems: NavItem[];
};

// Each role's own route + sidebar. Only "Overview" (and, for staff,
// "Pickup Requests"/"Contact"/"Categories"/"Classifications"/"Storage
// Files") is wired to real pages today — the rest of each role's section
// (assigned tasks, reports) lands here as that workflow work gets built,
// same "roles first, then workflows" pattern the admin sidebar started
// with. Staff sees the same pickups/contact management admin does (same
// components, basePath="/staff/…") but without contact delete —
// enforced on the backend too (ContactMessageViewSet.get_permissions),
// not just a hidden button here. Pickups, Categories, Classifications,
// and Storage Files have no such split: admin and staff share identical
// permissions on all four modules (CollectionRequestViewSet /
// CategoryViewSet + IsStaffOrReadOnly / ClassificationView /
// FileRecordViewSet + IsAdminOrStaffUser).
const OPERATIONAL_ROLES: Record<OperationalRole, OperationalRoleConfig> = {
  staff: {
    route: '/staff',
    navItems: [
      { href: '/staff', label: 'Overview', icon: LuLayoutDashboard },
      { href: '/staff/pickups', label: 'Pickup Requests', icon: LuTruck },
      { href: '/staff/contact', label: 'Contact', icon: LuMail },
      { href: '/staff/categories', label: 'Categories', icon: LuTag },
      {
        href: '/staff/classifications',
        label: 'Classifications',
        icon: LuLayers,
      },
      {
        href: '/staff/storage-files',
        label: 'Storage Files',
        icon: LuHardDrive,
      },
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
