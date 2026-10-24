import type { NavItem } from '../components/ui/navigation';
import type { UserRole } from '../types/auth';
import { adminNavItemsFor, SUPER_ADMIN_NAV_ITEMS } from './navigation';
import { OPERATIONAL_ROLES } from './operationalRoles';

/** The sidebar a role normally sees in its own section — for pages every
 * role shares, like /profile, so each user keeps their familiar menu.
 * Kept apart from navigation.ts, which operationalRoles.ts imports. */
const navItemsForRole = (role: UserRole): NavItem[] => {
  if (role === 'super_admin') return SUPER_ADMIN_NAV_ITEMS;
  if (role === 'admin') return adminNavItemsFor(role);
  return OPERATIONAL_ROLES[role].navItems;
};

export { navItemsForRole };
