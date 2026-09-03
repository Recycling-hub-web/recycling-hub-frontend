'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

import { RequireAuth } from '../components/features/auth/components';
import { AdminSidebar } from '../components/features/users/components';
import { AppFooter } from '../components/layout/AppFooter';
import { Topbar } from '../components/layout/Topbar';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth roles={['admin']}>
      <div className="flex min-h-screen bg-neutral-50">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden px-6 py-8">{children}</main>
          <AppFooter />
        </div>
      </div>
    </RequireAuth>
  );
};

export { AdminLayout };
