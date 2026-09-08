'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { SettingToggleInput } from '../../../form/toggle/SettingToggleInput';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
// Cross-feature reuse — see the same import in CreateUserView.
import { ProfilePhotoUploader } from '../../staff/components/ProfilePhotoUploader';
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
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setFormData({
      full_name: user.full_name,
      phone_number: user.phone_number ?? '',
      is_active: user.is_active,
      is_2fa_enabled: user.is_2fa_enabled,
    });
    setPhotoKey(user.profile_photo?.file_key ?? null);
  }, [user]);

  const updateFormData = (field: string, value: string | boolean) =>
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const hasChanges =
    Boolean(formData) &&
    Boolean(user) &&
    (formData!.full_name !== user!.full_name ||
      formData!.phone_number !== (user!.phone_number ?? '') ||
      formData!.is_active !== user!.is_active ||
      formData!.is_2fa_enabled !== user!.is_2fa_enabled ||
      photoKey !== (user!.profile_photo?.file_key ?? null));

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
        profile_photo: photoKey,
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
    <PageContainer variant="form">
      <Link
        href={`/admin/users/${user.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to user
      </Link>

      <PageHeader title="Edit user" subtitle={user.email} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              field="full_name"
              placeholder="e.g. Fatima Ali"
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Phone number"
              field="phone_number"
              required={false}
              placeholder="e.g. +60123456789"
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <ProfilePhotoUploader
                value={
                  photoKey
                    ? {
                        file_key: photoKey,
                        // Only the original photo (unchanged) has a known
                        // public_url — a freshly uploaded key doesn't, same
                        // as CreateStaffView/CreateUserView.
                        public_url:
                          photoKey === user.profile_photo?.file_key
                            ? user.profile_photo?.public_url ?? null
                            : null,
                      }
                    : null
                }
                onChange={setPhotoKey}
                disabled={submitting}
              />
            </div>
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
          </div>

          <div className="flex gap-5 pt-5">
            <Button
              href={`/admin/users/${user.id}`}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !hasChanges}
              className="flex-1"
            >
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { EditUserView };
