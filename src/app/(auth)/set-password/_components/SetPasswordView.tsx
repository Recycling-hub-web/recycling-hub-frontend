'use client';

import { LuLockKeyhole } from 'react-icons/lu';

import { PasswordSetupForm } from '../../../../components/auth/PasswordSetupForm';
import { useSetPassword } from '../../../../components/features/auth/hooks';
import type { Dictionary } from '../../../../lib/dictionary';

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
