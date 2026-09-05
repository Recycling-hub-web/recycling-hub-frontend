'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { NONE_PARENT } from '../constants';
import { useCreateCategory } from '../hooks';
import { listCategories } from '../services/categoryService';

type FormState = {
  name: string;
  description: string;
  parent: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  description: '',
  parent: NONE_PARENT,
};

type CreateCategoryViewProps = {
  basePath: '/admin/categories' | '/staff/categories';
};

// Full page, not a modal — same footing as CreateUserView, since a
// category is a standalone record with its own detail page to land on
// afterwards, not a quick inline add.
const CreateCategoryView = ({ basePath }: CreateCategoryViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createCategory,
    loading: submitting,
    error,
  } = useCreateCategory();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [parentOptions, setParentOptions] = useState<
    { value: string; label: string }[]
  >([{ value: NONE_PARENT, label: 'None — top-level category' }]);

  useEffect(() => {
    listCategories({ page: 1 }).then((data) => {
      setParentOptions([
        { value: NONE_PARENT, label: 'None — top-level category' },
        ...data.results.map((c) => ({ value: c.id, label: c.name })),
      ]);
    });
  }, []);

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
      const category = await createCategory({
        name: formData.name,
        description: formData.description || undefined,
        parent: formData.parent === NONE_PARENT ? null : formData.parent,
      });
      toast.success('Category created', `${formData.name} has been added.`);
      router.push(`${basePath}/${category.id}`);
    } catch {
      // useCreateCategory already captured the message in `error`, shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to categories
      </Link>

      <PageHeader
        title="New category"
        subtitle="Add a material category used across pickup requests."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

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
            <Button href={basePath} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create category'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateCategoryView };
