import {
  LuHandshake,
  LuHardDrive,
  LuLayers,
  LuLayoutDashboard,
  LuMail,
  LuNewspaper,
  LuTag,
  LuTruck,
  LuWallet,
} from 'react-icons/lu';

import type { NavItem } from '../components/layout/Sidebar';
import type { UserRole } from '../types/auth';

type OperationalRole = Exclude<UserRole, 'admin'>;

type OperationalRoleConfig = {
  route: string;
  navItems: NavItem[];
};

// Each role's own route + sidebar. Only "Overview" (and, for staff,
// "Pickup Requests"/"Contact"/"Categories"/"Classifications"/"Storage
// Files"/"Blog Posts"/"Partnerships"; for driver, its own scoped
// "Pickup Requests"; for accounting, "Finance Records") is wired to
// real pages today — the rest of each role's section (assigned tasks,
// reports) lands here as that workflow work gets built, same "roles
// first, then workflows" pattern the admin sidebar started with. Staff
// sees the same pickups/contact management admin does (same
// components, basePath="/staff/…") but without contact delete —
// enforced on the backend too (ContactMessageViewSet.get_permissions),
// not just a hidden button here. Pickups, Categories, Classifications,
// Storage Files, Blog Posts, and Partnerships have no such split: admin
// and staff share identical permissions on all six modules
// (CollectionRequestViewSet / CategoryViewSet + IsStaffOrReadOnly /
// ClassificationView / FileRecordViewSet + IsAdminOrStaffUser /
// BlogPostViewSet + IsStaffOrReadOnly / PartnerViewSet +
// IsStaffOrReadOnly). Driver's "Pickup Requests" is a different,
// scoped-down view (DriverPickupsView) — not PickupRequestsView reused
// — since a driver only ever sees the open claimable pool + their own
// (see CollectionRequestViewSet.get_queryset's driver branch), with
// claim/collect actions instead of the full admin/staff CRUD. Finance
// Records (FinanceRecordsView) is read-only (IsAccounting/IsAdminUser
// on FinanceRecordViewSet).
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
      { href: '/staff/blogs', label: 'Blog Posts', icon: LuNewspaper },
      {
        href: '/staff/partnerships',
        label: 'Partnerships',
        icon: LuHandshake,
      },
    ],
  },
  driver: {
    route: '/driver',
    navItems: [
      { href: '/driver', label: 'Overview', icon: LuLayoutDashboard },
      { href: '/driver/pickups', label: 'Pickup Requests', icon: LuTruck },
    ],
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
      {
        href: '/accounting/finance',
        label: 'Finance Records',
        icon: LuWallet,
      },
    ],
  },
};

export { OPERATIONAL_ROLES };
export type { OperationalRole };
