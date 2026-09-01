import Link from 'next/link';
import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import { LuCircleCheck } from 'react-icons/lu';

import { ApiError } from '../../lib/api';
import { PasswordField } from '../form/fields/PasswordField';
import { AlertBanner } from '../ui/AlertBanner';
import { AuthCard } from './AuthCard';

type PasswordSetupCopy = {
  title: string;
  subtitle: string;
  passwordLabel: string;
  confirmLabel: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  signInNow: string;
  invalidToken: string;
  passwordMismatch: string;
};

type PasswordSetupFormProps = {
  icon: ReactNode;
  token: string;
  copy: PasswordSetupCopy;
  onSubmit: (token: string, password: string) => Promise<unknown>;
  /** Reset-password offers a self-service way to request a fresh link;
   * set-password (an admin-issued invite) doesn't — there's no self-serve
   * "invite myself again" flow, so this is left out on that page. */
  invalidTokenAction?: ReactNode;
};

/** Shared by /reset-password and /set-password — both POST to the same
 * backend endpoint (see authService.resetPassword/setPassword) and differ
 * only in copy/framing, per the design brief. */
const PasswordSetupForm = ({
  icon,
  token,
  copy,
  onSubmit,
  invalidTokenAction,
}: PasswordSetupFormProps) => {
  const [formData, setFormData] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm) {
      setError(copy.passwordMismatch);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(token, formData.password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : copy.invalidToken);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <AuthCard
        icon={<LuCircleCheck className="size-5" />}
        title={copy.successTitle}
        subtitle={copy.successMessage}
      >
        <Link
          href="/login"
          className="mt-6 block w-full rounded-full bg-brand-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {copy.signInNow}
        </Link>
      </AuthCard>
    );
  }

  if (!token) {
    return (
      <AuthCard icon={icon} title={copy.title} subtitle={copy.invalidToken}>
        {invalidTokenAction}
      </AuthCard>
    );
  }

  return (
    <AuthCard icon={icon} title={copy.title} subtitle={copy.subtitle}>
      <AlertBanner
        message={error}
        className="mb-0 mt-4 rounded-xl border px-4 py-3"
      />

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <PasswordField
          label={copy.passwordLabel}
          field="password"
          formData={formData}
          updateFormData={updateFormData}
        />
        <PasswordField
          label={copy.confirmLabel}
          field="confirm"
          formData={formData}
          updateFormData={updateFormData}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? copy.submitting : copy.submit}
        </button>
      </form>
    </AuthCard>
  );
};

export { PasswordSetupForm };
