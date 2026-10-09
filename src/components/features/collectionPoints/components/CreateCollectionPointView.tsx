'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { CheckSimpleBoxGroup } from '../../../form/fields/CheckSimpleBoxGroup';
import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { useCreateCollectionPoint, useMaterialCategories } from '../hooks';

type FormState = {
  name: string;
  name_ar: string;
  address: string;
  city: string;
  postcode: string;
  latitude: string;
  longitude: string;
  operating_hours: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  name_ar: '',
  address: '',
  city: '',
  postcode: '',
  latitude: '',
  longitude: '',
  operating_hours: '',
};

type CreateCollectionPointViewProps = {
  basePath: '/admin/collection-points' | '/staff/collection-points';
};

// Full page, not a modal — same footing as CreateClassificationView/
// CreateCategoryView.
const CreateCollectionPointView = ({
  basePath,
}: CreateCollectionPointViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createCollectionPoint,
    loading: submitting,
    error,
  } = useCreateCollectionPoint();
  const { categories, loading: loadingCategories } = useMaterialCategories();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.name.trim()) nextErrors.name = 'Name is required.';
    if (!data.address.trim()) nextErrors.address = 'Address is required.';
    if (!data.city.trim()) nextErrors.city = 'City is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      const collectionPoint = await createCollectionPoint({
        name: formData.name,
        name_ar: formData.name_ar || undefined,
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode || undefined,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        operating_hours: formData.operating_hours || undefined,
        accepted_categories: acceptedCategories,
      });
      toast.success(
        'Collection point created',
        `${formData.name} has been added.`,
      );
      router.push(`${basePath}/${collectionPoint.id}`);
    } catch {
      // useCreateCollectionPoint already captured the message in
      // `error`, shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to collection points
      </Link>

      <PageHeader
        title="New collection point"
        subtitle="Add a drop-off point residents can bring recyclables to."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Name"
              field="name"
              placeholder="e.g. AIU Collection Point"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Name (Arabic)"
              field="name_ar"
              required={false}
              placeholder="Optional — a curated translation, not auto-generated"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Address"
                field="address"
                placeholder="Street address"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
            <InputField
              label="City"
              field="city"
              placeholder="e.g. Alor Setar"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Postcode"
              field="postcode"
              required={false}
              placeholder="e.g. 05200"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Latitude"
              field="latitude"
              type="number"
              required={false}
              placeholder="e.g. 6.1335"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Longitude"
              field="longitude"
              type="number"
              required={false}
              placeholder="e.g. 100.3839"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <TextareaField
                label="Operating hours"
                field="operating_hours"
                required={false}
                placeholder="e.g. Mon–Fri 9am–5pm"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
          </div>

          <CheckSimpleBoxGroup
            label="Accepted categories"
            field="accepted_categories"
            options={categories}
            formData={{ accepted_categories: acceptedCategories }}
            updateFormData={(_field, value) =>
              setAcceptedCategories(value as string[])
            }
            required={false}
          />
          {loadingCategories && (
            <p className="-mt-3 mb-4 text-xs text-slate-400">
              Loading categories…
            </p>
          )}

          <div className="flex gap-5 pt-2">
            <Button href={basePath} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create collection point'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateCollectionPointView };
