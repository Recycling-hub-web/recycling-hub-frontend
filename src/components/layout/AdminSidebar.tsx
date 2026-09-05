'use client';

import {
  LuHardDrive,
  LuLayers,
  LuLayoutDashboard,
  LuMail,
  LuTag,
  LuTruck,
  LuUsers,
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
  { href: '/admin/pickups', label: 'Pickup Requests', icon: LuTruck },
  { href: '/admin/contact', label: 'Contact', icon: LuMail },
  { href: '/admin/categories', label: 'Categories', icon: LuTag },
  { href: '/admin/classifications', label: 'Classifications', icon: LuLayers },
  { href: '/admin/storage-files', label: 'Storage Files', icon: LuHardDrive },
];

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => (
  <Sidebar navItems={ADMIN_NAV_ITEMS} open={open} onClose={onClose} />
);

export { AdminSidebar };
