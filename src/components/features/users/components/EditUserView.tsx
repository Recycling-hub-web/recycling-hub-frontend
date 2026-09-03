'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { SettingToggleInput } from '../../../form/toggle/SettingToggleInput';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useUpdateUser, useUser } from '../hooks';

type FormState = {
  full_name: string;
  phone_number: string;
  is_active: boolean;
  is_2fa_enabled: boolean;
};

// Role and email aren't editable here — see the comment on `updateUser` in
// userService.ts for why (no backend profile-model migration on role
// change; email is the login credential and has no re-verification flow).
const EditUserView = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const toast = useToast();
  const { user, loading: loadingUser, error: loadError } = useUser(userId);
  const { execute: updateUser, loading: submitting } = useUpdateUser();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setFormData({
      full_name: user.full_name,
      phone_number: user.phone_number ?? '',
      is_active: user.is_active,
      is_2fa_enabled: user.is_2fa_enabled,
    });
  }, [user]);

  const updateFormData = (field: string, value: string | boolean) =>
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !user) return;
    setError('');
    try {
      await updateUser(user.id, {
        full_name: formData.full_name,
        phone_number: formData.phone_number || undefined,
        is_active: formData.is_active,
        is_2fa_enabled: formData.is_2fa_enabled,
      });
      toast.success(
        'User updated',
        `${formData.full_name}'s account has been saved.`,
      );
      router.push(`/admin/users/${user.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not save this user.',
      );
    }
  };

  if (loadingUser) return <Loading text="Loading user…" />;

  if (loadError || !user || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'User not found.'}
      </div>
    );
  }

  return (
    <>
      <Link
        href={`/admin/users/${user.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to user
      </Link>

      <PageHeader title="Edit user" subtitle={user.email} />

      <Card className="p-5">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <InputField
            label="Full name"
            field="full_name"
            formData={formData}
            updateFormData={updateFormData}
          />
          <InputField
            label="Phone number"
            field="phone_number"
            required={false}
            formData={formData}
            updateFormData={updateFormData}
          />
          <SettingToggleInput
            label="Account status"
            field="is_active"
            formData={formData}
            updateFormData={updateFormData}
            enabledText="Active"
            disabledText="Inactive"
            enabledDescription="Can sign in"
            disabledDescription="Cannot sign in"
          />
          <SettingToggleInput
            label="Two-factor authentication"
            field="is_2fa_enabled"
            formData={formData}
            updateFormData={updateFormData}
            enabledText="Required"
            disabledText="Not required"
            enabledDescription="An OTP is sent on every login"
            disabledDescription="Signs in with just a password"
          />

          <div className="flex gap-2 pt-2">
            <Link
              href={`/admin/users/${user.id}`}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </Card>
    </>
  );
};

export { EditUserView };
