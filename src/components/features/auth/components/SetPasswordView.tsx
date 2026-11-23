'use client';

import { LuLockKeyhole } from 'react-icons/lu';

import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { useSetPassword } from '../hooks';
import { PasswordSetupForm } from './PasswordSetupForm';

const SetPasswordView = ({ token }: { token: string }) => {
  const { auth } = usePortalLocale();
  const t = auth.setPassword;
  const { execute: setPassword } = useSetPassword();

  return (
    <PasswordSetupForm
      icon={<LuLockKeyhole className="size-5" />}
      token={token}
      copy={t}
      onSubmit={setPassword}
    />
  );
};

export { SetPasswordView };
