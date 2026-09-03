import type { Metadata } from 'next';
import { Suspense } from 'react';

import { Loading } from '../../../components/ui/loading/Loading';
import { getDictionary } from '../../../lib/dictionary';
import { VerifyOtpView } from './_components/VerifyOtpView';

export const metadata: Metadata = {
  title: 'Verify Code — Recycling Hub',
  description: 'Enter your verification code to sign in.',
};

export default function VerifyOtpPage() {
  const { auth } = getDictionary('en');
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loading text="Loading…" />
        </div>
      }
    >
      <VerifyOtpView t={auth.verifyOtp} />
    </Suspense>
  );
}
