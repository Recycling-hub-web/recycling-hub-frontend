'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../../lib/api';
import { InputField } from '../../../../form/fields/InputField';
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
  const { options: categoryOptions, loading: loadingCategories } =
    usePickupCategories();
  const [formData, setFormData] = useState<FormState | null>(null);
  const [items, setItems] = useState<PickupRequestItemInput[]>([]);
  const [itemErrors, setItemErrors] = useState<Record<string, string>[]>([]);
  const [error, setError] = useState('');

  // Items are only editable while evaluation_status is still `pending` —
  // same gate the backend's own validate_items() enforces.
  const itemsEditable = request?.evaluation_status === 'pending';

  useEffect(() => {
    if (!request) return;
    setFormData({
      pickup_address: request.pickup_address,
      requested_date: request.requested_date ?? '',
      note: request.note ?? '',
    });
    setItems(toItemInputs(request.items));
  }, [request]);

  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));

  const hasChanges =
    Boolean(formData) &&
    Boolean(request) &&
    (formData!.pickup_address !== request!.pickup_address ||
      formData!.requested_date !== (request!.requested_date ?? '') ||
      formData!.note !== (request!.note ?? '') ||
      (itemsEditable && !itemInputsEqual(items, toItemInputs(request!.items))));

  const validate = (): boolean => {
    if (!itemsEditable) return true;
    const nextItemErrors: Record<string, string>[] = items.map(
      (item): Record<string, string> =>
        item.category ? {} : { category: 'Category is required.' },
    );
    setItemErrors(nextItemErrors);
    return nextItemErrors.every((e) => Object.keys(e).length === 0);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !request) return;
    if (!validate()) return;
    setError('');
    try {
      await updateRequest(request.id, {
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
            <div className="sm:col-span-2">
              <TextareaField
                label="Pickup address"
                field="pickup_address"
                formData={formData}
                updateFormData={updateFormData}
                disabled={submitting}
              />
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
