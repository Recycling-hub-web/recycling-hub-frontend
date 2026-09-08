'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { PARTNERSHIP_TYPE_OPTIONS, STATUS_OPTIONS } from '../constants';
import { usePartner, useUpdatePartner } from '../hooks';
import type { PartnershipType } from '../types';
import { LogoUploader } from './LogoUploader';

type FormState = {
  name: string;
  partnership_type: PartnershipType;
  website_url: string;
  is_active: 'true' | 'false';
};

type EditPartnerViewProps = {
  partnerId: string;
  basePath: '/admin/partnerships' | '/staff/partnerships';
};

const EditPartnerView = ({ partnerId, basePath }: EditPartnerViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    partner,
    loading: loadingPartner,
    error: loadError,
  } = usePartner(partnerId);
  const { execute: updatePartner, loading: submitting } = useUpdatePartner();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [logoKey, setLogoKey] = useState<string | null>(null);

  useEffect(() => {
    if (!partner) return;
    setFormData({
      name: partner.name,
      partnership_type: partner.partnership_type,
      website_url: partner.website_url,
      is_active: partner.is_active ? 'true' : 'false',
    });
    setLogoKey(partner.logo.file_key);
  }, [partner]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.name.trim()) nextErrors.name = 'Name is required.';
    if (!data.website_url.trim())
      nextErrors.website_url = 'Website URL is required.';
    if (!logoKey) nextErrors.logo = 'A logo is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !partner) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updatePartner(partner.id, {
        name: formData.name,
        partnership_type: formData.partnership_type,
        website_url: formData.website_url,
        logo: logoKey as string,
        is_active: formData.is_active === 'true',
      });
      toast.success('Partner updated');
      router.push(`${basePath}/${partner.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError ? err.message : 'Could not save this partner.',
      );
    }
  };

  if (loadingPartner) return <Loading text="Loading partner…" />;

  if (loadError || !partner || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Partner not found.'}
      </div>
    );
  }

  // `partner` is the snapshot usePartner loaded — this component never
  // refetches it mid-edit, so comparing formData against it directly is a
  // safe, real dirty-check, not just a first-render diff.
  const hasChanges =
    formData.name !== partner.name ||
    formData.partnership_type !== partner.partnership_type ||
    formData.website_url !== partner.website_url ||
    formData.is_active !== (partner.is_active ? 'true' : 'false') ||
    logoKey !== partner.logo.file_key;

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${partner.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to partner
      </Link>

      <PageHeader title="Edit partner" subtitle={partner.name} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Name"
              field="name"
              placeholder="e.g. EcoCycle Malaysia"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Partnership type"
              field="partnership_type"
              options={PARTNERSHIP_TYPE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Website URL"
              field="website_url"
              type="url"
              placeholder="https://example.com"
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
              <LogoUploader
                value={
                  logoKey
                    ? {
                        file_key: logoKey,
                        public_url:
                          partner.logo.file_key === logoKey
                            ? partner.logo.public_url
                            : null,
                      }
                    : null
                }
                onChange={setLogoKey}
                disabled={submitting}
              />
              {errors.logo && (
                <p className="-mt-3 mb-4 text-xs text-red-600">{errors.logo}</p>
              )}
            </div>
          </div>

          <div className="flex gap-5 pt-2">
            <Button
              href={`${basePath}/${partner.id}`}
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

export { EditPartnerView };
