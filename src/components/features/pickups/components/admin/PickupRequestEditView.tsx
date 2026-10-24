'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  joinPhoneNumber,
  splitPhoneNumber,
  validatePhoneNumber,
} from '../../../../../constants/dialCodes';
import { ApiError } from '../../../../../lib/api';
import type { SelectedAddress } from '../../../../../lib/geoapify';
import { AddressInput } from '../../../../form/fields/AddressInput';
import { InputField } from '../../../../form/fields/InputField';
import { PhoneInputField } from '../../../../form/fields/PhoneInputField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Card } from '../../../../ui/card/Card';
import { Loading } from '../../../../ui/loading/Loading';
import { PageHeader } from '../../../../ui/PageHeader';
import { useToast } from '../../../../ui/toast/ToastContext';
import { usePickupRequest, useUpdatePickupRequest } from '../../hooks';

type FormState = {
  full_name: string;
  email: string;
  phone_dial_code: string;
  phone_local: string;
  pickup_address: string;
  requested_at: string;
  note: string;
};

// Converts an ISO datetime to the value a <input type="datetime-local">
// needs — local time, no seconds/timezone.
const toDateTimeLocal = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

type PickupRequestEditViewProps = {
  requestId: string;
  basePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

// Admin/staff correcting the requester's own details — contact info,
// address, and the pickup date/time. See PickupRequestUpdateSerializer
// on the backend; `status`/`request_type` aren't editable here.
const PickupRequestEditView = ({
  requestId,
  basePath,
}: PickupRequestEditViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    request,
    loading: loadingRequest,
    error: loadError,
  } = usePickupRequest(requestId);
  const { execute: updateRequest, loading: submitting } =
    useUpdatePickupRequest();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);

  useEffect(() => {
    if (!request) return;
    const { dialCode, number } = splitPhoneNumber(request.phone_number);
    setFormData({
      full_name: request.full_name,
      email: request.email ?? '',
      phone_dial_code: dialCode,
      phone_local: number,
      pickup_address: request.pickup_address,
      requested_at: toDateTimeLocal(request.requested_at),
      note: request.note ?? '',
    });
  }, [request]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const phoneNumber = formData
    ? joinPhoneNumber(formData.phone_dial_code, formData.phone_local)
    : '';

  const hasChanges =
    Boolean(formData) &&
    Boolean(request) &&
    (formData!.full_name !== request!.full_name ||
      formData!.email !== (request!.email ?? '') ||
      phoneNumber !== (request!.phone_number ?? '') ||
      formData!.pickup_address !== request!.pickup_address ||
      formData!.requested_at !== toDateTimeLocal(request!.requested_at) ||
      formData!.note !== (request!.note ?? ''));

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (request?.request_type === 'business' && !data.email.trim()) {
      nextErrors.email = 'Email is required for business requests.';
    }
    const phoneError = validatePhoneNumber(
      data.phone_dial_code,
      data.phone_local,
    );
    if (phoneError) nextErrors.phone_local = phoneError;
    if (!data.pickup_address.trim())
      nextErrors.pickup_address = 'Pickup address is required.';
    if (!data.requested_at)
      nextErrors.requested_at = 'Pickup date and time is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !request) return;
    if (!validate(formData)) return;
    setError('');
    try {
      await updateRequest(request.id, {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone_number: phoneNumber,
        pickup_address: formData.pickup_address,
        requested_at: new Date(formData.requested_at).toISOString(),
        note: formData.note || undefined,
      });
      toast.success('Pickup request updated');
      router.push(`${basePath}/${request.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not update this pickup request.',
      );
    }
  };

  if (loadingRequest) return <Loading text="Loading pickup request…" />;

  if (loadError || !request || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Pickup request not found.'}
      </div>
    );
  }

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${request.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup request
      </Link>

      <PageHeader title="Edit pickup request" subtitle={request.full_name} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

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
              required={request.request_type === 'business'}
              placeholder="e.g. fatima@recyclinghub.example"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <PhoneInputField
              label="Phone number"
              dialCodeField="phone_dial_code"
              numberField="phone_local"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Pickup date & time"
              field="requested_at"
              type="datetime-local"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <div className="sm:col-span-2">
              <AddressInput
                label="Pickup address"
                field="pickup_address"
                placeholder="Address where materials should be collected"
                formData={formData}
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
                countryRestrictions={['my']}
                onSelect={setSelectedLocation}
                onClear={() => setSelectedLocation(null)}
              />
              {selectedLocation && (
                <p className="-mt-3 mb-4 text-xs text-slate-400">
                  Verified at {selectedLocation.latitude.toFixed(5)},{' '}
                  {selectedLocation.longitude.toFixed(5)}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <TextareaField
                label="Note"
                field="note"
                required={false}
                placeholder="Anything else worth noting"
                formData={formData}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
          </div>

          <FormActions className="pt-2">
            <Button href={`${basePath}/${request.id}`} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !hasChanges}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { PickupRequestEditView };
