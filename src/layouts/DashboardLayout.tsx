'use client';

import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { RequireAuth } from '../components/features/auth/components';
import { AppFooter } from '../components/layout/AppFooter';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import type { NavItem } from '../components/ui/navigation';
import type { UserRole } from '../types/auth';

type DashboardLayoutProps = {
  /** Who may see this section — enforced by RequireAuth. */
  roles: UserRole[];
  navItems: NavItem[];
  /** Vertical padding around page content. */
  contentPadding?: 'py-6' | 'py-8';
  children: ReactNode;
};

/** The one authenticated-app shell — role gate, Sidebar (with its own
 * mobile drawer state), Topbar, page content, footer. AdminLayout,
 * SuperAdminLayout and OperationalLayout are thin wrappers that only pick
 * the roles and the menu. */
const DashboardLayout = ({
  roles,
  navItems,
  contentPadding = 'py-6',
  children,
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth roles={roles}>
      <div className="flex h-screen overflow-hidden bg-neutral-50 px-4 py-5 lg:gap-4 lg:px-6">
        <Sidebar
          navItems={navItems}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-hidden">
            {/* Non-root — the global root ReactLenis in providers.tsx/_app.tsx
             * smooths window scroll for public/marketing pages, but this
             * layout's own outer div is h-screen/overflow-hidden (so the
             * sidebar stays put — see DashboardLayout's own history), which
             * leaves the window nothing to scroll. This instance re-targets
             * Lenis's smooth-scroll at this <main> instead, so dashboard
             * pages keep the same smooth-scroll feel. */}
            <ReactLenis
              className={`h-full overflow-y-auto overflow-x-hidden ${contentPadding}`}
              options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
            >
              {children}
            </ReactLenis>
          </main>
          <AppFooter />
        </div>
      </div>
    </RequireAuth>
  );
};

export { DashboardLayout };
