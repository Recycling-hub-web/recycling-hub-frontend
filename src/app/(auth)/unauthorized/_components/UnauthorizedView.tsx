'use client';

import Link from 'next/link';
import { LuShieldAlert } from 'react-icons/lu';

import { AuthCard } from '../../../../components/auth/AuthCard';
import { useAuth } from '../../../../contexts/AuthContext';
import type { Dictionary } from '../../../../lib/dictionary';
import { ROLE_HOME } from '../../../../types/auth';

const UnauthorizedView = ({ t }: { t: Dictionary['auth']['unauthorized'] }) => {
  const { user } = useAuth();
  const ownLandingPage = user ? ROLE_HOME[user.role] : '/dashboard';

  return (
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
  );
};

export { UnauthorizedView };
