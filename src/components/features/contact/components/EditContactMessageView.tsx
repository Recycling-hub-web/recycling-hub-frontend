'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useContactMessage, useUpdateContactMessage } from '../hooks';

type FormState = {
  full_name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
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
    setFormData({
      full_name: message.full_name,
      email: message.email,
      phone_number: message.phone_number,
      subject: message.subject,
      message: message.message,
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
    if (!data.phone_number.trim())
      nextErrors.phone_number = 'Phone number is required.';
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
      await updateMessage(message.id, formData);
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
    formData.phone_number !== message.phone_number ||
    formData.subject !== message.subject ||
    formData.message !== message.message;

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
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Email"
              field="email"
              type="email"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Contact details"
              field="phone_number"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Subject"
              field="subject"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <TextareaField
                label="Message"
                field="message"
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
