'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { PARTNERSHIP_TYPE_OPTIONS } from '../constants';
import { useCreatePartner } from '../hooks';
import type { PartnershipType } from '../types';
import { LogoUploader } from './LogoUploader';

type FormState = {
  name: string;
  partnership_type: PartnershipType | '';
  website_url: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  partnership_type: '',
  website_url: '',
};

type CreatePartnerViewProps = {
  basePath: '/admin/partnerships' | '/staff/partnerships';
};

// Full page, not a modal — same footing as CreateCategoryView, since a
// partner is a standalone record with its own detail page to land on
// afterwards, not a quick inline add.
const CreatePartnerView = ({ basePath }: CreatePartnerViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createPartner,
    loading: submitting,
    error,
  } = useCreatePartner();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoKey, setLogoKey] = useState<string | null>(null);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.name.trim()) nextErrors.name = 'Name is required.';
    if (!data.partnership_type)
      nextErrors.partnership_type = 'Partnership type is required.';
    if (!data.website_url.trim())
      nextErrors.website_url = 'Website URL is required.';
    if (!logoKey) nextErrors.logo = 'A logo is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      const partner = await createPartner({
        name: formData.name,
        partnership_type: formData.partnership_type as PartnershipType,
        website_url: formData.website_url,
        logo: logoKey as string,
      });
      toast.success('Partner created', `${formData.name} has been added.`);
      router.push(`${basePath}/${partner.id}`);
    } catch {
      // useCreatePartner already captured the message in `error`, shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to partnerships
      </Link>

      <PageHeader
        title="New partner"
        subtitle="Add an organization to the public partners page."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

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
            <div className="sm:col-span-2">
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
            </div>
            <div className="sm:col-span-2">
              <LogoUploader
                value={logoKey ? { file_key: logoKey, public_url: null } : null}
                onChange={setLogoKey}
                disabled={submitting}
              />
              {errors.logo && (
                <p className="-mt-3 mb-4 text-xs text-red-600">{errors.logo}</p>
              )}
            </div>
          </div>

          <div className="flex gap-5 pt-2">
            <Button href={basePath} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? 'Creating…' : 'Create partner'}
            </Button>
          </div>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreatePartnerView };
