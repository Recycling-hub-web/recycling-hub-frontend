'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { RequireAuth } from '../components/auth/RequireAuth';
import { AppFooter } from '../components/layout/AppFooter';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import type { OperationalRole } from './operationalRoles';
import { OPERATIONAL_ROLES } from './operationalRoles';

type OperationalLayoutProps = {
  role: OperationalRole;
  children: ReactNode;
};

/** Shared shell for every operational role's dedicated layout
 * (Staff/Driver/Receiving Officer/Accounting) — one parametrized
 * implementation instead of four near-identical copies, mirroring
 * AdminLayout's shape (Sidebar + Topbar + main + Footer), just role-gated
 * and configured per role via OPERATIONAL_ROLES. */
const OperationalLayout = ({ role, children }: OperationalLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth roles={[role]}>
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar
          navItems={OPERATIONAL_ROLES[role].navItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-5xl flex-1 overflow-x-hidden px-6 py-8">
            {children}
          </main>
          <AppFooter />
        </div>
      </div>
    </RequireAuth>
  );
};

export { OperationalLayout };
