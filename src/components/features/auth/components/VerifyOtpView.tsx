'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuShieldCheck } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { useAuthFlow } from '../../../../contexts/AuthFlowContext';
import { ApiError } from '../../../../lib/api';
import type { Dictionary } from '../../../../lib/dictionary';
import { isSafeRedirectPath } from '../../../../lib/redirect';
import { ROLE_HOME } from '../../../../types/auth';
import { OtpInputField } from '../../../form/fields/OtpInputField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { useResendOtp, useVerifyOtp } from '../hooks';
import { AuthCard } from './AuthCard';

// Mirrors the backend's own cooldown (OTPResendRateThrottle, scope
// "otp_resend" — 1/min) so Resend is disabled client-side for the exact
// window a click would otherwise 429 against, rather than letting the
// user mash it into a guaranteed-to-fail request every time.
const RESEND_COOLDOWN_SECONDS = 60;

const VerifyOtpView = ({ t }: { t: Dictionary['auth']['verifyOtp'] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { pendingOtp, setPendingOtp } = useAuthFlow();
  const { execute: verifyOtp, loading: submitting } = useVerifyOtp();
  const { execute: resendOtp, loading: resending } = useResendOtp();

  const [formData, setFormData] = useState({ code: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);
  // Starts counting down immediately on arrival — the first code was just
  // sent by LoginView, so Resend would otherwise be clickable (and
  // succeed, sending a near-duplicate code seconds later) before the
  // backend's own cooldown for the *resend* endpoint has any reason to
  // kick in yet.
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const resendLabel = () => {
    if (resending) return t.resendSending;
    if (cooldown > 0) return `${t.resendIn} ${cooldown}s`;
    if (resent) return t.resendSent;
    return t.resend;
  };

  const nextParam = searchParams?.get('next') ?? null;

  // Reached directly (page refresh, bookmark, back button) without having
  // just submitted credentials — there's no email/channel to verify
  // against, so bounce back to the start of the flow rather than show a
  // broken form.
  useEffect(() => {
    if (user) {
      router.replace(ROLE_HOME[user.role]);
    } else if (!pendingOtp) {
      router.replace('/login');
    }
  }, [user, pendingOtp, router]);

  if (user || !pendingOtp) return null;

  const goToDestination = async () => {
    await refreshUser();
    setPendingOtp(null);
    router.replace(isSafeRedirectPath(nextParam) ? nextParam : '/dashboard');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    // Validation error: stay on this page, show an inline field error —
    // never navigate away. The submit button itself is only ever
    // disabled while the request is in flight, not pre-emptively on
    // completeness, so an incomplete code needs its own explicit message
    // here rather than silently doing nothing.
    if (formData.code.length !== 6) {
      setErrors({ code: t.incompleteCodeError });
      return;
    }
    try {
      await verifyOtp(pendingOtp.email, formData.code);
      await goToDestination();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    }
  };

  const handleResend = async () => {
    setError('');
    setResent(false);
    try {
      const result = await resendOtp(pendingOtp.email);
      setPendingOtp({ email: pendingOtp.email, channel: result.channel });
      setResent(true);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    }
  };

  return (
    <AuthCard
      icon={<LuShieldCheck className="size-5" />}
      title={t.title}
      subtitle={`${t.subtitle} (${pendingOtp.email})`}
    >
      <AlertBanner
        message={error}
        className="mb-0 mt-4 rounded-xl border px-4 py-3"
      />

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <OtpInputField
          label={t.codeLabel}
          field="code"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? t.submitting : t.submit}
        </Button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="w-full text-center text-xs font-medium text-slate-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resendLabel()}
        </button>
      </form>
    </AuthCard>
  );
};

export { VerifyOtpView };
