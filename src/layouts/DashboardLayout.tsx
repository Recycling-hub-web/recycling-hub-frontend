import type { ReactNode } from 'react';

import { RequireAuth } from '../components/auth/RequireAuth';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { Topbar } from '../components/ui/layout/Topbar';
import { useAuth } from '../contexts/AuthContext';
import { ROLE_LABELS } from '../types/auth';

// No `roles` restriction — this is the shared layout for every
// authenticated operational role (Staff/Driver/Receiving Officer/
// Accounting); Admins can also view it, they just default to /admin.
const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <div className="flex min-h-screen bg-neutral-50">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar subtitle={user ? ROLE_LABELS[user.role] : undefined} />
          <main className="mx-auto w-full max-w-5xl flex-1 overflow-x-hidden px-6 py-8">
            {children}
          </main>
        </div>
      </div>
    </RequireAuth>
  );
};

export { DashboardLayout };
