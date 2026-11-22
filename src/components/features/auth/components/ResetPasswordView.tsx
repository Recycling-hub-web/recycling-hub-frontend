'use client';

import { LuLockKeyhole } from 'react-icons/lu';

import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { Button } from '../../../ui/buttons/Button';
import { useResetPassword } from '../hooks';
import { PasswordSetupForm } from './PasswordSetupForm';

const ResetPasswordView = ({ token }: { token: string }) => {
  const { auth } = usePortalLocale();
  const t = auth.resetPassword;
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
