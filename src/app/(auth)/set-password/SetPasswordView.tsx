'use client';

import { LuLockKeyhole } from 'react-icons/lu';

import { PasswordSetupForm } from '../../../components/auth/PasswordSetupForm';
import type { Dictionary } from '../../../lib/dictionary';
import { setPassword } from '../../../services/authService';

const SetPasswordView = ({
  t,
  token,
}: {
  t: Dictionary['auth']['setPassword'];
  token: string;
}) => (
  <PasswordSetupForm
    icon={<LuLockKeyhole className="size-5" />}
    token={token}
    copy={t}
    onSubmit={setPassword}
  />
);

export { SetPasswordView };
