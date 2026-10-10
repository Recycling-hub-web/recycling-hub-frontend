'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { joinPhoneNumber } from '../../../../constants/dialCodes';
import { ROLE_LABELS, type UserRole } from '../../../../types/auth';
import { InputField } from '../../../form/fields/InputField';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { SelectField } from '../../../form/fields/SelectField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
// Cross-feature reuse, same precedent as CoverImageUploader elsewhere —
// the backend field this writes to (User.profile_photo) is shared by
// every role, not Staff-specific, so a second uploader isn't warranted.
import { ProfilePhotoUploader } from '../../staff/components/ProfilePhotoUploader';
import { ROLE_OPTIONS, ROLES_WITH_PROFILE } from '../constants';
import { useCreateUser } from '../hooks';

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField's own dialCodeField/numberField contract —
  // joined back into the single `phone_number` string the backend
  // actually stores only at submit time (see joinPhoneNumber).
  phone_dial_code: string;
  phone_local: string;
  role: UserRole;
  department: string;
  job_title: string;
  branch: string;
  joining_date: string;
  payout_method: string;
  payout_account_details: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  role: 'staff',
  department: '',
  job_title: '',
  branch: '',
  joining_date: '',
  payout_method: '',
  payout_account_details: '',
};

const PAYOUT_METHOD_OPTIONS = [
  { value: 'duitnow', label: 'DuitNow' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank_transfer', label: 'Bank transfer' },
];

// Full page, not a modal — the create flow gets the same footing as
// view/edit (its own route, its own back link) instead of interrupting
// the list with an overlay.
const CreateUserView = () => {
  const router = useRouter();
  const toast = useToast();
  const { execute: createUser, loading: submitting, error } = useCreateUser();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoKey, setPhotoKey] = useState<string | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const showProfileFields = ROLES_WITH_PROFILE.includes(formData.role);
  const showPayoutFields = formData.role === 'driver';

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (!data.email.trim()) nextErrors.email = 'Email is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;

    try {
      const user = await createUser({
        full_name: formData.full_name,
        email: formData.email,
        phone_number:
          joinPhoneNumber(formData.phone_dial_code, formData.phone_local) ||
          undefined,
        role: formData.role,
        profile_photo: photoKey,
        ...(showProfileFields
          ? {
              department: formData.department || undefined,
              job_title: formData.job_title || undefined,
              branch: formData.branch || undefined,
              joining_date: formData.joining_date || undefined,
            }
          : {}),
        ...(showPayoutFields
          ? {
              payout_method:
                (formData.payout_method as
                  | 'duitnow'
                  | 'cash'
                  | 'bank_transfer'
                  | '') || undefined,
              payout_account_details:
                formData.payout_account_details || undefined,
            }
          : {}),
      });
      toast.success(
        'User created',
        `${formData.full_name} has been added as ${ROLE_LABELS[formData.role]}.`,
      );
      router.push(`/admin/users/${user.id}`);
    } catch {
      // useCreateUser already captured the message in `error`, shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href="/admin/users"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to users
      </Link>

      <PageHeader
        title="Create user"
        subtitle="Add an admin, staff, driver, or receiving officer account."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Full name"
              field="full_name"
              placeholder="e.g. Fatima Ali"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              placeholder="e.g. fatima@recyclinghub.example"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <PhoneInputField
              label="Phone number"
              dialCodeField="phone_dial_code"
              numberField="phone_local"
              required={false}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Role"
              field="role"
              options={ROLE_OPTIONS}
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />

            {/* profile_photo lives on User itself (see Topbar/Sidebar
             * avatars), not a role-specific profile field, so — unlike
             * department/position/branch/joining_date below — it isn't
             * gated behind showProfileFields; every role can have one. */}
            <div className="sm:col-span-2">
              <ProfilePhotoUploader
                value={
                  photoKey ? { file_key: photoKey, public_url: null } : null
                }
                onChange={setPhotoKey}
                disabled={submitting}
              />
            </div>
          </div>

          {showProfileFields && (
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
              <div className="col-span-2">
                <InputField
                  label="Department"
                  field="department"
                  required={false}
                  placeholder="e.g. Programs, Finance"
                  formData={formData}
                  errors={errors}
                  updateFormData={updateFormData}
                  disabled={submitting}
                />
              </div>
              <InputField
                label="Position"
                field="job_title"
                required={false}
                placeholder="e.g. Program Manager"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <InputField
                label="Branch"
                field="branch"
                required={false}
                placeholder="e.g. Kuala Lumpur HQ"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <InputField
                label="Joining date"
                field="joining_date"
                type="date"
                required={false}
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
          )}

          {showPayoutFields && (
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
              <div className="col-span-2 text-xs font-medium text-slate-500">
                Where to send reimbursement — required before Verify & Reimburse
                can complete for this driver.
              </div>
              <SelectField
                label="Payout method"
                field="payout_method"
                required={false}
                options={PAYOUT_METHOD_OPTIONS}
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
              <InputField
                label="Payout account details"
                field="payout_account_details"
                required={false}
                placeholder="Bank account number, DuitNow ID, etc."
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
          )}

          <div className="flex gap-5 pt-2">
            <Button href="/admin/users" variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create user'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateUserView };
