'use client';

import { LuLockKeyhole } from 'react-icons/lu';

import type { Dictionary } from '../../../../lib/dictionary';
import { useSetPassword } from '../hooks';
import { PasswordSetupForm } from './PasswordSetupForm';

const SetPasswordView = ({
  t,
  token,
}: {
  t: Dictionary['auth']['setPassword'];
  token: string;
}) => {
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
