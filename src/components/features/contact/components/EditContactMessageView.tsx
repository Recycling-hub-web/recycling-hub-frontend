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
import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { PhoneInputField } from '../../../form/fields/PhoneInputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_OPTIONS } from '../constants';
import { useContactMessage, useUpdateContactMessage } from '../hooks';
import type { ContactMessageStatus } from '../types';

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField's own dialCodeField/numberField contract —
  // joined back into the single `phone_number` string the backend
  // actually stores only at submit time (see joinPhoneNumber).
  phone_dial_code: string;
  phone_local: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
};

type EditContactMessageViewProps = {
  messageId: string;
  basePath: '/admin/contact';
};

// Admin only — see ContactMessageViewSet.get_serializer_class, which
// only lets an admin requester write these fields on partial_update; a
// staff token would get them silently dropped. The route this renders
// under is only linked from the details page's admin-only Edit button,
// but the real gate is the backend, same principle as contact delete.
const EditContactMessageView = ({
  messageId,
  basePath,
}: EditContactMessageViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    message,
    loading: loadingMessage,
    error: loadError,
  } = useContactMessage(messageId);
  const { execute: updateMessage, loading: submitting } =
    useUpdateContactMessage();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!message) return;
    const { dialCode, number } = splitPhoneNumber(message.phone_number);
    setFormData({
      full_name: message.full_name,
      email: message.email,
      phone_dial_code: dialCode,
      phone_local: number,
      subject: message.subject,
      message: message.message,
      status: message.status,
    });
  }, [message]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (!EMAIL_PATTERN.test(data.email))
      nextErrors.email = 'Enter a valid email address.';
    if (!data.phone_local.trim())
      nextErrors.phone_local = 'Phone number is required.';
    if (!data.subject.trim()) nextErrors.subject = 'Subject is required.';
    if (!data.message.trim()) nextErrors.message = 'Message is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !message) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updateMessage(message.id, {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: joinPhoneNumber(
          formData.phone_dial_code,
          formData.phone_local,
        ),
        subject: formData.subject,
        message: formData.message,
        status: formData.status,
      });
      toast.success('Message updated');
      router.push(`${basePath}/${message.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError ? err.message : 'Could not save this message.',
      );
    }
  };

  if (loadingMessage) return <Loading text="Loading message…" />;

  if (loadError || !message || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Message not found.'}
      </div>
    );
  }

  // `message` is the snapshot useContactMessage loaded — this component
  // never refetches it mid-edit, so comparing formData against it
  // directly is a safe, real dirty-check, not just a first-render diff.
  // Save has nothing useful to do until something's actually different.
  const hasChanges =
    formData.full_name !== message.full_name ||
    formData.email !== message.email ||
    joinPhoneNumber(formData.phone_dial_code, formData.phone_local) !==
      message.phone_number ||
    formData.subject !== message.subject ||
    formData.message !== message.message ||
    formData.status !== message.status;

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${message.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to message
      </Link>

      <PageHeader title="Edit message" subtitle={message.subject} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError} />

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
              placeholder="e.g. fatima@example.com"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <PhoneInputField
              label="Contact details"
              dialCodeField="phone_dial_code"
              numberField="phone_local"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Subject"
              field="subject"
              placeholder="e.g. Question about pickup scheduling"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Status"
              field="status"
              options={STATUS_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <TextareaField
                label="Message"
                field="message"
                placeholder="Write a reply or edit the message…"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
              />
            </div>
          </div>

          <div className="flex gap-5 pt-2">
            <Button
              href={`${basePath}/${message.id}`}
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

export { EditContactMessageView };
