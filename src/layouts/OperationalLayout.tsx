'use client';

import type { ReactNode } from 'react';

import { DashboardLayout } from './DashboardLayout';
import type { OperationalRole } from './operationalRoles';
import { OPERATIONAL_ROLES } from './operationalRoles';

type OperationalLayoutProps = {
  role: OperationalRole;
  children: ReactNode;
};

/** Shared shell for every operational role's dedicated layout
 * (Staff/Driver/Receiving Officer/Accounting), configured per role via
 * OPERATIONAL_ROLES. */
const OperationalLayout = ({ role, children }: OperationalLayoutProps) => (
  <DashboardLayout
    roles={[role]}
    navItems={OPERATIONAL_ROLES[role].navItems}
    contentPadding="py-8"
  >
    {children}
  </DashboardLayout>
);

export { OperationalLayout };
