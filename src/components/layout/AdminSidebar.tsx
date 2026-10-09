'use client';

import {
  LuBell,
  LuHandshake,
  LuHardDrive,
  LuHistory,
  LuIdCard,
  LuLayers,
  LuLayoutDashboard,
  LuMail,
  LuMapPin,
  LuNewspaper,
  LuTag,
  LuTruck,
  LuUsers,
  LuWallet,
} from 'react-icons/lu';

import type { NavItem } from './Sidebar';
import { Sidebar } from './Sidebar';

// Lives in components/layout/, not inside any one feature folder — it
// assembles nav items across features (Users, Contact, Pickups, …), it
// isn't itself part of any single feature's domain. Used to sit in
// features/users/components/ back when Users was Admin's only real
// feature; Contact made that no longer true.
const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LuLayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: LuUsers },
  { href: '/admin/staff', label: 'Staff', icon: LuIdCard },
  { href: '/admin/pickups', label: 'Pickup Requests', icon: LuTruck },
  { href: '/admin/contact', label: 'Contact', icon: LuMail },
  { href: '/admin/categories', label: 'Categories', icon: LuTag },
  { href: '/admin/classifications', label: 'Classifications', icon: LuLayers },
  {
    href: '/admin/collection-points',
    label: 'Collection Points',
    icon: LuMapPin,
  },
  { href: '/admin/storage-files', label: 'Storage Files', icon: LuHardDrive },
  { href: '/admin/blogs', label: 'Blog Posts', icon: LuNewspaper },
  { href: '/admin/partnerships', label: 'Partnerships', icon: LuHandshake },
  { href: '/admin/finance', label: 'Finance Records', icon: LuWallet },
  { href: '/admin/activity', label: 'Activity Log', icon: LuHistory },
  { href: '/admin/notifications', label: 'Notifications', icon: LuBell },
];

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => (
  <Sidebar navItems={ADMIN_NAV_ITEMS} open={open} onClose={onClose} />
);

// Exported so AdminOverviewView can build its quick-links grid from the
// same list rather than maintaining a second copy.
export { ADMIN_NAV_ITEMS, AdminSidebar };
