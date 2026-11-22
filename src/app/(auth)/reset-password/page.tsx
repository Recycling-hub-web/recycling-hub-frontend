import type { Metadata } from 'next';

import { ResetPasswordView } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Reset Password — Recycling Hub',
  description: 'Reset your Recycling Hub password.',
};

// The old page.tsx waited on `router.isReady` before reading
// `router.query.token` — App Router has no such hydration gap:
// `searchParams` is available to this Server Component on the very first
// render, no client-side wait needed.
export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <ResetPasswordView token={searchParams.token ?? ''} />;
}
