import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuKeyRound, LuLogIn } from 'react-icons/lu';

import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/form/fields/InputField';
import { PasswordField } from '../components/form/fields/PasswordField';
import { Meta } from '../components/layout/Meta';
import { AlertBanner } from '../components/ui/AlertBanner';
import { useAuth } from '../contexts/AuthContext';
import { useAuthFlow } from '../contexts/AuthFlowContext';
import { useDictionary } from '../hooks/useDictionary';
import { ApiError } from '../lib/api';
import { isSafeRedirectPath } from '../lib/redirect';

const LoginPage = () => {
  const router = useRouter();
  const { user, login } = useAuth();
  const { setPendingOtp } = useAuthFlow();
  const { auth } = useDictionary();
  const t = auth.login;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const nextParam =
    typeof router.query.next === 'string' ? router.query.next : null;

  // Already signed in — send them straight to where they were headed (or
  // their role's default landing page) instead of showing the form again.
  useEffect(() => {
    if (!user) return;
    if (isSafeRedirectPath(nextParam)) {
      router.replace(nextParam);
      return;
    }
    router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
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
        await router.push(`/verify-otp${query}`);
      } else {
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
    <>
      <Meta
        title="Sign In — Recycling Hub"
        description="Sign in to the Recycling Hub staff and admin dashboard."
      />
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
    </>
  );
};

export default LoginPage;
