import type { IconType } from 'react-icons';
import {
  LuBell,
  LuCar,
  LuClipboardList,
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
  LuReceipt,
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
  // The customer's ask — PickupRequest (the restructure's new parent
  // concept, up to 7 Orders each) — distinct from `pickups` below,
  // which is the Orders queue (materials/pricing/driver workflow).
  pickupRequests: {
    segment: 'pickup-requests',
    label: 'Pickup Requests',
    icon: LuClipboardList,
  },
  pickups: { segment: 'pickups', label: 'Orders', icon: LuTruck },
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
  },
  partnerships: {
    segment: 'partnerships',
    label: 'Partnerships',
    icon: LuHandshake,
  },
  finance: { segment: 'finance', label: 'Finance Records', icon: LuWallet },
  claims: { segment: 'claims', label: 'Expense Claims', icon: LuReceipt },
  vehicles: { segment: 'vehicles', label: 'Vehicles', icon: LuCar },
  activity: { segment: 'activity', label: 'Activity Log', icon: LuHistory },
  notifications: {
    segment: 'notifications',
    label: 'Notifications',
    icon: LuBell,
  },
  system: { segment: 'system', label: 'System Settings', icon: LuSettings },
} satisfies Record<string, NavModuleConfig>;

type NavModule = keyof typeof NAV_MODULES;

/** Menu entries that group several pages under one expandable item. */
const NAV_GROUPS = {
  pickupsMenu: {
    label: 'Pickups',
    icon: LuTruck,
    modules: ['pickupRequests', 'pickups'],
  },
  financeMenu: {
    label: 'Finance',
    icon: LuWallet,
    modules: ['finance', 'claims'],
  },
} satisfies Record<
  string,
  { label: string; icon: IconType; modules: NavModule[] }
>;

type NavGroup = keyof typeof NAV_GROUPS;
type NavEntry = NavModule | NavGroup;

/** One sidebar section: a heading and the entries under it. */
type NavSection = { title: string; entries: NavEntry[] };

const joinPath = (base: string, segment: string) =>
  segment ? `${base}/${segment}` : base;

/** One sidebar item for a module, e.g. buildNavItem('/staff', 'blogs') →
 * /staff/blogs (Blog Posts). */
const buildNavItem = (basePath: string, module: NavModule): NavItem => {
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
};

const buildNavItems = (basePath: string, modules: NavModule[]): NavItem[] =>
  modules.map((module) => buildNavItem(basePath, module));

const isGroup = (entry: NavEntry): entry is NavGroup => entry in NAV_GROUPS;

/** A sidebar divided into headed sections. A group entry becomes one
 * expandable item whose sub-links are its pages; its own href is the
 * first page's (where quick links and a collapsed group point). */
const buildNavSections = (
  basePath: string,
  sections: NavSection[],
): NavItem[] =>
  sections.flatMap(({ title, entries }) =>
    entries.map((entry): NavItem => {
      if (!isGroup(entry)) {
        return { ...buildNavItem(basePath, entry), section: title };
      }
      const { label, icon, modules } = NAV_GROUPS[entry];
      const pages = buildNavItems(basePath, modules);
      return {
        href: pages[0]?.href ?? basePath,
        label,
        icon,
        section: title,
        isGroup: true,
        children: pages.map((page) => ({
          href: page.href,
          label: page.label,
          icon: page.icon,
        })),
      };
    }),
  );

// Admin keeps Pickups through Finance Records as its own pages — also
// available under Super Admin's own section reusing the exact same
// components with a wider `basePath` union. Activity Log is Super Admin
// only (no /admin/activity route). A Super Admin can still reach /admin/*
// (middleware.ts's ROUTE_ROLES['/admin'] allows both roles) by direct URL
// only; the extra "Super Admin" link is their way back to their own
// section from there.
const adminNavItemsFor = (role: UserRole | undefined): NavItem[] => [
  ...buildNavSections('/admin', [
    { title: 'Main', entries: ['overview', 'notifications'] },
    {
      title: 'Operations',
      entries: ['pickupsMenu', 'collectionPoints', 'vehicles'],
    },
    { title: 'Finance', entries: ['financeMenu'] },
    {
      title: 'Content',
      entries: ['blogs', 'categories', 'partnerships', 'contact'],
    },
    { title: 'People', entries: ['users', 'staff'] },
  ]),
  ...(role === 'super_admin'
    ? [
        {
          href: '/super-admin',
          label: 'Super Admin',
          icon: LuCrown,
          section: 'System',
        },
      ]
    : []),
];

// Super Admin's own section: the Super-Admin-exclusive Administrators
// screen plus the shared modules, mounted at /super-admin/*. Users, Staff
// and Notifications stay on the Admin side, and there's no link into
// /admin/* from here. System Settings (/super-admin/system) is hidden from
// the menu for now — add 'system' back to show it; the page still works
// by direct URL.
const SUPER_ADMIN_NAV_ITEMS: NavItem[] = buildNavSections('/super-admin', [
  { title: 'Main', entries: ['overview'] },
  { title: 'Operations', entries: ['pickupsMenu', 'collectionPoints'] },
  { title: 'Finance', entries: ['financeMenu'] },
  {
    title: 'Content',
    entries: ['blogs', 'categories', 'partnerships', 'contact', 'storageFiles'],
  },
  { title: 'People', entries: ['administrators'] },
  { title: 'System', entries: ['activity'] },
]);

export {
  adminNavItemsFor,
  buildNavItems,
  buildNavSections,
  NAV_MODULES,
  SUPER_ADMIN_NAV_ITEMS,
};
export type { NavEntry, NavModule, NavSection };
