import type { Metadata } from 'next';

import { SetPasswordView } from '../../../components/features/auth/components';

export const metadata: Metadata = {
  title: 'Set Your Password — Recycling Hub',
  description:
    'Set your password to finish activating your Recycling Hub account.',
};

export default function SetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <SetPasswordView token={searchParams.token ?? ''} />;
}
