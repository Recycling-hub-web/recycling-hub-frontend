import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/auth';
import { Loading } from '../ui/loading/Loading';

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

  const isAuthorized = Boolean(user) && (!roles || roles.includes(user!.role));

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(router.asPath)}`);
    } else if (roles && !roles.includes(user.role)) {
      router.replace('/unauthorized');
    }
  }, [loading, user, roles, router]);

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
