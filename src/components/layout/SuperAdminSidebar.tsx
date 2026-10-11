'use client';

import {
  LuHandshake,
  LuHardDrive,
  LuHistory,
  LuLayoutDashboard,
  LuMail,
  LuMapPin,
  LuNewspaper,
  LuSettings,
  LuShieldCheck,
  LuTag,
  LuTruck,
  LuWallet,
} from 'react-icons/lu';

import type { NavItem } from './Sidebar';
import { Sidebar } from './Sidebar';

// Super Admin's own section — separate from AdminSidebar/`/admin/*`.
// Holds the two genuinely Super-Admin-exclusive screens (Administrators,
// System Settings) plus every module that moved here from Admin's own
// sidebar (Pickup Requests through Activity Log below) — reusing the
// exact same View components Admin/Staff already share, just mounted at
// their own /super-admin/* routes with a `basePath` of their own (see
// each page.tsx under src/app/(super-admin)/super-admin/). Users, Staff,
// and Notifications deliberately stayed on the Admin side instead (Admin
// still manages Staff/Driver/Receiving Officer/Accounting accounts, and
// still has its own notifications feed) — no "Admin Workspace" link
// here anymore, so a Super Admin reaches /admin/* only by direct URL,
// not from this sidebar.
const SUPER_ADMIN_NAV_ITEMS: NavItem[] = [
  { href: '/super-admin', label: 'Overview', icon: LuLayoutDashboard },
  {
    href: '/super-admin/administrators',
    label: 'Administrators',
    icon: LuShieldCheck,
  },
  { href: '/super-admin/pickups', label: 'Pickup Requests', icon: LuTruck },
  { href: '/super-admin/contact', label: 'Contact', icon: LuMail },
  { href: '/super-admin/categories', label: 'Categories', icon: LuTag },
  {
    href: '/super-admin/collection-points',
    label: 'Collection Points',
    icon: LuMapPin,
  },
  {
    href: '/super-admin/storage-files',
    label: 'Storage Files',
    icon: LuHardDrive,
  },
  { href: '/super-admin/blogs', label: 'Blog Posts', icon: LuNewspaper },
  {
    href: '/super-admin/partnerships',
    label: 'Partnerships',
    icon: LuHandshake,
  },
  { href: '/super-admin/finance', label: 'Finance Records', icon: LuWallet },
  { href: '/super-admin/activity', label: 'Activity Log', icon: LuHistory },
  { href: '/super-admin/system', label: 'System Settings', icon: LuSettings },
];

type SuperAdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const SuperAdminSidebar = ({ open, onClose }: SuperAdminSidebarProps) => (
  <Sidebar navItems={SUPER_ADMIN_NAV_ITEMS} open={open} onClose={onClose} />
);

// Exported so SuperAdminOverviewView can build its quick-links grid from
// the same list rather than maintaining a second copy (same pattern as
// adminNavItemsFor/AdminOverviewView).
export { SUPER_ADMIN_NAV_ITEMS, SuperAdminSidebar };
