'use client';

import { LuShieldAlert } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import type { Dictionary } from '../../../../lib/dictionary';
import { ROLE_HOME } from '../../../../types/auth';
import { Button } from '../../../ui/buttons/Button';
import { AuthCard } from './AuthCard';

const UnauthorizedView = ({ t }: { t: Dictionary['auth']['unauthorized'] }) => {
  const { user } = useAuth();
  const ownLandingPage = user ? ROLE_HOME[user.role] : '/dashboard';

  return (
    <AuthCard
      icon={<LuShieldAlert className="size-5" />}
      title={t.title}
      subtitle={t.message}
    >
      <Button href={ownLandingPage} className="mt-6 w-full">
        {t.backToDashboard}
      </Button>
    </AuthCard>
  );
};

export { UnauthorizedView };
