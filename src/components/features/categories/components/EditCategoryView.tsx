'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { NONE_PARENT, STATUS_OPTIONS } from '../constants';
import { useCategory, useUpdateCategory } from '../hooks';
import { listCategories } from '../services/categoryService';

type FormState = {
  name: string;
  description: string;
  parent: string;
  is_active: 'true' | 'false';
};

type EditCategoryViewProps = {
  categoryId: string;
  basePath: '/admin/categories' | '/staff/categories';
};

const EditCategoryView = ({ categoryId, basePath }: EditCategoryViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    category,
    loading: loadingCategory,
    error: loadError,
  } = useCategory(categoryId);
  const { execute: updateCategory, loading: submitting } = useUpdateCategory();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [parentOptions, setParentOptions] = useState<
    { value: string; label: string }[]
  >([{ value: NONE_PARENT, label: 'None — top-level category' }]);

  useEffect(() => {
    if (!category) return;
    setFormData({
      name: category.name,
      description: category.description,
      parent: category.parent ?? NONE_PARENT,
      is_active: category.is_active ? 'true' : 'false',
    });
  }, [category]);

  useEffect(() => {
    listCategories({ page: 1 }).then((data) => {
      setParentOptions([
        { value: NONE_PARENT, label: 'None — top-level category' },
        // A category can't be its own parent.
        ...data.results
          .filter((c) => c.id !== categoryId)
          .map((c) => ({ value: c.id, label: c.name })),
      ]);
    });
  }, [categoryId]);

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
    if (!formData || !category) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updateCategory(category.id, {
        name: formData.name,
        description: formData.description,
        parent: formData.parent === NONE_PARENT ? null : formData.parent,
        is_active: formData.is_active === 'true',
      });
      toast.success('Category updated');
      router.push(`${basePath}/${category.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError ? err.message : 'Could not save this category.',
      );
    }
  };

  if (loadingCategory) return <Loading text="Loading category…" />;

  if (loadError || !category || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Category not found.'}
      </div>
    );
  }

  // `category` is the snapshot useCategory loaded — this component never
  // refetches it mid-edit, so comparing formData against it directly is a
  // safe, real dirty-check, not just a first-render diff.
  const hasChanges =
    formData.name !== category.name ||
    formData.description !== category.description ||
    formData.parent !== (category.parent ?? NONE_PARENT) ||
    formData.is_active !== (category.is_active ? 'true' : 'false');

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${category.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to category
      </Link>

      <PageHeader title="Edit category" subtitle={category.name} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Name"
              field="name"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Parent category"
              field="parent"
              required={false}
              options={parentOptions}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Status"
              field="is_active"
              options={STATUS_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <TextareaField
                label="Description"
                field="description"
                required={false}
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
              />
            </div>
          </div>

          <div className="flex gap-5 pt-2">
            <Button
              href={`${basePath}/${category.id}`}
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

export { EditCategoryView };
