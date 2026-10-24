'use client';

import type { ReactNode } from 'react';

import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/auth';
import { DashboardLayout } from './DashboardLayout';
import { navItemsForRole } from './roleNavigation';

const ALL_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'staff',
  'driver',
  'receiving_officer',
  'accounting',
];

/** Shell for /profile — open to every signed-in role, showing each user
 * the same sidebar they have in their own section. */
const ProfileLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      roles={ALL_ROLES}
      navItems={user ? navItemsForRole(user.role) : []}
    >
      {children}
    </DashboardLayout>
  );
};

export { ProfileLayout };
