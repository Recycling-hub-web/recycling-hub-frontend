import type { Metadata } from 'next';
import Link from 'next/link';
import { LuLock } from 'react-icons/lu';

import { AuthCard } from '../../../components/auth/AuthCard';
import { getDictionary } from '../../../lib/dictionary';

export const metadata: Metadata = {
  title: 'Account Locked — Recycling Hub',
  description: 'This account is temporarily locked.',
};

// NOTE: nothing on the backend triggers this yet — there's no
// rate-limiting/lockout logic there today (see the auth-screens design
// brief). This page exists so the route is real and ready; wiring an
// actual redirect here (e.g. a 429 from /auth/login/) is separate,
// backend-first follow-up work.
//
// No client state at all — unlike its src/pages/ predecessor (which was a
// component either way, just with no hooks), this can be a plain Server
// Component.
export default function AccountLockedPage() {
  const { auth } = getDictionary('en');
  const t = auth.accountLocked;

  return (
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
}
