'use client';

import Link from 'next/link';
import { LuLockKeyhole } from 'react-icons/lu';

import { PasswordSetupForm } from '../../../components/auth/PasswordSetupForm';
import { useResetPassword } from '../../../components/features/auth/hooks';
import type { Dictionary } from '../../../lib/dictionary';

const ResetPasswordView = ({
  t,
  token,
}: {
  t: Dictionary['auth']['resetPassword'];
  token: string;
}) => {
  const { execute: resetPassword } = useResetPassword();

  return (
    <PasswordSetupForm
      icon={<LuLockKeyhole className="size-5" />}
      token={token}
      copy={t}
      onSubmit={resetPassword}
      invalidTokenAction={
        <Link
          href="/forgot-password"
          className="mt-6 block w-full rounded-full bg-brand-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {t.requestNewLink}
        </Link>
      }
    />
  );
};

export { ResetPasswordView };
