import { useRouter } from 'next/router';
import { LuLockKeyhole } from 'react-icons/lu';

import { PasswordSetupForm } from '../components/auth/PasswordSetupForm';
import { Meta } from '../components/layout/Meta';
import { useDictionary } from '../hooks/useDictionary';
import { setPassword } from '../services/authService';

const SetPasswordPage = () => {
  const router = useRouter();
  const { auth } = useDictionary();
  const t = auth.setPassword;

  if (!router.isReady) return null;

  const token =
    typeof router.query.token === 'string' ? router.query.token : '';

  return (
    <>
      <Meta
        title="Set Your Password — Recycling Hub"
        description="Set your password to finish activating your Recycling Hub account."
      />
      <PasswordSetupForm
        icon={<LuLockKeyhole className="size-5" />}
        token={token}
        copy={t}
        onSubmit={setPassword}
      />
    </>
  );
};

export default SetPasswordPage;
