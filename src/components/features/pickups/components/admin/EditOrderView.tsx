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
import { useOrder, usePickupCategories, useUpdateOrder } from '../../hooks';
import type { PickupRequestItemInput } from '../../services/pickupService';
import { itemsSummary } from '../../types';
import { formatQuantity, hasItemErrors, validateItems } from '../../units';
import { PickupItemsFieldArray } from '../shared/PickupItemsFieldArray';

type FormState = {
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

type EditOrderViewProps = {
  requestId: string;
  basePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
};

// Admin/staff correct an Order's own date, note, and (while still
// awaiting review) its items — see CollectionRequestUpdateSerializer.
// The requester's contact/address info moved up to the parent
// PickupRequest (see PickupRequestEditView for that). Status is
// deliberately not editable (it only ever changes through
// evaluate/schedule/collect/cancel).
const EditOrderView = ({ requestId, basePath }: EditOrderViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    request,
    loading: loadingRequest,
    error: loadError,
  } = useOrder(requestId);
  const { execute: updateRequest, loading: submitting } = useUpdateOrder();
  const {
    options: categoryOptions,
    unitsByCategory,
    loading: loadingCategories,
  } = usePickupCategories();
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
      requested_date: request.requested_date ?? '',
      note: request.note ?? '',
    });
    setItems(toItemInputs(request.items));
  }, [request]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const hasChanges =
    Boolean(formData) &&
    Boolean(request) &&
    (formData!.requested_date !== (request!.requested_date ?? '') ||
      formData!.note !== (request!.note ?? '') ||
      (itemsEditable && !itemInputsEqual(items, toItemInputs(request!.items))));

  const validate = (): boolean => {
    if (!itemsEditable) return true;
    const nextItemErrors = validateItems(items, unitsByCategory);
    setItemErrors(nextItemErrors);
    return !hasItemErrors(nextItemErrors);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !request) return;
    if (!validate()) return;
    setError('');
    try {
      await updateRequest(request.id, {
        requested_date: formData.requested_date || undefined,
        note: formData.note || undefined,
        items: itemsEditable ? items : undefined,
      });
      toast.success('Order updated');
      router.push(`${basePath}/${request.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not update this order.',
      );
    }
  };

  if (loadingRequest) return <Loading text="Loading order…" />;

  if (loadError || !request || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Order not found.'}
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
        Back to order
      </Link>

      <PageHeader
        title={`Edit ${request.code}`}
        subtitle={`${request.pickup_request.full_name} — ${itemsSummary(request.items)}`}
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            {itemsEditable ? (
              <PickupItemsFieldArray
                items={items}
                onChange={setItems}
                categoryOptions={categoryOptions}
                unitsByCategory={unitsByCategory}
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
                  Items can only be edited while this order is still awaiting
                  review.
                </p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {request.items.map((item) => (
                    <li key={item.id}>
                      {item.category.name}
                      {item.estimated_quantity
                        ? ` — ${formatQuantity(item.estimated_quantity, item.quantity_unit)}`
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
              helperText="Legacy field — prefer the pickup request's own date/time."
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

export { EditOrderView };
