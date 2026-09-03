'use client';

import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import type { UserRole } from '../../../../types/auth';
import { Loading } from '../../../ui/loading/Loading';

type RequireAuthProps = {
  children: ReactNode;
  /** If set, only these roles may view the page — anyone else is sent to
   * `/unauthorized` (they ARE authenticated, just not authorized for this
   * section — not the same as being logged out). */
  roles?: UserRole[];
};

/** Client-side route guard — the real authorization boundary is still
 * every backend API call's own permission_classes, unchanged; this (and
 * src/middleware.ts, which does the same check before the page even
 * renders) only decide what the UI shows. */
const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthorized = Boolean(user) && (!roles || roles.includes(user!.role));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // next/navigation has no `router.asPath`, and (unlike the old
      // Pages Router version) deliberately not reconstructed from
      // useSearchParams() here either — none of RequireAuth's routes read
      // a query string, useSearchParams() forces the whole subtree out of
      // static generation, and src/middleware.ts's own redirect (which
      // runs first, before this client-side fallback ever fires in
      // practice) already preserves the full path+search anyway.
      router.replace(`/login?next=${encodeURIComponent(pathname ?? '/')}`);
    } else if (roles && !roles.includes(user.role)) {
      router.replace('/unauthorized');
    }
  }, [loading, user, roles, router, pathname]);

  if (loading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading text="Loading…" />
      </div>
    );
  }

  return <>{children}</>;
};

export { RequireAuth };
