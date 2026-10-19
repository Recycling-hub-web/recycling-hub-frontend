'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import {
  joinPhoneNumber,
  splitPhoneNumber,
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
import {
  usePickupCategories,
  usePickupRequest,
  useUpdatePickupRequest,
} from '../../hooks';
import type { PickupRequestItemInput } from '../../services/pickupService';
import { itemsSummary } from '../../types';
import { PickupItemsFieldArray } from '../shared/PickupItemsFieldArray';

type FormState = {
  full_name: string;
  email: string;
  // Split for PhoneInputField, joined back into `phone_number` on save —
  // same as CreatePickupRequestView.
  phone_dial_code: string;
  phone_local: string;
  pickup_address: string;
  requested_date: string;
  note: string;
};

const toItemInputs = (
  items: {
    category: { id: string };
    estimated_quantity: string | null;
    quantity_unit: string;
  }[],
): PickupRequestItemInput[] =>
  items.map((item) => ({
    category: item.category.id,
    estimated_quantity: item.estimated_quantity ?? '',
    quantity_unit: item.quantity_unit,
  }));

const itemInputsEqual = (
  a: PickupRequestItemInput[],
  b: PickupRequestItemInput[],
): boolean => JSON.stringify(a) === JSON.stringify(b);

type EditPickupRequestViewProps = {
  requestId: string;
  basePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
};

// Admin/staff correct the requester's details, the address, date, note
// and (while still awaiting review) the items — see
// CollectionRequestUpdateSerializer. Status is deliberately not editable
// (it only ever changes through evaluate/schedule/collect/cancel).
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
  const { options: categoryOptions, loading: loadingCategories } =
    usePickupCategories();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [items, setItems] = useState<PickupRequestItemInput[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState('');
  // Only ever displayed, not submitted — see CreatePickupRequestView's
  // own identical note.
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedAddress | null>(null);

  // Items are only editable while evaluation_status is still `pending` —
  // same gate the backend's own validate_items() enforces.
  const itemsEditable = request?.evaluation_status === 'pending';

  useEffect(() => {
    if (!request) return;
    const { dialCode, number } = splitPhoneNumber(request.phone_number);
    setFormData({
      full_name: request.full_name,
      email: request.email ?? '',
      phone_dial_code: dialCode,
      phone_local: number,
      pickup_address: request.pickup_address,
      requested_date: request.requested_date ?? '',
      note: request.note ?? '',
    });
    setItems(toItemInputs(request.items));
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
      formData!.requested_date !== (request!.requested_date ?? '') ||
      formData!.note !== (request!.note ?? '') ||
      (itemsEditable && !itemInputsEqual(items, toItemInputs(request!.items))));

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.full_name.trim()) nextErrors.full_name = 'Full name is required.';
    if (request?.request_type === 'business' && !data.email.trim()) {
      nextErrors.email = 'Email is required for business requests.';
    }
    if (!data.phone_local.trim())
      nextErrors.phone_local = 'Phone number is required.';
    if (!data.pickup_address.trim())
      nextErrors.pickup_address = 'Pickup address is required.';
    setErrors(nextErrors);
    if (!itemsEditable) return Object.keys(nextErrors).length === 0;
    const nextItemErrors: Record<string, string>[] = items.map(
      (item): Record<string, string> =>
        item.category ? {} : { category: 'Category is required.' },
    );
    setItemErrors(nextItemErrors);
    return (
      Object.keys(nextErrors).length === 0 &&
      nextItemErrors.every((e) => Object.keys(e).length === 0)
    );
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
        requested_date: formData.requested_date || undefined,
        note: formData.note || undefined,
        items: itemsEditable ? items : undefined,
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
        subtitle={`${request.full_name} — ${itemsSummary(request.items)}`}
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
            {itemsEditable ? (
              <PickupItemsFieldArray
                items={items}
                onChange={setItems}
                categoryOptions={categoryOptions}
                loadingCategories={loadingCategories}
                disabled={submitting}
                errors={itemErrors}
                labels={{
                  itemsSection: 'Materials',
                  category: 'Material category',
                  estimatedQuantity: 'Estimated quantity',
                  estimatedQuantityPlaceholder: 'e.g. 5',
                  quantityUnit: 'Quantity unit',
                  quantityUnitPlaceholder: 'e.g. kg',
                  addItem: 'Add another item',
                  removeItem: 'Remove',
                  itemHeading: 'Item',
                }}
              />
            ) : (
              <div className="sm:col-span-2">
                <p className="mb-2 text-sm font-medium text-slate-900">
                  Materials
                </p>
                <p className="text-xs text-slate-500">
                  Items can only be edited while this request is still awaiting
                  review.
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {request.items.map((item) => (
                    <li key={item.id}>
                      {item.category.name}
                      {item.estimated_quantity
                        ? ` — ${item.estimated_quantity} ${item.quantity_unit}`
                        : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

export { EditPickupRequestView };
