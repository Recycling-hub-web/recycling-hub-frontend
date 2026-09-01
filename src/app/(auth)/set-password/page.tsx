import type { Metadata } from 'next';

import { getDictionary } from '../../../lib/dictionary';
import { SetPasswordView } from './SetPasswordView';

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
  const { auth } = getDictionary('en');
  return (
    <SetPasswordView t={auth.setPassword} token={searchParams.token ?? ''} />
  );
}
