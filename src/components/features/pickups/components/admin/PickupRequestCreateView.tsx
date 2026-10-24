'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  joinPhoneNumber,
  validatePhoneNumber,
} from '../../../../../constants/dialCodes';
import type { SelectedAddress } from '../../../../../lib/geoapify';
import { AddressInput } from '../../../../form/fields/AddressInput';
import { InputField } from '../../../../form/fields/InputField';
import { PhoneInputField } from '../../../../form/fields/PhoneInputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Card } from '../../../../ui/card/Card';
import { PageHeader } from '../../../../ui/PageHeader';
import { useToast } from '../../../../ui/toast/ToastContext';
import { REQUEST_TYPE_FILTER_OPTIONS } from '../../constants';
import { useCreatePickupRequest, usePickupCategories } from '../../hooks';
import type { PickupRequestType } from '../../types';
import { hasItemErrors, validateItems } from '../../units';
import { type DraftOrder, NewOrdersFieldArray } from './NewOrdersFieldArray';

type FormState = {
  full_name: string;
  email: string;
  phone_dial_code: string;
  phone_local: string;
  request_type: PickupRequestType;
  pickup_address: string;
  requested_at: string;
  note: string;
};

const INITIAL_STATE: FormState = {
  full_name: '',
  email: '',
  phone_dial_code: '+60',
  phone_local: '',
  request_type: 'individual',
  pickup_address: '',
  requested_at: '',
  note: '',
};

const REQUEST_TYPE_OPTIONS = REQUEST_TYPE_FILTER_OPTIONS.filter(
  (opt) => opt.value,
);

type PickupRequestCreateViewProps = {
  basePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

// Admin/staff logging a pickup request taken over the phone or in
// person — same public POST /pickup-requests/ the real public request
// form uses. Unlike the old flat create this replaces, there's no
// items/photo here at all — those belong to an Order, created
// separately from this request's own details page (CreateOrderView)
// once it's been reviewed.
const PickupRequestCreateView = ({
  basePath,
}: PickupRequestCreateViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createRequest,
    loading: submitting,
    error,
  } = useCreatePickupRequest();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);
  const [orders, setOrders] = useState<DraftOrder[]>([]);
  const [orderItemErrors, setOrderItemErrors] = useState<
    Record<string, string>[][]
  >([]);
  const {
    options: categoryOptions,
    unitsByCategory,
    loading: loadingCategories,
  } = usePickupCategories();

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.full_name.trim())
      nextErrors.full_name = 'Full name is required.';
    if (formData.request_type === 'business' && !formData.email.trim()) {
      nextErrors.email = 'Email is required for business requests.';
    }
    const phoneError = validatePhoneNumber(
      formData.phone_dial_code,
      formData.phone_local,
    );
    if (phoneError) nextErrors.phone_local = phoneError;
    if (!formData.pickup_address.trim())
      nextErrors.pickup_address = 'Pickup address is required.';
    if (!formData.requested_at)
      nextErrors.requested_at = 'Pickup date and time is required.';
    setErrors(nextErrors);
    const nextOrderItemErrors = orders.map((order) =>
      validateItems(order.items, unitsByCategory),
    );
    setOrderItemErrors(nextOrderItemErrors);
    return (
      Object.keys(nextErrors).length === 0 &&
      !nextOrderItemErrors.some(hasItemErrors)
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const result = await createRequest({
        full_name: formData.full_name,
        email: formData.email || undefined,
        phone_number: joinPhoneNumber(
          formData.phone_dial_code,
          formData.phone_local,
        ),
        request_type: formData.request_type,
        pickup_address: formData.pickup_address,
        requested_at: new Date(formData.requested_at).toISOString(),
        note: formData.note || undefined,
        orders: orders.length
          ? orders.map((order) => ({
              items: order.items.map((item) => ({
                category: item.category,
                estimated_quantity:
                  item.estimated_quantity?.trim() || undefined,
                quantity_unit: item.quantity_unit?.trim() || undefined,
              })),
              photos: order.photos.map((p) => p.file_key),
            }))
          : undefined,
      });
      toast.success(
        'Pickup request created',
        orders.length
          ? `A request for ${formData.full_name} has been added with ${orders.length} order${orders.length === 1 ? '' : 's'}.`
          : `A request for ${formData.full_name} has been added.`,
      );
      router.push(`${basePath}/${result.id}`);
    } catch {
      // useCreatePickupRequest already captured the message in `error`,
      // shown below.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup requests
      </Link>

      <PageHeader
        title="New pickup request"
        subtitle="Log a request taken over the phone or in person."
      />

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
              required={formData.request_type === 'business'}
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
            <SelectField
              label="Request type"
              field="request_type"
              options={REQUEST_TYPE_OPTIONS}
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
                errors={errors}
                updateFormData={updateFormData}
                disabled={submitting}
              />
            </div>
            <NewOrdersFieldArray
              orders={orders}
              onChange={setOrders}
              categoryOptions={categoryOptions}
              unitsByCategory={unitsByCategory}
              loadingCategories={loadingCategories}
              disabled={submitting}
              itemErrors={orderItemErrors}
            />
          </div>

          <FormActions className="pt-5">
            <Button href={basePath} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create request'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { PickupRequestCreateView };
