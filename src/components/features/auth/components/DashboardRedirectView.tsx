'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { ROLE_HOME } from '../../../../types/auth';

// Every role now has its own dedicated dashboard (/admin, /staff, /driver,
// /receiving, /accounting) — this bare route stays alive as a stable
// fallback for old bookmarks/links and points each signed-in user at their
// real one. No layout/sidebar of its own; RequireAuth-equivalent gating
// happens implicitly via useAuth (no user yet → nothing to redirect to,
// AuthContext's own loading state keeps this blank until resolved).
const DashboardRedirectView = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const search = searchParams?.toString();
      const asPath = `${pathname}${search ? `?${search}` : ''}`;
      router.replace(`/login?next=${encodeURIComponent(asPath)}`);
      return;
    }
    router.replace(ROLE_HOME[user.role]);
  }, [loading, user, router, pathname, searchParams]);

  return null;
};

export { DashboardRedirectView };
