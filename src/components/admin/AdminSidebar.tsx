import { LuLayoutDashboard, LuUsers } from 'react-icons/lu';

import type { NavItem } from '../ui/layout/Sidebar';
import { Sidebar } from '../ui/layout/Sidebar';

// Only "Users" is wired to a real page today — the rest of the admin
// surface (pickups, collection points, reports, etc.) is future workflow
// work per the roles-first plan, not built yet.
const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LuLayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: LuUsers },
];

const AdminSidebar = () => <Sidebar navItems={ADMIN_NAV_ITEMS} />;

export { AdminSidebar };
