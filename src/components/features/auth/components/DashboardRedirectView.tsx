'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { ROLE_HOME } from '../../../../types/auth';

// Every role now has its own dedicated dashboard (/admin, /super-admin,
// /staff, /driver, /receiving, /accounting) — this bare route stays alive
// as a stable fallback for old bookmarks/links and points each signed-in
// user at their real one (their overview page, always — see ROLE_HOME). No
// layout/sidebar of its own; RequireAuth-equivalent gating happens
// implicitly via useAuth (no user yet → nothing to redirect to,
// AuthContext's own loading state keeps this blank until resolved).
const DashboardRedirectView = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    router.replace(ROLE_HOME[user.role]);
  }, [loading, user, router]);

  return null;
};

export { DashboardRedirectView };
