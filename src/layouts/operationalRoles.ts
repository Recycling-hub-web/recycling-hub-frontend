import {
  LuBell,
  LuHandshake,
  LuHardDrive,
  LuLayers,
  LuLayoutDashboard,
  LuMail,
  LuMapPin,
  LuNewspaper,
  LuPackageCheck,
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

// Each role's own route + sidebar. Only "Overview", "Notifications"
// (every role, same shared NotificationsView — see
// features/notifications/components), and, for staff,
// "Pickup Requests"/"Contact"/"Categories"/"Classifications"/"Collection
// Points"/"Storage Files"/"Blog Posts"/"Partnerships"; for driver, its
// own scoped "Pickup Requests"; for accounting, "Finance Records" — is
// wired to real pages today — the rest of each role's section (assigned
// tasks, reports) lands here as that workflow work gets built, same
// "roles first, then workflows" pattern the admin sidebar started with.
// Staff sees the same pickups/contact management admin does (same
// components, basePath="/staff/…") but without contact delete —
// enforced on the backend too (ContactMessageViewSet.get_permissions),
// not just a hidden button here. Pickups, Categories, Classifications,
// Collection Points, Storage Files, Blog Posts, and Partnerships have no
// such split: admin and staff share identical permissions on all seven
// modules (CollectionRequestViewSet / CategoryViewSet +
// IsStaffOrReadOnly / ClassificationView / CollectionPointViewSet +
// IsAdminOrStaffUser / FileRecordViewSet + IsAdminOrStaffUser /
// BlogPostViewSet + IsStaffOrReadOnly / PartnerViewSet +
// IsStaffOrReadOnly). Driver's "Pickup Requests" is a different,
// scoped-down view (DriverPickupsView) — not PickupRequestsView reused
// — since a driver only ever sees the open claimable pool + their own
// (see CollectionRequestViewSet.get_queryset's driver branch), with
// claim/collect actions instead of the full admin/staff CRUD. Finance
// Records (FinanceRecordsView) is accounting/admin's full, writable
// (claim/verify/reimburse) table; the driver's own route renders the
// same component, scoped server-side to their own records and
// read-only past submission — their one write action (the one-click
// bulk claim) lives as a banner on their Pickup Requests page instead,
// not on this table. The driver's "Drop Off to Store" (RouteDropOffView)
// is its own dedicated screen, not CollectModal reused — one batch
// action across every `collected` request on their current open Route
// (see Route on the backend), not a per-task repeat. Receiving
// Officer's first real page, "Deliveries" (ReceivingDeliveriesView),
// is the other end of that same chain — verifying/closing requests a
// driver has already dropped off; the backend already scopes its
// queryset to delivered/closed only, so there's nothing earlier in the
// lifecycle to accidentally expose here.
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
        href: '/staff/collection-points',
        label: 'Collection Points',
        icon: LuMapPin,
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
      { href: '/staff/notifications', label: 'Notifications', icon: LuBell },
    ],
  },
  driver: {
    route: '/driver',
    navItems: [
      { href: '/driver', label: 'Overview', icon: LuLayoutDashboard },
      { href: '/driver/pickups', label: 'Pickup Requests', icon: LuTruck },
      {
        href: '/driver/drop-off',
        label: 'Drop Off to Store',
        icon: LuPackageCheck,
      },
      { href: '/driver/finance', label: 'Finance Records', icon: LuWallet },
      { href: '/driver/notifications', label: 'Notifications', icon: LuBell },
    ],
  },
  receiving_officer: {
    route: '/receiving',
    navItems: [
      { href: '/receiving', label: 'Overview', icon: LuLayoutDashboard },
      {
        href: '/receiving/deliveries',
        label: 'Deliveries',
        icon: LuPackageCheck,
      },
      {
        href: '/receiving/notifications',
        label: 'Notifications',
        icon: LuBell,
      },
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
      {
        href: '/accounting/notifications',
        label: 'Notifications',
        icon: LuBell,
      },
    ],
  },
};

export { OPERATIONAL_ROLES };
export type { OperationalRole };
