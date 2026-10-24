'use client';

import type { ComponentProps, Dispatch, SetStateAction } from 'react';
import { LuPlus } from 'react-icons/lu';

import { Button } from '../../../../ui/buttons/Button';
import type { PickupRequestItemInput } from '../../services/pickupService';
import type { UnitsByCategory } from '../../units';
import { PickupItemsFieldArray } from '../shared/PickupItemsFieldArray';
import {
  type OrderPhoto,
  PickupPhotosUploader,
} from '../shared/PickupPhotosUploader';

/** Same cap the backend enforces per pickup request
 * (MAX_ORDERS_PER_PICKUP_REQUEST). */
const MAX_ORDERS = 7;

type DraftOrder = {
  /** Stable React key only — never sent to the API. */
  key: string;
  items: PickupRequestItemInput[];
  photos: OrderPhoto[];
};

let nextKey = 0;
const newDraftOrder = (): DraftOrder => {
  nextKey += 1;
  return { key: `order-${nextKey}`, items: [], photos: [] };
};

type NewOrdersFieldArrayProps = {
  orders: DraftOrder[];
  /** A state setter — every change is applied to the latest list, so
   * quick successive edits to different orders can't overwrite each
   * other. */
  onChange: Dispatch<SetStateAction<DraftOrder[]>>;
  categoryOptions: ComponentProps<
    typeof PickupItemsFieldArray
  >['categoryOptions'];
  unitsByCategory?: UnitsByCategory;
  loadingCategories?: boolean;
  disabled?: boolean;
  /** Per order, per item — the same shape PickupItemsFieldArray takes. */
  itemErrors?: Record<string, string>[][];
};

/** Orders to create together with a new pickup request — each with its
 * own materials and photos, the same inputs as the Create order page.
 * Optional: a request can still be saved with no orders and get them
 * later from its details page. */
const NewOrdersFieldArray = ({
  orders,
  onChange,
  categoryOptions,
  unitsByCategory,
  loadingCategories,
  disabled,
  itemErrors = [],
}: NewOrdersFieldArrayProps) => {
  const update = (key: string, patch: Partial<DraftOrder>) =>
    onChange((current) =>
      current.map((o) => (o.key === key ? { ...o, ...patch } : o)),
    );

  return (
    <div className="sm:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-900">Orders</p>
          <p className="text-xs text-slate-500">
            Optional — add the materials now, or later from the request.
          </p>
        </div>
        {orders.length < MAX_ORDERS && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onChange((current) => [...current, newDraftOrder()])}
            disabled={disabled}
          >
            <LuPlus className="mr-1.5 size-4" />
            Add order
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={order.key}
            data-testid="new-order"
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                Order {index + 1}
              </p>
              <button
                type="button"
                onClick={() =>
                  onChange((current) =>
                    current.filter((o) => o.key !== order.key),
                  )
                }
                disabled={disabled}
                className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
              >
                Remove order
              </button>
            </div>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <PickupItemsFieldArray
                items={order.items}
                onChange={(items) => update(order.key, { items })}
                categoryOptions={categoryOptions}
                unitsByCategory={unitsByCategory}
                loadingCategories={loadingCategories}
                disabled={disabled}
                errors={itemErrors[index] ?? []}
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
              <div className="sm:col-span-2">
                <PickupPhotosUploader
                  value={order.photos}
                  onChange={(photos) => update(order.key, { photos })}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { NewOrdersFieldArray };
export type { DraftOrder };
