'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { CheckSimpleBoxGroup } from '../../../form/fields/CheckSimpleBoxGroup';
import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { ToggleInput } from '../../../form/toggle/ToggleInput';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  useCollectionPoint,
  useMaterialCategories,
  useUpdateCollectionPoint,
} from '../hooks';

type FormState = {
  name: string;
  name_ar: string;
  address: string;
  city: string;
  postcode: string;
  latitude: string;
  longitude: string;
  operating_hours: string;
  accepted_categories: string[];
  is_active: boolean;
};

type EditCollectionPointViewProps = {
  collectionPointId: string;
  basePath: '/admin/collection-points' | '/staff/collection-points';
};

const EditCollectionPointView = ({
  collectionPointId,
  basePath,
}: EditCollectionPointViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    collectionPoint,
    loading: loadingCollectionPoint,
    error: loadError,
  } = useCollectionPoint(collectionPointId);
  const { execute: updateCollectionPoint, loading: submitting } =
    useUpdateCollectionPoint();
  const { categories, loading: loadingCategories } = useMaterialCategories();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!collectionPoint) return;
    setFormData({
      name: collectionPoint.name,
      name_ar: collectionPoint.name_ar,
      address: collectionPoint.address,
      city: collectionPoint.city,
      postcode: collectionPoint.postcode,
      latitude: collectionPoint.latitude ?? '',
      longitude: collectionPoint.longitude ?? '',
      operating_hours: collectionPoint.operating_hours,
      accepted_categories: collectionPoint.accepted_categories,
      is_active: collectionPoint.is_active,
    });
  }, [collectionPoint]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateToggle = (field: string, value: boolean) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
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
    if (!formData || !collectionPoint) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updateCollectionPoint(collectionPoint.id, {
        name: formData.name,
        name_ar: formData.name_ar,
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        operating_hours: formData.operating_hours,
        accepted_categories: formData.accepted_categories,
        is_active: formData.is_active,
      });
      toast.success('Collection point updated');
      router.push(`${basePath}/${collectionPoint.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError
          ? err.message
          : 'Could not save this collection point.',
      );
    }
  };

  if (loadingCollectionPoint) {
    return <Loading text="Loading collection point…" />;
  }

  if (loadError || !collectionPoint || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Collection point not found.'}
      </div>
    );
  }

  // `collectionPoint` is the snapshot useCollectionPoint loaded — this
  // component never refetches it mid-edit, so comparing formData
  // against it directly is a safe, real dirty-check.
  const hasChanges =
    formData.name !== collectionPoint.name ||
    formData.name_ar !== collectionPoint.name_ar ||
    formData.address !== collectionPoint.address ||
    formData.city !== collectionPoint.city ||
    formData.postcode !== collectionPoint.postcode ||
    formData.latitude !== (collectionPoint.latitude ?? '') ||
    formData.longitude !== (collectionPoint.longitude ?? '') ||
    formData.operating_hours !== collectionPoint.operating_hours ||
    formData.is_active !== collectionPoint.is_active ||
    formData.accepted_categories.length !==
      collectionPoint.accepted_categories.length ||
    formData.accepted_categories.some(
      (id) => !collectionPoint.accepted_categories.includes(id),
    );

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${collectionPoint.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to collection point
      </Link>

      <PageHeader
        title="Edit collection point"
        subtitle={collectionPoint.name}
      />

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
            <InputField
              label="Name (Arabic)"
              field="name_ar"
              required={false}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <InputField
                label="Address"
                field="address"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
            <InputField
              label="City"
              field="city"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Postcode"
              field="postcode"
              required={false}
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
            formData={{ accepted_categories: formData.accepted_categories }}
            updateFormData={(_field, value) =>
              setFormData((prev) =>
                prev
                  ? { ...prev, accepted_categories: value as string[] }
                  : prev,
              )
            }
            required={false}
          />
          {loadingCategories && (
            <p className="-mt-3 mb-4 text-xs text-slate-400">
              Loading categories…
            </p>
          )}

          <ToggleInput
            label="Active"
            field="is_active"
            formData={formData}
            updateFormData={updateToggle}
          />

          <div className="flex gap-5 pt-2">
            <Button
              href={`${basePath}/${collectionPoint.id}`}
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

export { EditCollectionPointView };
