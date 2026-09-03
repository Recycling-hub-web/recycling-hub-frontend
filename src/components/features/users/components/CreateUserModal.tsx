'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { ROLE_LABELS, type UserRole } from '../../../../types/auth';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useToast } from '../../../ui/toast/ToastContext';
import { ROLE_OPTIONS, ROLES_WITH_PROFILE } from '../constants';
import { useCreateUser } from '../hooks';

type CreateUserModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

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

const CreateUserModal = ({
  open,
  onClose,
  onCreated,
}: CreateUserModalProps) => {
  const toast = useToast();
  const { execute: createUser, loading: submitting, error } = useCreateUser();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const showProfileFields = ROLES_WITH_PROFILE.includes(formData.role);

  const handleClose = () => {
    setFormData(INITIAL_STATE);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
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
      onCreated();
      handleClose();
    } catch {
      // useCreateUser already captured the message in `error`, shown below.
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="New user" size="md">
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
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Creating…' : 'Create user'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export { CreateUserModal };
