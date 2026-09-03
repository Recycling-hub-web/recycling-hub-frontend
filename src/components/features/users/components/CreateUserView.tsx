'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ROLE_LABELS, type UserRole } from '../../../../types/auth';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { ROLE_OPTIONS, ROLES_WITH_PROFILE } from '../constants';
import { useCreateUser } from '../hooks';

type FormState = {
  full_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  department: string;
  job_title: string;
  branch: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_number: '',
  role: 'staff',
  department: '',
  job_title: '',
  branch: '',
};

// Full page, not a modal — the create flow gets the same footing as
// view/edit (its own route, its own back link) instead of interrupting
// the list with an overlay.
const CreateUserView = () => {
  const router = useRouter();
  const toast = useToast();
  const { execute: createUser, loading: submitting, error } = useCreateUser();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const showProfileFields = ROLES_WITH_PROFILE.includes(formData.role);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await createUser({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number || undefined,
        role: formData.role,
        ...(showProfileFields
          ? {
              department: formData.department || undefined,
              job_title: formData.job_title || undefined,
              branch: formData.branch || undefined,
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
        subtitle="Add an admin, staff, driver, receiving officer, or accounting account."
      />

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
            label="Email"
            field="email"
            type="email"
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
          <SelectField
            label="Role"
            field="role"
            options={ROLE_OPTIONS}
            formData={formData}
            updateFormData={updateFormData}
          />

          {showProfileFields && (
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3.5">
              <div className="col-span-2">
                <InputField
                  label="Department"
                  field="department"
                  required={false}
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </div>
              <InputField
                label="Job title"
                field="job_title"
                required={false}
                formData={formData}
                updateFormData={updateFormData}
              />
              <InputField
                label="Branch"
                field="branch"
                required={false}
                formData={formData}
                updateFormData={updateFormData}
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Link
              href="/admin/users"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create user'}
            </button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateUserView };
