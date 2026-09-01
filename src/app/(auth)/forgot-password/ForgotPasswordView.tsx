'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuCircleCheck, LuKeyRound } from 'react-icons/lu';

import { AuthCard } from '../../../components/auth/AuthCard';
import { InputField } from '../../../components/form/fields/InputField';
import type { Dictionary } from '../../../lib/dictionary';
import { forgotPassword } from '../../../services/authService';

const ForgotPasswordView = ({
  t,
}: {
  t: Dictionary['auth']['forgotPassword'];
}) => {
  const [formData, setFormData] = useState({ email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await forgotPassword(formData.email);
    } finally {
      // Always shows success, regardless of outcome — the backend itself
      // never reveals whether the email exists (ForgotPasswordView returns
      // 200 either way), so there's nothing to branch on here either.
      setSubmitting(false);
      setSent(true);
    }
  };

  if (sent) {
    return (
      <AuthCard
        icon={<LuCircleCheck className="size-5" />}
        title={t.successTitle}
        subtitle={t.successMessage}
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

  return (
    <AuthCard
      icon={<LuKeyRound className="size-5" />}
      title={t.title}
      subtitle={t.subtitle}
    >
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <InputField
          label={t.emailLabel}
          field="email"
          type="email"
          formData={formData}
          updateFormData={updateFormData}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? t.submitting : t.submit}
        </button>

        <Link
          href="/login"
          className="block w-full text-center text-xs font-medium text-slate-500 hover:text-brand-600"
        >
          {t.backToLogin}
        </Link>
      </form>
    </AuthCard>
  );
};

export { ForgotPasswordView };
