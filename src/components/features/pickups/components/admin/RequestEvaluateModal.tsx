'use client';

import { useEffect, useState } from 'react';
import { LuClipboardCheck } from 'react-icons/lu';

import { ApiError } from '../../../../../lib/api';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useEvaluateWholeRequest } from '../../hooks';
import type { PickupRequestItem, PickupStatus } from '../../types';
import { formatQuantity } from '../../units';
import { isValidPrice, PricingEditor } from '../shared/PricingEditor';

/** The bits of an order this modal needs — both the list and details
 * shapes have them. */
type EvaluableOrder = {
  id: string;
  code: string;
  status: PickupStatus;
  evaluation_status: string;
  items: PickupRequestItem[];
};

/** Orders a request-level evaluation covers: still open (pending), or
 * scheduled — re-pricing keeps the driver, rejecting takes it off them. */
const evaluableOrders = <T extends EvaluableOrder>(orders: T[]): T[] =>
  orders.filter((o) => o.status === 'pending' || o.status === 'scheduled');

/** True when every one of those orders has already been evaluated. */
const isReevaluation = (orders: EvaluableOrder[]) => {
  const open = evaluableOrders(orders);
  return (
    open.length > 0 && open.every((o) => o.evaluation_status !== 'pending')
  );
};

type RequestEvaluateModalProps = {
  pickupRequestId: string;
  orders: EvaluableOrder[];
  open: boolean;
  onClose: () => void;
  onEvaluated: () => void;
};

/** Evaluate a whole pickup request (POST /pickup-requests/{id}/evaluate/):
 * every order still open to it, at once. Approve with one total for the
 * request — shared across its orders by estimated quantity (evenly when
 * that can't be compared) — or switch on "Price each item" to price
 * every material line; reject with a reason. */
const RequestEvaluateModal = ({
  pickupRequestId,
  orders,
  open,
  onClose,
  onEvaluated,
}: RequestEvaluateModalProps) => {
  const { execute: evaluate, loading: submitting } = useEvaluateWholeRequest();
  const [total, setTotal] = useState('');
  const [note, setNote] = useState('');
  const [itemized, setItemized] = useState(false);
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const covered = evaluableOrders(orders);
  const lines = covered.flatMap((order) =>
    order.items.map((item) => ({ order, item })),
  );
  const anyScheduled = covered.some((o) => o.status === 'scheduled');
  const reevaluation = isReevaluation(orders);

  useEffect(() => {
    if (!open) return;
    setTotal('');
    setNote('');
    setItemized(false);
    setItemPrices({});
    setErrors({});
    setApiError('');
  }, [open]);

  const validate = (decision: 'approved' | 'rejected') => {
    if (decision === 'rejected') {
      if (!note.trim()) {
        setErrors({ note: 'A reason is required when rejecting.' });
        return false;
      }
    } else if (itemized && lines.length > 1) {
      if (!lines.every(({ item }) => isValidPrice(itemPrices[item.id]))) {
        setErrors({ price: 'Enter a valid price for every item.' });
        return false;
      }
    } else if (!isValidPrice(total)) {
      setErrors({ price: 'Enter a valid price.' });
      return false;
    }
    setErrors({});
    return true;
  };

  const submit = async (decision: 'approved' | 'rejected') => {
    setApiError('');
    if (!validate(decision)) return;
    const perItem = decision === 'approved' && itemized && lines.length > 1;
    try {
      await evaluate(pickupRequestId, {
        decision,
        price: decision === 'approved' && !perItem ? total : undefined,
        items: perItem
          ? lines.map(({ item }) => ({
              item_id: item.id,
              price: itemPrices[item.id] ?? '',
            }))
          : undefined,
        note: note.trim() || undefined,
      });
      onEvaluated();
      onClose();
    } catch (err) {
      setApiError(
        err instanceof ApiError && err.status === 400
          ? err.message
          : 'Could not evaluate this pickup request. Please try again.',
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        reevaluation ? 'Re-evaluate pickup request' : 'Evaluate pickup request'
      }
      subtitle={`${covered.length} order${covered.length === 1 ? '' : 's'}: ${covered.map((o) => o.code).join(', ')}`}
      icon={<LuClipboardCheck className="size-5" />}
      closeOnBackdrop={!submitting}
      footer={
        <FormActions>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="danger-outline"
            onClick={() => submit('rejected')}
            disabled={submitting}
          >
            Reject
          </Button>
          <Button onClick={() => submit('approved')} disabled={submitting}>
            {submitting ? 'Saving…' : 'Approve'}
          </Button>
        </FormActions>
      }
    >
      <div className="space-y-1">
        <AlertBanner message={apiError} />
        {anyScheduled && (
          <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Some orders already have a driver. Approving keeps them on it with
            the new price; rejecting takes those orders off the driver.
          </p>
        )}

        <PricingEditor
          lines={lines.map(({ order, item }) => ({
            key: item.id,
            label: item.category.name,
            detail: [
              covered.length > 1 ? order.code : '',
              item.estimated_quantity
                ? formatQuantity(item.estimated_quantity, item.quantity_unit)
                : '',
            ]
              .filter(Boolean)
              .join(' · '),
            dataField: `item-price-${item.id}`,
          }))}
          itemized={itemized}
          onItemizedChange={(on) => {
            setItemized(on);
            setErrors({});
          }}
          total={total}
          onTotalChange={(value) => {
            setTotal(value);
            setErrors({});
          }}
          totalDataField="price"
          prices={itemPrices}
          onPriceChange={(key, value) => {
            setItemPrices((prev) => ({ ...prev, [key]: value }));
            setErrors({});
          }}
          error={errors.price}
          disabled={submitting}
        />
        {!itemized && covered.length > 1 && (
          <p className="-mt-2 mb-3 text-xs text-slate-500">
            The total is shared across the orders by their estimated quantity.
          </p>
        )}
        <TextareaField
          label="Note"
          field="note"
          required={false}
          placeholder="Required to reject — optional otherwise."
          formData={{ note }}
          errors={errors}
          updateFormData={(_, value) => {
            setNote(value);
            setErrors({});
          }}
          disabled={submitting}
        />
      </div>
    </Modal>
  );
};

export { evaluableOrders, isReevaluation, RequestEvaluateModal };
export type { EvaluableOrder };
