import { LuLock } from 'react-icons/lu';

import type { Dictionary } from '../../../../lib/dictionary';
import { Button } from '../../../ui/buttons/Button';
import { AuthCard } from './AuthCard';

// NOTE: nothing on the backend triggers this yet — there's no
// rate-limiting/lockout logic there today (see the auth-screens design
// brief). This page exists so the route is real and ready; wiring an
// actual redirect here (e.g. a 429 from /auth/login/) is separate,
// backend-first follow-up work.
//
// No client state at all, so no 'use client' — a plain Server Component,
// same as every other View here that doesn't need one.
const AccountLockedView = ({
  t,
}: {
  t: Dictionary['auth']['accountLocked'];
}) => (
  <AuthCard
    icon={<LuLock className="size-5" />}
    title={t.title}
    subtitle={t.message}
  >
    <Button href="/login" className="mt-6 w-full">
      {t.backToLogin}
    </Button>
  </AuthCard>
);

export { AccountLockedView };
