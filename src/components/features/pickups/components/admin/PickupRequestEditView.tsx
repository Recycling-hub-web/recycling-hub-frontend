'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
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
import { ValidatedForm } from '../../../../form/ValidatedForm';
import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Card } from '../../../../ui/card/Card';
import { Loading } from '../../../../ui/loading/Loading';
import { PageHeader } from '../../../../ui/PageHeader';
import { useToast } from '../../../../ui/toast/ToastContext';
import { MAX_ORDERS_PER_PICKUP_REQUEST } from '../../constants';
import {
  useCreateOrder,
  usePickupCategories,
  usePickupRequest,
  useUpdatePickupRequest,
} from '../../hooks';
import {
  orderToPayload,
  validateOrders,
} from '../../models/pickupRequestCreateModel';
import { type DraftOrder, NewOrdersFieldArray } from './NewOrdersFieldArray';

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
const toDateTimeLocal = (iso: string | null): string => {
  if (!iso) return '';
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
// address, and the pickup date/time (PickupRequestUpdateSerializer;
// `status`/`request_type` aren't editable here) — and, while the request
// is still open, adding new orders to it, the same inputs as the create
// form. Existing orders are edited from their own pages.
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
  const { execute: updateRequest, loading: updating } =
    useUpdatePickupRequest();
  const { execute: createOrder, loading: creatingOrder } = useCreateOrder();
  const submitting = updating || creatingOrder;
  const categories = usePickupCategories();
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  const [orderItemErrors, setOrderItemErrors] = useState<
    Record<string, string>[][]
  >([]);
  const [orderPhotoErrors, setOrderPhotoErrors] = useState<string[]>([]);
  const [orderEvaluationErrors, setOrderEvaluationErrors] = useState<
    Record<string, string>[]
  >([]);
  const [uploading, setUploading] = useState<Set<string>>(new Set());
  const setUploadingFor = useCallback((key: string, isUploading: boolean) => {
    setUploading((prev) => {
      const next = new Set(prev);
      if (isUploading) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);
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

  const detailsChanged =
    Boolean(formData) &&
    Boolean(request) &&
    (formData!.full_name !== request!.full_name ||
      formData!.email !== (request!.email ?? '') ||
      phoneNumber !== (request!.phone_number ?? '') ||
      formData!.pickup_address !== request!.pickup_address ||
      formData!.requested_at !== toDateTimeLocal(request!.requested_at) ||
      formData!.note !== (request!.note ?? ''));
  const hasChanges = detailsChanged || orders.length > 0;

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
    setErrors(nextErrors);
    const orderCheck = validateOrders(orders, categories.unitsByCategory);
    setOrderItemErrors(orderCheck.itemErrors);
    setOrderPhotoErrors(orderCheck.photoErrors);
    setOrderEvaluationErrors(orderCheck.evaluationErrors);
    return Object.keys(nextErrors).length === 0 && orderCheck.valid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !request) return;
    if (uploading.size > 0) {
      toast.error(
        'Photo still uploading',
        'Wait for the photo to finish uploading, then save.',
      );
      return;
    }
    if (!validate(formData)) return;
    setError('');
    try {
      if (detailsChanged) {
        await updateRequest(request.id, {
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone_number: phoneNumber,
          pickup_address: formData.pickup_address,
          requested_at: formData.requested_at
            ? new Date(formData.requested_at).toISOString()
            : null,
          note: formData.note || undefined,
        });
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not update this pickup request.',
      );
      return;
    }

    // New orders one at a time; each one saved leaves the list, so a
    // retry after a failure never creates the same order twice.
    let added = 0;
    for (const order of orders) {
      try {
        // eslint-disable-next-line no-await-in-loop -- in order, one at a time
        await createOrder(request.id, orderToPayload(order));
        added += 1;
        setOrders((current) => current.filter((o) => o.key !== order.key));
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : 'Could not create an order.';
        setError(
          added
            ? `${added} order${added === 1 ? '' : 's'} added, then: ${message}`
            : message,
        );
        toast.error('Some orders were not added', message);
        return;
      }
    }

    toast.success(
      'Pickup request updated',
      added ? `${added} new order${added === 1 ? '' : 's'} added.` : undefined,
    );
    router.push(`${basePath}/${request.id}`);
  };

  if (loadingRequest) return <Loading text="Loading pickup request…" />;

  if (loadError || !request || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Pickup request not found.'}
      </div>
    );
  }

  // New orders only while the request is open (the backend blocks them
  // otherwise), up to the per-request cap.
  const ordersLeft = Math.max(
    0,
    MAX_ORDERS_PER_PICKUP_REQUEST - request.orders.length,
  );
  const canAddOrders = request.status === 'open' && ordersLeft > 0;

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${request.id}`}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup request
      </Link>

      <PageHeader title="Edit pickup request" subtitle={request.full_name} />

      <Card className="p-5">
        <ValidatedForm onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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
              required={false}
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
            {canAddOrders && (
              <div className="border-t border-slate-100 pt-4 sm:col-span-2">
                <p className="text-sm font-medium text-slate-900">New orders</p>
                <p className="mb-3 text-xs text-slate-500">
                  This request has {request.orders.length} order
                  {request.orders.length === 1 ? '' : 's'}. Optional: add up to{' '}
                  {ordersLeft} more here, each with its materials and at least
                  one photo. Existing orders are edited from their own pages.
                </p>
                <NewOrdersFieldArray
                  orders={orders}
                  onChange={setOrders}
                  categoryOptions={categories.options}
                  unitsByCategory={categories.unitsByCategory}
                  loadingCategories={categories.loading}
                  disabled={submitting}
                  itemErrors={orderItemErrors}
                  photoErrors={orderPhotoErrors}
                  onUploadingChange={setUploadingFor}
                  max={ordersLeft}
                  showIntro={false}
                  evaluable
                  evaluationErrors={orderEvaluationErrors}
                />
              </div>
            )}
          </div>

          <FormActions className="pt-2">
            <Button href={`${basePath}/${request.id}`} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !hasChanges}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </FormActions>
        </ValidatedForm>
      </Card>
    </PageContainer>
  );
};

export { PickupRequestEditView };
