'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { RequireAuth } from '../components/features/auth/components';
import { AppFooter } from '../components/layout/AppFooter';
import { SuperAdminSidebar } from '../components/layout/SuperAdminSidebar';
import { Topbar } from '../components/layout/Topbar';

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth roles={['super_admin']}>
      <div className="flex min-h-screen bg-neutral-50 px-4 py-5 lg:gap-4 lg:px-6">
        <SuperAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden py-6">{children}</main>
          <AppFooter />
        </div>
      </div>
    </RequireAuth>
  );
};

export { SuperAdminLayout };
