'use client';

import {
  LuBell,
  LuCrown,
  LuHandshake,
  LuIdCard,
  LuLayoutDashboard,
  LuMail,
  LuMapPin,
  LuNewspaper,
  LuTag,
  LuTruck,
  LuUsers,
  LuWallet,
} from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/auth';
import type { NavItem } from './Sidebar';
import { Sidebar } from './Sidebar';

// Lives in components/layout/, not inside any one feature folder — it
// assembles nav items across features (Users, Contact, Pickups, …), it
// isn't itself part of any single feature's domain. Used to sit in
// features/users/components/ back when Users was Admin's only real
// feature; Contact made that no longer true.
//
// Admin keeps Pickups through Finance Records as its own pages — also
// available under Super Admin's own section (/super-admin, see
// SuperAdminSidebar) reusing the exact same components with a wider
// `basePath` union, not a move/removal. Activity Log is Super Admin
// only (no /admin/activity route — removed from this side on purpose).
// A Super Admin viewer still reaches this section too (middleware.ts's
// ROUTE_ROLES['/admin'] allows both roles), by direct URL only —
// SuperAdminSidebar has no link into /admin/* anymore. The "Super
// Admin" link here is still their quick way back to their own section
// once they're here.
const adminNavItemsFor = (role: UserRole | undefined): NavItem[] => [
  { href: '/admin', label: 'Overview', icon: LuLayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: LuUsers },
  { href: '/admin/staff', label: 'Staff', icon: LuIdCard },
  { href: '/admin/pickups', label: 'Pickup Requests', icon: LuTruck },
  { href: '/admin/contact', label: 'Contact', icon: LuMail },
  { href: '/admin/categories', label: 'Categories', icon: LuTag },
  {
    href: '/admin/collection-points',
    label: 'Collection Points',
    icon: LuMapPin,
  },
  { href: '/admin/blogs', label: 'Blog Posts', icon: LuNewspaper },
  { href: '/admin/partnerships', label: 'Partnerships', icon: LuHandshake },
  { href: '/admin/finance', label: 'Finance Records', icon: LuWallet },
  { href: '/admin/notifications', label: 'Notifications', icon: LuBell },
  ...(role === 'super_admin'
    ? [{ href: '/super-admin', label: 'Super Admin', icon: LuCrown }]
    : []),
];

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => {
  const { user } = useAuth();
  return (
    <Sidebar
      navItems={adminNavItemsFor(user?.role)}
      open={open}
      onClose={onClose}
    />
  );
};

// Exported so AdminOverviewView can build its quick-links grid from the
// same list rather than maintaining a second copy.
export { adminNavItemsFor, AdminSidebar };
