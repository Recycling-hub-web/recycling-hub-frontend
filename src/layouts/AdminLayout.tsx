'use client';

import type { ReactNode } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { adminNavItemsFor } from './navigation';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      roles={['admin', 'super_admin']}
      navItems={adminNavItemsFor(user?.role)}
    >
      {children}
    </DashboardLayout>
  );
};

export { AdminLayout };
