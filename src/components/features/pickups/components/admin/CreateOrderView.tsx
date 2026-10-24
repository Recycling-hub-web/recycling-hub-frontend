'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { PageContainer } from '../../../../layout/PageContainer';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Card } from '../../../../ui/card/Card';
import { Loading } from '../../../../ui/loading/Loading';
import { PageHeader } from '../../../../ui/PageHeader';
import { useToast } from '../../../../ui/toast/ToastContext';
import {
  useCreateOrder,
  usePickupCategories,
  usePickupRequest,
} from '../../hooks';
import type { PickupRequestItemInput } from '../../services/pickupService';
import { hasItemErrors, validateItems } from '../../units';
import { PickupItemsFieldArray } from '../shared/PickupItemsFieldArray';
import {
  type OrderPhoto,
  PickupPhotosUploader,
} from '../shared/PickupPhotosUploader';

type CreateOrderViewProps = {
  pickupRequestId: string;
  /** Where the new Order is redirected to once created (e.g.
   * /admin/pickups). */
  ordersBasePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
  /** Back to the parent request's own details page (e.g.
   * /admin/pickup-requests). */
  requestsBasePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

// Like the old CreatePickupRequestView, minus the contact/address
// fields (those live on the parent PickupRequest now) and with items
// optional (no client-side allow_empty=False gate) — see
// OrderCreateSerializer on the backend. Scoped under a pickupRequestId
// route param; posts to POST /pickup-requests/{id}/orders/.
const CreateOrderView = ({
  pickupRequestId,
  ordersBasePath,
  requestsBasePath,
}: CreateOrderViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    request: pickupRequest,
    loading: loadingRequest,
    error: loadError,
  } = usePickupRequest(pickupRequestId);
  const { execute: createOrder, loading: submitting, error } = useCreateOrder();
  const {
    options: categoryOptions,
    unitsByCategory,
    loading: loadingCategories,
  } = usePickupCategories();
  const [items, setItems] = useState<PickupRequestItemInput[]>([]);
  const [itemErrors, setItemErrors] = useState<Record<string, string>[]>([]);
  const [photos, setPhotos] = useState<OrderPhoto[]>([]);

  const validate = (): boolean => {
    const nextItemErrors = validateItems(items, unitsByCategory);
    setItemErrors(nextItemErrors);
    return !hasItemErrors(nextItemErrors);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const order = await createOrder(pickupRequestId, {
        items: items.length
          ? items.map((item) => ({
              category: item.category,
              estimated_quantity: item.estimated_quantity?.trim() || undefined,
              quantity_unit: item.quantity_unit?.trim() || undefined,
            }))
          : undefined,
        photos: photos.length ? photos.map((p) => p.file_key) : undefined,
      });
      toast.success('Order created', `Order ${order.code} has been created.`);
      router.push(`${ordersBasePath}/${order.id}`);
    } catch {
      // useCreateOrder already captured the message in `error`, shown
      // below.
    }
  };

  if (loadingRequest) return <Loading text="Loading pickup request…" />;

  if (loadError || !pickupRequest) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Pickup request not found.'}
      </div>
    );
  }

  return (
    <PageContainer variant="form">
      <Link
        href={`${requestsBasePath}/${pickupRequestId}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup request
      </Link>

      <PageHeader
        title="Create order"
        subtitle={`For ${pickupRequest.full_name}'s pickup request — materials/items are optional here and can be added later.`}
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <PickupItemsFieldArray
              items={items}
              onChange={setItems}
              categoryOptions={categoryOptions}
              unitsByCategory={unitsByCategory}
              loadingCategories={loadingCategories}
              disabled={submitting}
              errors={itemErrors}
              labels={{
                itemsSection: 'Materials (optional)',
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
            <div className="sm:col-span-2">
              <PickupPhotosUploader
                value={photos}
                onChange={setPhotos}
                disabled={submitting}
              />
            </div>
          </div>

          <FormActions className="pt-5">
            <Button
              href={`${requestsBasePath}/${pickupRequestId}`}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create order'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateOrderView };
