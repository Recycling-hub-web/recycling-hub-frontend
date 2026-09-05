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
import { useClassification, useUpdateClassification } from '../hooks';

type FormState = {
  name: string;
  description: string;
};

type EditClassificationViewProps = {
  classificationId: string;
  basePath: '/admin/classifications' | '/staff/classifications';
};

const EditClassificationView = ({
  classificationId,
  basePath,
}: EditClassificationViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    classification,
    loading: loadingClassification,
    error: loadError,
  } = useClassification(classificationId);
  const { execute: updateClassification, loading: submitting } =
    useUpdateClassification();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!classification) return;
    setFormData({
      name: classification.name,
      description: classification.description ?? '',
    });
  }, [classification]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
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
    if (!formData || !classification) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updateClassification(classification.id, {
        name: formData.name,
        description: formData.description,
      });
      toast.success('Classification updated');
      router.push(`${basePath}/${classification.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError
          ? err.message
          : 'Could not save this classification.',
      );
    }
  };

  if (loadingClassification) return <Loading text="Loading classification…" />;

  if (loadError || !classification || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Classification not found.'}
      </div>
    );
  }

  // `classification` is the snapshot useClassification loaded — this
  // component never refetches it mid-edit, so comparing formData against
  // it directly is a safe, real dirty-check, not just a first-render diff.
  const hasChanges =
    formData.name !== classification.name ||
    formData.description !== (classification.description ?? '');

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${classification.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to classification
      </Link>

      <PageHeader title="Edit classification" subtitle={classification.name} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError} />

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
            <Button
              href={`${basePath}/${classification.id}`}
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

export { EditClassificationView };
