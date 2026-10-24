'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuKeyRound } from 'react-icons/lu';

import { ASSETS } from '../../../../constants/content';
import { useAuth } from '../../../../contexts/AuthContext';
import { useAuthFlow } from '../../../../contexts/AuthFlowContext';
import { ApiError } from '../../../../lib/api';
import type { Dictionary } from '../../../../lib/dictionary';
import { ROLE_HOME } from '../../../../types/auth';
import { InputField } from '../../../form/fields/InputField';
import { PasswordField } from '../../../form/fields/PasswordField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';

// Single-form redesign — login's own layout now, not the shared AuthCard
// every other auth screen (verify-otp, forgot-password, …) still uses (a
// split-screen version was tried first and dropped in favor of this).
// Ported logic is unchanged from the original AuthCard version: same
// next/navigation swap notes apply (no router.query — `next` comes from
// useSearchParams; no router.asPath equivalent, not needed here), same
// `t` prop supplied by the Server Component page.tsx.
const LoginView = ({ t }: { t: Dictionary['auth']['login'] }) => {
  const router = useRouter();
  const { user, login, refreshUser } = useAuth();
  const { setPendingOtp } = useAuthFlow();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Already signed in — send them straight to their role's overview page
  // instead of showing the form again. Every post-login path always lands
  // on the overview page, deliberately, not wherever they were headed
  // before being bounced to /login.
  useEffect(() => {
    if (!user) return;
    router.replace(ROLE_HOME[user.role]);
  }, [user, router]);

  if (user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.requiresOtp) {
        setPendingOtp({ email: formData.email, channel: result.channel });
        router.push('/verify-otp');
      } else {
        // AuthContext doesn't auto-refetch after login() — without this,
        // `user` stays null and RequireAuth on the destination page would
        // immediately bounce back to /login. /dashboard (not a role-
        // specific route here) resolves to the right one once `user` is
        // populated, same as the OTP path below.
        await refreshUser();
        router.replace('/dashboard');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-4 py-12">
      {/* Faint radial brand tint behind the card — same treatment as
       * ReusableHero's background, not a new pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse, #d6ece0 0%, transparent 70%)',
        }}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <Link href="/" className="flex justify-center">
          <Image
            src={ASSETS.logo.combinedColor}
            alt="Recycling Hub"
            width={3100}
            height={700}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <div className="mt-8 text-center">
          <h1 className="font-montserrat text-2xl font-bold text-neutral-950">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>

        <AlertBanner
          message={error}
          className="mb-0 mt-6 rounded-xl border px-4 py-3"
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

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t.submitting : t.submit}
          </Button>
        </form>
      </div>
    </div>
  );
};

export { LoginView };
