'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuKeyRound } from 'react-icons/lu';

import { ASSETS, LOGO_SIZE } from '../../../../constants/content';
import { useAuth } from '../../../../contexts/AuthContext';
import { useAuthFlow } from '../../../../contexts/AuthFlowContext';
import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { ApiError } from '../../../../lib/api';
import { returnPathForRole, safeReturnPath } from '../../../../lib/returnPath';
import { InputField } from '../../../form/fields/InputField';
import { PasswordField } from '../../../form/fields/PasswordField';
import { ValidatedForm } from '../../../form/ValidatedForm';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';

// The refreshed session role determines which return destinations are allowed.
const LoginView = () => {
  const { auth, locale } = usePortalLocale();
  const t = auth.login;
  const router = useRouter();
  const next = safeReturnPath(useSearchParams()?.get('next'));
  const { user, login, refreshUser } = useAuth();
  const { setPendingOtp } = useAuthFlow();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // Resolve the intended destination only after the session role is known.
  useEffect(() => {
    if (!user) return;
    router.replace(returnPathForRole(next, user.role));
  }, [user, router, next]);

  if (user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.requiresOtp) {
        setPendingOtp({ email: formData.email, channel: result.channel });
        router.push(
          next ? `/verify-otp?next=${encodeURIComponent(next)}` : '/verify-otp',
        );
      } else {
        // Load the authenticated role before resolving the destination.
        await refreshUser();
        // The user effect resolves the return path against the refreshed role.
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
        <Link
          href={locale === 'bm' ? '/bm' : '/'}
          className="flex justify-center"
        >
          <Image
            src={ASSETS.logo.combinedColor}
            alt="Recycling Hub"
            width={LOGO_SIZE.horizontal.width}
            height={LOGO_SIZE.horizontal.height}
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

        <ValidatedForm className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-700"
            >
              <LuKeyRound className="size-3.5" />
              {t.forgotPassword}
            </Link>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t.submitting : t.submit}
          </Button>
        </ValidatedForm>
      </div>
    </div>
  );
};

export { LoginView };
