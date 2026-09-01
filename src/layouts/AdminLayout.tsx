import type { ReactNode } from 'react';

import { AdminSidebar } from '../components/admin/AdminSidebar';
import { RequireAuth } from '../components/auth/RequireAuth';
import { Topbar } from '../components/ui/layout/Topbar';

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <RequireAuth roles={['admin']}>
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-x-hidden px-6 py-8">{children}</main>
      </div>
    </div>
  </RequireAuth>
);

export { AdminLayout };
