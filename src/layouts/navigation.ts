import type { IconType } from 'react-icons';
import {
  LuBell,
  LuCrown,
  LuHandshake,
  LuHardDrive,
  LuHistory,
  LuIdCard,
  LuLayoutDashboard,
  LuMail,
  LuMapPin,
  LuNewspaper,
  LuPackageCheck,
  LuSettings,
  LuShieldCheck,
  LuTag,
  LuTruck,
  LuUsers,
  LuWallet,
} from 'react-icons/lu';

import type { NavItem } from '../components/ui/navigation';
import type { UserRole } from '../types/auth';

type NavModuleConfig = {
  /** Path segment under a section's base path — '' is the section root. */
  segment: string;
  label: string;
  icon: IconType;
  /** Sub-links, as path segments under the module's own path ('' is the
   * module's main page). Turns the module into an expandable group. */
  children?: { segment: string; label: string }[];
};

/** Every sidebar module, defined once. A section's menu is just its base
 * path plus the modules it shows (see buildNavItems), so the same module
 * always carries the same label and icon in every role's sidebar —
 * "Pickup Requests" can't drift into "Pickups" on one side only. */
const NAV_MODULES = {
  overview: { segment: '', label: 'Overview', icon: LuLayoutDashboard },
  users: { segment: 'users', label: 'Users', icon: LuUsers },
  staff: { segment: 'staff', label: 'Staff', icon: LuIdCard },
  administrators: {
    segment: 'administrators',
    label: 'Administrators',
    icon: LuShieldCheck,
  },
  pickups: { segment: 'pickups', label: 'Pickup Requests', icon: LuTruck },
  dropOff: {
    segment: 'drop-off',
    label: 'Drop Off to Store',
    icon: LuPackageCheck,
  },
  deliveries: {
    segment: 'deliveries',
    label: 'Deliveries',
    icon: LuPackageCheck,
  },
  contact: { segment: 'contact', label: 'Contact', icon: LuMail },
  categories: { segment: 'categories', label: 'Categories', icon: LuTag },
  collectionPoints: {
    segment: 'collection-points',
    label: 'Collection Points',
    icon: LuMapPin,
  },
  storageFiles: {
    segment: 'storage-files',
    label: 'Storage Files',
    icon: LuHardDrive,
  },
  blogs: {
    segment: 'blogs',
    label: 'Blog Posts',
    icon: LuNewspaper,
    children: [
      { segment: '', label: 'All Posts' },
      { segment: 'tags', label: 'Tags' },
    ],
  },
  partnerships: {
    segment: 'partnerships',
    label: 'Partnerships',
    icon: LuHandshake,
  },
  finance: { segment: 'finance', label: 'Finance Records', icon: LuWallet },
  activity: { segment: 'activity', label: 'Activity Log', icon: LuHistory },
  notifications: {
    segment: 'notifications',
    label: 'Notifications',
    icon: LuBell,
  },
  system: { segment: 'system', label: 'System Settings', icon: LuSettings },
} satisfies Record<string, NavModuleConfig>;

type NavModule = keyof typeof NAV_MODULES;

const joinPath = (base: string, segment: string) =>
  segment ? `${base}/${segment}` : base;

/** A section's sidebar items, in the given order, e.g.
 * buildNavItems('/staff', ['overview', 'blogs']) →
 * /staff (Overview), /staff/blogs (Blog Posts, with sub-links
 * /staff/blogs "All Posts" and /staff/blogs/tags "Tags"). */
const buildNavItems = (basePath: string, modules: NavModule[]): NavItem[] =>
  modules.map((module) => {
    const { segment, label, icon, children }: NavModuleConfig =
      NAV_MODULES[module];
    const href = joinPath(basePath, segment);
    return {
      href,
      label,
      icon,
      ...(children && {
        children: children.map((child) => ({
          href: joinPath(href, child.segment),
          label: child.label,
        })),
      }),
    };
  });

// Admin keeps Pickups through Finance Records as its own pages — also
// available under Super Admin's own section reusing the exact same
// components with a wider `basePath` union. Activity Log is Super Admin
// only (no /admin/activity route). A Super Admin can still reach /admin/*
// (middleware.ts's ROUTE_ROLES['/admin'] allows both roles) by direct URL
// only; the extra "Super Admin" link is their way back to their own
// section from there.
const adminNavItemsFor = (role: UserRole | undefined): NavItem[] => [
  ...buildNavItems('/admin', [
    'overview',
    'users',
    'staff',
    'pickups',
    'contact',
    'categories',
    'collectionPoints',
    'blogs',
    'partnerships',
    'finance',
    'notifications',
  ]),
  ...(role === 'super_admin'
    ? [{ href: '/super-admin', label: 'Super Admin', icon: LuCrown }]
    : []),
];

// Super Admin's own section: the Super-Admin-exclusive Administrators
// screen plus the shared modules, mounted at /super-admin/*. Users, Staff
// and Notifications stay on the Admin side, and there's no link into
// /admin/* from here. System Settings (/super-admin/system) is hidden from
// the menu for now — add 'system' back to show it; the page still works
// by direct URL.
const SUPER_ADMIN_NAV_ITEMS: NavItem[] = buildNavItems('/super-admin', [
  'overview',
  'administrators',
  'pickups',
  'contact',
  'categories',
  'collectionPoints',
  'storageFiles',
  'blogs',
  'partnerships',
  'finance',
  'activity',
]);

export { adminNavItemsFor, buildNavItems, NAV_MODULES, SUPER_ADMIN_NAV_ITEMS };
export type { NavModule };
