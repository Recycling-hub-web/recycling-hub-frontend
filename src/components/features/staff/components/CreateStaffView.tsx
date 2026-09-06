'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useCreateStaff } from '../hooks';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

type FormState = {
  full_name: string;
  email: string;
  phone_number: string;
  department: string;
  position: string;
  branch: string;
  joining_date: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_number: '',
  department: '',
  position: '',
  branch: '',
  joining_date: '',
};

// Full page, not a modal — same footing as CreateUserView/
// CreateBlogPostView. Creating a staff profile sends a password-set
// invite email (StaffCreateSerializer.create →
// send_password_reset_email(reason="invite")) — the confirmation says
// so, since it's a real, separate side effect worth surfacing.
const CreateStaffView = () => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createStaffMember,
    loading: submitting,
    error,
  } = useCreateStaff();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoKey, setPhotoKey] = useState<string | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

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
      const profile = await createStaffMember({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
        department: formData.department || undefined,
        position: formData.position || undefined,
        branch: formData.branch || undefined,
        joining_date: formData.joining_date || undefined,
        profile_photo: photoKey,
      });
      toast.success(
        'Staff member created',
        `A password-set email has been sent to ${formData.email}.`,
      );
      router.push(`/admin/staff/${profile.id}`);
    } catch {
      // useCreateStaff already captured the message in `error`, shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href="/admin/staff"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to staff
      </Link>

      <PageHeader
        title="New staff member"
        subtitle="Create a staff account and employment profile."
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
            <InputField
              label="Phone number"
              field="phone_number"
              required={false}
              placeholder="e.g. +60123456789"
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
            <InputField
              label="Position"
              field="position"
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

          <div className="flex gap-5 pt-5">
            <Button href="/admin/staff" variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create staff member'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateStaffView };
