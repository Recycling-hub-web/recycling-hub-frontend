'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuKeyRound, LuLogIn } from 'react-icons/lu';

import { AuthCard } from '../../../components/auth/AuthCard';
import { InputField } from '../../../components/form/fields/InputField';
import { PasswordField } from '../../../components/form/fields/PasswordField';
import { AlertBanner } from '../../../components/ui/AlertBanner';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthFlow } from '../../../contexts/AuthFlowContext';
import { ApiError } from '../../../lib/api';
import type { Dictionary } from '../../../lib/dictionary';
import { isSafeRedirectPath } from '../../../lib/redirect';
import { ROLE_HOME } from '../../../types/auth';

// Ported from src/pages/login.tsx — same logic, `next/router` swapped for
// `next/navigation` (no `router.query`, so `next` comes from
// useSearchParams; `router.asPath` has no equivalent, not needed here),
// and `useDictionary()` swapped for a `t` prop supplied by the Server
// Component page.tsx (always English for now — see src/app/layout.tsx).
const LoginView = ({ t }: { t: Dictionary['auth']['login'] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, refreshUser } = useAuth();
  const { setPendingOtp } = useAuthFlow();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const nextParam = searchParams?.get('next') ?? null;

  // Already signed in — send them straight to where they were headed (or
  // their role's default landing page) instead of showing the form again.
  useEffect(() => {
    if (!user) return;
    if (isSafeRedirectPath(nextParam)) {
      router.replace(nextParam);
      return;
    }
    router.replace(ROLE_HOME[user.role]);
  }, [user, nextParam, router]);

  if (user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.requiresOtp) {
        setPendingOtp({ email: formData.email, channel: result.channel });
        const query = isSafeRedirectPath(nextParam)
          ? `?next=${encodeURIComponent(nextParam)}`
          : '';
        router.push(`/verify-otp${query}`);
      } else {
        // AuthContext doesn't auto-refetch after login() — without this,
        // `user` stays null and RequireAuth on the destination page would
        // immediately bounce back to /login. /dashboard (not a role-
        // specific route here) resolves to the right one once `user` is
        // populated, same as the OTP path below.
        await refreshUser();
        router.replace(
          isSafeRedirectPath(nextParam) ? nextParam : '/dashboard',
        );
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      icon={<LuLogIn className="size-5" />}
      title={t.title}
      subtitle={t.subtitle}
    >
      <AlertBanner
        message={error}
        className="mb-0 mt-4 rounded-xl border px-4 py-3"
      />

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <InputField
          label={t.emailLabel}
          field="email"
          type="email"
          placeholder={t.emailPlaceholder}
          formData={formData}
          updateFormData={updateFormData}
        />
        <PasswordField
          label={t.passwordLabel}
          field="password"
          placeholder={t.passwordPlaceholder}
          formData={formData}
          updateFormData={updateFormData}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600"
          >
            <LuKeyRound className="size-3.5" />
            {t.forgotPassword}
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.submitting : t.submit}
        </button>
      </form>
    </AuthCard>
  );
};

export { LoginView };
