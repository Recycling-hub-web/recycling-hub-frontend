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
import { usePickupRequest, useUpdatePickupRequest } from '../hooks';

type FormState = {
  pickup_address: string;
  estimated_quantity: string;
  requested_date: string;
  note: string;
};

type EditPickupRequestViewProps = {
  requestId: string;
  basePath: '/admin/pickups' | '/staff/pickups';
};

// Only pickup_address/estimated_quantity/requested_date/note are
// editable here — see CollectionRequestUpdateSerializer's docstring on
// the backend; full_name/email/category and status are deliberately not
// (status only ever changes through schedule/collect/cancel).
const EditPickupRequestView = ({
  requestId,
  basePath,
}: EditPickupRequestViewProps) => {
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!request) return;
    setFormData({
      pickup_address: request.pickup_address,
      estimated_quantity: request.estimated_quantity ?? '',
      requested_date: request.requested_date ?? '',
      note: request.note ?? '',
    });
  }, [request]);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const hasChanges =
    Boolean(formData) &&
    Boolean(request) &&
    (formData!.pickup_address !== request!.pickup_address ||
      formData!.estimated_quantity !== (request!.estimated_quantity ?? '') ||
      formData!.requested_date !== (request!.requested_date ?? '') ||
      formData!.note !== (request!.note ?? ''));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !request) return;
    setError('');
    try {
      await updateRequest(request.id, {
        pickup_address: formData.pickup_address,
        estimated_quantity: formData.estimated_quantity || undefined,
        requested_date: formData.requested_date || undefined,
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

      <PageHeader
        title="Edit pickup request"
        subtitle={`${request.full_name} — ${request.category.name}`}
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextareaField
                label="Pickup address"
                field="pickup_address"
                formData={formData}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
            <InputField
              label="Estimated quantity"
              field="estimated_quantity"
              type="number"
              required={false}
              placeholder="e.g. 5"
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <InputField
              label="Requested date"
              field="requested_date"
              type="date"
              required={false}
              formData={formData}
              updateFormData={updateFormData}
              disabled={submitting}
            />
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

          <div className="flex gap-5 pt-2">
            <Button
              href={`${basePath}/${request.id}`}
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

export { EditPickupRequestView };
