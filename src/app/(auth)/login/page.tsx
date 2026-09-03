import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Loading } from '../../../components/ui/loading/Loading';
import { getDictionary } from '../../../lib/dictionary';
import { LoginView } from './_components/LoginView';

export const metadata: Metadata = {
  title: 'Sign In — Recycling Hub',
  description: 'Sign in to the Recycling Hub staff and admin dashboard.',
};

export default function LoginPage() {
  const { auth } = getDictionary('en');
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loading text="Loading…" />
        </div>
      }
    >
      <LoginView t={auth.login} />
    </Suspense>
  );
}
