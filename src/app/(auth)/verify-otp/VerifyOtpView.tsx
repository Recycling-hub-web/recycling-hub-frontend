'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuShieldCheck } from 'react-icons/lu';

import { AuthCard } from '../../../components/auth/AuthCard';
import { OtpInputField } from '../../../components/form/fields/OtpInputField';
import { AlertBanner } from '../../../components/ui/AlertBanner';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthFlow } from '../../../contexts/AuthFlowContext';
import { ApiError } from '../../../lib/api';
import type { Dictionary } from '../../../lib/dictionary';
import { isSafeRedirectPath } from '../../../lib/redirect';
import { resendLoginOtp, verifyLoginOtp } from '../../../services/authService';
import { ROLE_HOME } from '../../../types/auth';

const VerifyOtpView = ({ t }: { t: Dictionary['auth']['verifyOtp'] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, refreshUser } = useAuth();
  const { pendingOtp, setPendingOtp } = useAuthFlow();

  const [formData, setFormData] = useState({ code: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const resendLabel = () => {
    if (resending) return t.resendSending;
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
    setSubmitting(true);
    try {
      await verifyLoginOtp(pendingOtp.email, formData.code);
      await goToDestination();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResent(false);
    setResending(true);
    try {
      const result = await resendLoginOtp(pendingOtp.email);
      setPendingOtp({ email: pendingOtp.email, channel: result.channel });
      setResent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setResending(false);
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
          updateFormData={updateFormData}
        />

        <button
          type="submit"
          disabled={submitting || formData.code.length !== 6}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.submitting : t.submit}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="w-full text-center text-xs font-medium text-slate-500 hover:text-brand-600 disabled:opacity-60"
        >
          {resendLabel()}
        </button>
      </form>
    </AuthCard>
  );
};

export { VerifyOtpView };
