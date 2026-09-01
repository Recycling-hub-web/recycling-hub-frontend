'use client';

import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { ToastProvider } from '../components/ui/toast/ToastContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AuthFlowProvider } from '../contexts/AuthFlowContext';

/** App Router equivalent of src/pages/_app.tsx's page-transition effect.
 * `next/navigation` has no `router.events` (Pages Router only) — there's
 * no "route change start" signal to fade *out* on, so this only replays
 * the fade-*in* on every navigation, keyed on the pathname changing.
 * Cosmetic 200ms fade, not state-dependent, so the missing "start" half
 * isn't a functional loss.
 *
 * Deliberately keyed on `usePathname()` alone, not `useSearchParams()` too
 * (the old _app.tsx's routeChangeComplete fired on query-string-only
 * changes as well) — this wraps every single page via the root layout, and
 * useSearchParams() anywhere in that position forces the entire app into
 * the "needs a Suspense boundary to statically prerender" bucket, which
 * broke `next build` for routes that don't even use it themselves. Not
 * worth it for a cosmetic re-trigger on the query-string-only case. */
const PageTransition = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.classList.remove('page-transition-enter');
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      wrapperRef.current.offsetHeight;
      wrapperRef.current.classList.add('page-transition-enter');
    }
  }, [pathname]);

  return (
    <div ref={wrapperRef} className="page-transition-enter">
      {children}
    </div>
  );
};

/** Root provider tree for the App Router side of the app (src/app/) —
 * mirrors src/pages/_app.tsx's provider order exactly (AuthProvider >
 * AuthFlowProvider > ToastProvider > ReactLenis) so context consumers
 * shared between both routers (AuthCard, RequireAuth, ProfileOverview,
 * etc.) behave identically regardless of which router served the page. */
const Providers = ({ children }: { children: ReactNode }) => (
  <AuthProvider>
    <AuthFlowProvider>
      <ToastProvider>
        <ReactLenis
          root
          options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}
        >
          <PageTransition>{children}</PageTransition>
        </ReactLenis>
      </ToastProvider>
    </AuthFlowProvider>
  </AuthProvider>
);

export { Providers };
