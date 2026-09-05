'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useCreateClassification } from '../hooks';

type FormState = {
  name: string;
  description: string;
};

const INITIAL_STATE: FormState = { name: '', description: '' };

type CreateClassificationViewProps = {
  basePath: '/admin/classifications' | '/staff/classifications';
};

// Full page, not a modal — same footing as CreateCategoryView/
// CreateUserView.
const CreateClassificationView = ({
  basePath,
}: CreateClassificationViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createClassification,
    loading: submitting,
    error,
  } = useCreateClassification();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.name.trim()) nextErrors.name = 'Name is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      const classification = await createClassification({
        name: formData.name,
        description: formData.description || undefined,
      });
      toast.success(
        'Classification created',
        `${formData.name} has been added.`,
      );
      router.push(`${basePath}/${classification.id}`);
    } catch {
      // useCreateClassification already captured the message in `error`,
      // shown below — a duplicate `name` (unique on the model) surfaces
      // here as the backend's own validation message.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to classifications
      </Link>

      <PageHeader
        title="New classification"
        subtitle="Add a classification label used to categorize accounts."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <InputField
            label="Name"
            field="name"
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            disabled={submitting}
          />
          <TextareaField
            label="Description"
            field="description"
            required={false}
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
          />

          <div className="flex gap-5 pt-2">
            <Button href={basePath} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create classification'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateClassificationView };
