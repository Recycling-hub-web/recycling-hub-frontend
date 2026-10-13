'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  joinPhoneNumber,
  splitPhoneNumber,
} from '../../../../constants/dialCodes';
import { useAuth } from '../../../../contexts/AuthContext';
import { InputField } from '../../../form/fields/InputField';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useUpdateProfile } from '../hooks';
import { ProfileIdentity } from './ProfileIdentity';

type FormState = {
  full_name: string;
  // Split for PhoneInputField's dialCodeField/numberField contract, joined
  // back into the single `phone_number` string only at submit time.
  phone_dial_code: string;
  phone_local: string;
};

// Same rule as the backend's pickups phone_validator — the own-profile
// endpoint doesn't validate phone_number itself, so it's checked here.
const PHONE_PATTERN = /^\+?[0-9 ]{7,15}$/;

/** /profile/edit — the signed-in user edits their own name and phone
 * (PATCH /accounts/me/). Email, role and status aren't editable here, by
 * design; they're shown read-only on /profile. Saving returns to
 * /profile, same post-submit navigation as every other edit page. */
const EditProfileView = () => {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || formData) return;
    const { dialCode, number } = splitPhoneNumber(user.phone_number);
    setFormData({
      full_name: user.full_name,
      phone_dial_code: dialCode,
      phone_local: number,
    });
  }, [user, formData]);

  if (!user || !formData) return <Loading />;

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const fullName = formData.full_name.trim();
  const phone = joinPhoneNumber(formData.phone_dial_code, formData.phone_local);
  const hasChanges =
    fullName !== user.full_name || phone !== (user.phone_number ?? '');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const next: Record<string, string> = {};
    if (!fullName) next.full_name = 'Full name is required.';
    if (phone && !PHONE_PATTERN.test(phone)) {
      next.phone_local = 'Enter a valid phone number (7–15 digits).';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      await updateProfile({ full_name: fullName, phone_number: phone });
      toast.success('Profile updated', 'Your changes have been saved.');
      router.push('/profile');
    } catch {
      setError('Could not save your profile.');
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href="/profile"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to profile
      </Link>

      <PageHeader title="Edit profile" subtitle={user.email} />

      <ProfileIdentity user={user} />

      <Card className="p-5">
        <form onSubmit={handleSubmit} noValidate>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              field="full_name"
              placeholder="e.g. Fatima Ali"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={saving}
            />
            <PhoneInputField
              label="Phone number"
              dialCodeField="phone_dial_code"
              numberField="phone_local"
              required={false}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={saving}
            />
          </div>

          <FormActions className="pt-5">
            <Button href="/profile" variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !hasChanges}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { EditProfileView };
