'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuMail } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { OtpInputField } from '../../../form/fields/OtpInputField';
import { PasswordField } from '../../../form/fields/PasswordField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Modal } from '../../../ui/modal/Modal';
import { useToast } from '../../../ui/toast/ToastContext';
import { useChangeEmail } from '../hooks';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = { new_email: '', current_password: '', code: '' };

type ChangeEmailModalProps = {
  open: boolean;
  onClose: () => void;
  currentEmail: string;
};

/** The first message of a DRF field error ({"code": ["Invalid code."]}),
 * if the API returned one for this field. */
const fieldError = (err: unknown, field: string): string => {
  if (!(err instanceof ApiError) || err.status !== 400) return '';
  const value = (err.data as Record<string, unknown> | null)?.[field];
  if (Array.isArray(value)) return String(value[0] ?? '');
  return typeof value === 'string' ? value : '';
};

/** Changing your own email, in two steps: (1) the new address plus your
 * current password — a 6-digit code goes to the new address; (2) the
 * code. The email only changes after step 2, and the old address is
 * sent a notice by the backend. */
const ChangeEmailModal = ({
  open,
  onClose,
  currentEmail,
}: ChangeEmailModalProps) => {
  const toast = useToast();
  const { sendCode, confirm, loading } = useChangeEmail();
  const [step, setStep] = useState<'details' | 'code'>('details');
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const close = () => {
    setStep('details');
    setFormData(EMPTY_FORM);
    setErrors({});
    setError('');
    onClose();
  };

  const newEmail = formData.new_email.trim().toLowerCase();

  const handleSendCode = async () => {
    setError('');
    const next: Record<string, string> = {};
    if (!EMAIL_PATTERN.test(newEmail)) {
      next.new_email = 'Enter a valid email address.';
    } else if (newEmail === currentEmail.toLowerCase()) {
      next.new_email = "That's already your email address.";
    }
    if (!formData.current_password) {
      next.current_password = 'Enter your current password.';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    try {
      await sendCode(newEmail, formData.current_password);
      setFormData((prev) => ({ ...prev, code: '' }));
      setStep('code');
    } catch (err) {
      const emailError = fieldError(err, 'new_email');
      const passwordError = fieldError(err, 'current_password');
      if (emailError || passwordError) {
        setErrors({ new_email: emailError, current_password: passwordError });
      } else if (err instanceof ApiError && err.status === 429) {
        setError('Too many codes requested. Try again in a little while.');
      } else {
        setError('Could not send the code. Try again.');
      }
    }
  };

  const handleConfirm = async () => {
    setError('');
    if (!/^\d{6}$/.test(formData.code)) {
      setErrors({ code: 'Enter the 6-digit code.' });
      return;
    }
    try {
      await confirm(formData.code);
      toast.success(
        'Email changed',
        `Your account email is now ${newEmail}. Use it next time you sign in.`,
      );
      close();
    } catch (err) {
      const codeError = fieldError(err, 'code');
      if (codeError) setErrors({ code: codeError });
      else setError('Could not change your email. Try again.');
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === 'details') handleSendCode();
    else handleConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Change email"
      subtitle={
        step === 'details'
          ? 'We’ll send a code to your new address to confirm it’s yours.'
          : `Enter the 6-digit code we sent to ${newEmail}. It expires in 5 minutes.`
      }
      icon={<LuMail className="size-5" />}
      closeOnBackdrop={!loading}
    >
      <form onSubmit={handleSubmit} noValidate>
        <AlertBanner message={error} />

        {step === 'details' ? (
          <>
            <InputField
              label="New email"
              field="new_email"
              type="email"
              placeholder="e.g. name@example.com"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={loading}
            />
            <PasswordField
              label="Current password"
              field="current_password"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
          </>
        ) : (
          <>
            <OtpInputField
              label="Code"
              field="code"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading}
              className="mb-2 text-sm font-medium text-brand-700 hover:underline disabled:opacity-50"
            >
              Send a new code
            </button>
          </>
        )}

        <FormActions className="pt-2">
          {step === 'code' ? (
            <Button
              variant="secondary"
              onClick={() => setStep('details')}
              disabled={loading}
            >
              Back
            </Button>
          ) : (
            <Button variant="secondary" onClick={close} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {step === 'details' && (loading ? 'Sending…' : 'Send code')}
            {step === 'code' && (loading ? 'Confirming…' : 'Change email')}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export { ChangeEmailModal };
