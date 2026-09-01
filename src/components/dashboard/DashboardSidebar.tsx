import { LuLayoutDashboard } from 'react-icons/lu';

import type { NavItem } from '../ui/layout/Sidebar';
import { Sidebar } from '../ui/layout/Sidebar';

// Shared by Staff/Driver/Receiving Officer/Accounting — only their one
// profile page exists today. Role-specific sections (assigned tasks,
// pickups, reports) land here as that workflow work gets built, same
// "roles first, then workflows" pattern as AdminSidebar's Users-only start.
const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LuLayoutDashboard },
];

const DashboardSidebar = () => <Sidebar navItems={DASHBOARD_NAV_ITEMS} />;

export { DashboardSidebar };
