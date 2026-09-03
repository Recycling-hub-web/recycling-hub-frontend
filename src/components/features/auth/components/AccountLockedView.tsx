import Link from 'next/link';
import { LuLock } from 'react-icons/lu';

import type { Dictionary } from '../../../../lib/dictionary';
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
    <Link
      href="/login"
      className="mt-6 block w-full rounded-full bg-brand-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
    >
      {t.backToLogin}
    </Link>
  </AuthCard>
);

export { AccountLockedView };
