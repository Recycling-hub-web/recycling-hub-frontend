import Link from 'next/link';
import { useRouter } from 'next/router';
import { LuLockKeyhole } from 'react-icons/lu';

import { PasswordSetupForm } from '../components/auth/PasswordSetupForm';
import { Meta } from '../components/layout/Meta';
import { useDictionary } from '../hooks/useDictionary';
import { resetPassword } from '../services/authService';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { auth } = useDictionary();
  const t = auth.resetPassword;

  if (!router.isReady) return null;

  const token =
    typeof router.query.token === 'string' ? router.query.token : '';

  return (
    <>
      <Meta
        title="Reset Password — Recycling Hub"
        description="Reset your Recycling Hub password."
      />
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
    </>
  );
};

export default ResetPasswordPage;
