'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft, LuMail } from 'react-icons/lu';

import {
  joinPhoneNumber,
  splitPhoneNumber,
  validatePhoneNumber,
} from '../../../../constants/dialCodes';
import { PAYOUT_METHOD_OPTIONS } from '../../../../constants/payoutMethods';
import { useAuth } from '../../../../contexts/AuthContext';
import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { SelectField } from '../../../form/fields/SelectField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Switch } from '../../../ui/buttons/Switch';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { ProfilePhotoUploader } from '../../staff/components/ProfilePhotoUploader';
import { useUpdateProfile } from '../hooks';
import type { ProfileUpdate } from '../services/profileService';
import { ChangeEmailModal } from './ChangeEmailModal';

type FormState = {
  full_name: string;
  // Split for PhoneInputField's dialCodeField/numberField contract, joined
  // back into the single `phone_number` string only at submit time.
  phone_dial_code: string;
  phone_local: string;
  department: string;
  position: string;
  branch: string;
  joining_date: string;
  payout_method: string;
  payout_account_details: string;
};

/** /profile/edit — the signed-in user edits their own details
 * (PATCH /accounts/me/): photo, name, phone, WhatsApp and — for every
 * role with a work profile — department, position, branch and joining
 * date, plus payout details for drivers. Email changes through its own
 * code flow (ChangeEmailModal); role and employee ID stay with an admin.
 * Saving returns to /profile, same as every other edit page. */
const EditProfileView = () => {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { execute: updateProfile, loading: saving } = useUpdateProfile();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [whatsapp, setWhatsapp] = useState(false);
  const [photoKey, setPhotoKey] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);

  useEffect(() => {
    if (!user || formData) return;
    const { dialCode, number } = splitPhoneNumber(user.phone_number);
    const p = user.profile;
    setFormData({
      full_name: user.full_name,
      phone_dial_code: dialCode,
      phone_local: number,
      department: p?.department ?? '',
      position: p?.position ?? '',
      branch: p?.branch ?? '',
      joining_date: p?.joining_date ?? '',
      payout_method: p?.payout_method ?? '',
      payout_account_details: p?.payout_account_details ?? '',
    });
    setWhatsapp(user.whatsapp_enabled);
    setPhotoKey(user.profile_photo?.file_key ?? null);
  }, [user, formData]);

  if (!user || !formData) return <Loading />;

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const { profile } = user;
  const isDriver = user.role === 'driver';
  const fullName = formData.full_name.trim();
  const phone = joinPhoneNumber(formData.phone_dial_code, formData.phone_local);

  const profileChanged =
    Boolean(profile) &&
    (formData.department !== (profile?.department ?? '') ||
      formData.position !== (profile?.position ?? '') ||
      formData.branch !== (profile?.branch ?? '') ||
      formData.joining_date !== (profile?.joining_date ?? '') ||
      (isDriver &&
        (formData.payout_method !== (profile?.payout_method ?? '') ||
          formData.payout_account_details !==
            (profile?.payout_account_details ?? ''))));
  const hasChanges =
    fullName !== user.full_name ||
    phone !== (user.phone_number ?? '') ||
    whatsapp !== user.whatsapp_enabled ||
    photoKey !== (user.profile_photo?.file_key ?? null) ||
    profileChanged;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const next: Record<string, string> = {};
    if (!fullName) next.full_name = 'Full name is required.';
    const phoneError = validatePhoneNumber(
      formData.phone_dial_code,
      formData.phone_local,
      { required: false },
    );
    if (phoneError) next.phone_local = phoneError;
    setErrors(next);
    if (Object.keys(next).length) return;

    const payload: ProfileUpdate = {
      full_name: fullName,
      phone_number: phone,
      whatsapp_enabled: whatsapp,
      profile_photo: photoKey,
    };
    if (profile) {
      payload.profile = {
        department: formData.department.trim(),
        position: formData.position.trim(),
        branch: formData.branch.trim(),
        joining_date: formData.joining_date || null,
        ...(isDriver && {
          payout_method: formData.payout_method,
          payout_account_details: formData.payout_account_details.trim(),
        }),
      };
    }

    try {
      await updateProfile(payload);
      toast.success('Profile updated', 'Your changes have been saved.');
      router.push('/profile');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not save your profile.',
      );
    }
  };

  const field = {
    formData,
    errors,
    updateFormData,
    disabled: saving,
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

      <Card className="p-5">
        <form onSubmit={handleSubmit} noValidate>
          <AlertBanner message={error} />

          <div className="mb-5">
            <ProfilePhotoUploader
              value={
                photoKey
                  ? {
                      file_key: photoKey,
                      // Only the current photo has a known public_url; a
                      // freshly uploaded key doesn't (same as EditUserView).
                      public_url:
                        photoKey === user.profile_photo?.file_key
                          ? user.profile_photo?.public_url ?? null
                          : null,
                    }
                  : null
              }
              onChange={setPhotoKey}
              disabled={saving}
            />
          </div>

          <h2 className="mb-3 text-sm font-semibold text-neutral-950">
            Personal details
          </h2>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              field="full_name"
              placeholder="e.g. Fatima Ali"
              {...field}
            />
            <PhoneInputField
              label="Phone number"
              dialCodeField="phone_dial_code"
              numberField="phone_local"
              required={false}
              {...field}
            />
          </div>
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Contact me on WhatsApp
              </p>
              <p className="text-xs text-slate-500">
                Use this phone number for WhatsApp messages.
              </p>
            </div>
            <Switch
              checked={whatsapp}
              onChange={setWhatsapp}
              label="Contact me on WhatsApp"
              disabled={saving}
            />
          </div>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">Email</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setEmailOpen(true)}
              disabled={saving}
            >
              <LuMail className="mr-1.5 size-4" />
              Change email
            </Button>
          </div>

          {profile && (
            <>
              <h2 className="mb-3 text-sm font-semibold text-neutral-950">
                Work details
              </h2>
              <div className="grid gap-x-4 sm:grid-cols-2">
                <InputField
                  label="Department"
                  field="department"
                  required={false}
                  placeholder="e.g. Operations"
                  {...field}
                />
                <InputField
                  label="Position"
                  field="position"
                  required={false}
                  placeholder="e.g. Field coordinator"
                  {...field}
                />
                <InputField
                  label="Branch"
                  field="branch"
                  required={false}
                  placeholder="e.g. Shah Alam"
                  {...field}
                />
                <InputField
                  label="Joining date"
                  field="joining_date"
                  type="date"
                  required={false}
                  {...field}
                />
                {isDriver && (
                  <>
                    <SelectField
                      label="Payout method"
                      field="payout_method"
                      required={false}
                      options={[
                        { value: '', label: 'Not set' },
                        ...PAYOUT_METHOD_OPTIONS,
                      ]}
                      {...field}
                    />
                    <InputField
                      label="Payout account"
                      field="payout_account_details"
                      required={false}
                      placeholder="Bank account number, DuitNow ID, etc."
                      {...field}
                    />
                  </>
                )}
              </div>
              <p className="mb-2 text-xs text-slate-500">
                Your employee ID and role are managed by an administrator.
              </p>
            </>
          )}

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

      <ChangeEmailModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        currentEmail={user.email}
      />
    </PageContainer>
  );
};

export { EditProfileView };
