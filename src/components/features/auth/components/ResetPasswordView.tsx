'use client';

import { LuLockKeyhole } from 'react-icons/lu';

import type { Dictionary } from '../../../../lib/dictionary';
import { Button } from '../../../ui/buttons/Button';
import { useResetPassword } from '../hooks';
import { PasswordSetupForm } from './PasswordSetupForm';

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
        <Button href="/forgot-password" className="mt-6 w-full">
          {t.requestNewLink}
        </Button>
      }
    />
  );
};

export { ResetPasswordView };
