import type { Metadata } from 'next';
import { Suspense } from 'react';

import { VerifyOtpView } from '../../../components/features/auth/components';
import { Loading } from '../../../components/ui/loading/Loading';

export const metadata: Metadata = {
  title: 'Verify Code — Recycling Hub',
  description: 'Enter your verification code to sign in.',
};

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loading text="Loading…" />
        </div>
      }
    >
      <VerifyOtpView />
    </Suspense>
  );
}
