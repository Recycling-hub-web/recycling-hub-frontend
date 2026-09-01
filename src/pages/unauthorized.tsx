import Link from 'next/link';
import { LuShieldAlert } from 'react-icons/lu';

import { AuthCard } from '../components/auth/AuthCard';
import { Meta } from '../components/layout/Meta';
import { useAuth } from '../contexts/AuthContext';
import { useDictionary } from '../hooks/useDictionary';
import { ROLE_HOME } from '../types/auth';

const UnauthorizedPage = () => {
  const { user } = useAuth();
  const { auth } = useDictionary();
  const t = auth.unauthorized;

  const ownLandingPage = user ? ROLE_HOME[user.role] : '/dashboard';

  return (
    <>
      <Meta
        title="Access Denied — Recycling Hub"
        description="You don't have access to this page."
      />
      <AuthCard
        icon={<LuShieldAlert className="size-5" />}
        title={t.title}
        subtitle={t.message}
      >
        <Link
          href={ownLandingPage}
          className="mt-6 block w-full rounded-full bg-brand-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {t.backToDashboard}
        </Link>
      </AuthCard>
    </>
  );
};

export default UnauthorizedPage;
