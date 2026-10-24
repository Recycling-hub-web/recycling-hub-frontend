'use client';

import type { ReactNode } from 'react';

import { DashboardLayout } from './DashboardLayout';
import { SUPER_ADMIN_NAV_ITEMS } from './navigation';

const SuperAdminLayout = ({ children }: { children: ReactNode }) => (
  <DashboardLayout roles={['super_admin']} navItems={SUPER_ADMIN_NAV_ITEMS}>
    {children}
  </DashboardLayout>
);

export { SuperAdminLayout };
