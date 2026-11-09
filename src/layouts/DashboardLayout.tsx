'use client';

import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

import { RequireAuth } from '../components/features/auth/components';
import { AppFooter } from '../components/layout/AppFooter';
import { Sidebar } from '../components/layout/Sidebar';
import { SystemMobileNavigation } from '../components/layout/SystemMobileNavigation';
import { Topbar } from '../components/layout/Topbar';
import type { NavItem } from '../components/ui/navigation';
import { SystemExperienceContext } from '../contexts/SystemExperienceContext';
import type { UserRole } from '../types/auth';

type DashboardLayoutProps = {
  /** Who may see this section — enforced by RequireAuth. */
  roles: UserRole[];
  navItems: NavItem[];
  /** Vertical padding around page content. */
  contentPadding?: 'py-6' | 'py-8';
  children: ReactNode;
};

/** The one authenticated-app shell — role gate, Sidebar (desktop only),
 * Topbar, page content, footer, and SystemMobileNavigation (mobile only,
 * self-contained — owns its own menu-sheet state). AdminLayout,
 * SuperAdminLayout and OperationalLayout are thin wrappers that only pick
 * the roles and the menu. */
const DashboardLayout = ({
  roles,
  navItems,
  contentPadding = 'py-6',
  children,
}: DashboardLayoutProps) => {
  return (
    <RequireAuth roles={roles}>
      <SystemExperienceContext.Provider value>
        <div className="system-app-shell flex h-dvh overflow-hidden bg-neutral-50 lg:gap-4 lg:px-6 lg:py-5">
          <div className="hidden lg:flex">
            <Sidebar navItems={navItems} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-hidden">
              {/* Non-root — the global root ReactLenis in providers.tsx/_app.tsx
               * smooths window scroll for public/marketing pages, but this
               * layout's own outer div is h-screen/overflow-hidden (so the
               * sidebar stays put — see DashboardLayout's own history), which
               * leaves the window nothing to scroll. This instance re-targets
               * Lenis's smooth-scroll at this <main> instead, so dashboard
               * pages keep the same smooth-scroll feel. */}
              <ReactLenis
                className={`system-app-content h-full overflow-y-auto overflow-x-hidden ${contentPadding}`}
                options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
              >
                {children}
              </ReactLenis>
            </main>
            <div className="hidden lg:block">
              <AppFooter />
            </div>
            <SystemMobileNavigation navItems={navItems} />
          </div>
        </div>
      </SystemExperienceContext.Provider>
    </RequireAuth>
  );
};

export { DashboardLayout };
