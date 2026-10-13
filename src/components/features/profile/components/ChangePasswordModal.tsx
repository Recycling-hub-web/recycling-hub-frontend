'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuKeyRound } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { PasswordField } from '../../../form/fields/PasswordField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Modal } from '../../../ui/modal/Modal';
import { useToast } from '../../../ui/toast/ToastContext';
// Cross-feature reuse — the auth feature already wraps
// POST /auth/password-change/ for exactly this screen.
import { useChangePassword } from '../../auth/hooks';

// Matches ChangePasswordSerializer.new_password's min_length on the
// backend, checked here first so the user gets an inline message.
const MIN_PASSWORD_LENGTH = 8;

const EMPTY_FORM = {
  old_password: '',
  new_password: '',
  confirm_password: '',
};

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

const ChangePasswordModal = ({ open, onClose }: ChangePasswordModalProps) => {
  const toast = useToast();
  const { execute: changePassword, loading } = useChangePassword();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const close = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setError('');
    onClose();
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (formData.new_password.length < MIN_PASSWORD_LENGTH) {
      next.new_password = 'Must be at least 8 characters.';
    }
    if (formData.confirm_password !== formData.new_password) {
      next.confirm_password = 'Passwords do not match.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    try {
      await changePassword(formData.old_password, formData.new_password);
      toast.success(
        'Password changed',
        'Use your new password next time you sign in.',
      );
      close();
    } catch (err) {
      // The backend answers a wrong current password with
      // 400 {"error": "Incorrect old password."} — shown inline on the
      // current-password field rather than as a generic failure.
      const wrongOldPassword =
        err instanceof ApiError &&
        err.status === 400 &&
        typeof (err.data as { error?: unknown } | null)?.error === 'string';
      if (wrongOldPassword) {
        setErrors({ old_password: 'Your current password is incorrect.' });
      } else {
        setError('Could not change your password.');
      }
    }
  };

  const canSubmit =
    !loading &&
    Boolean(
      formData.old_password &&
        formData.new_password &&
        formData.confirm_password,
    );

  return (
    <Modal
      open={open}
      onClose={close}
      title={'Change password'}
      subtitle={'Change the password you use to sign in.'}
      icon={<LuKeyRound className="size-5" />}
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit} noValidate>
        <AlertBanner message={error} />
        <PasswordField
          label={'Current password'}
          field="old_password"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
        <PasswordField
          label={'New password'}
          field="new_password"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
        <PasswordField
          label={'Confirm new password'}
          field="confirm_password"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={close}
            disabled={loading}
          >
            {'Cancel'}
          </Button>
          <Button type="submit" className="flex-1" disabled={!canSubmit}>
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { ChangePasswordModal };
