'use client';

import { useEffect, useState } from 'react';

import { TextareaField } from '../../../../form/fields/TextareaField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useEvaluatePickup } from '../../hooks';
import type { PickupRequestItem } from '../../types';
import { formatQuantity } from '../../units';
import { isValidPrice, PricingEditor } from '../shared/PricingEditor';

type EvaluateModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onEvaluated: () => void;
  /** The request's materials — the lump-vs-itemized pricing toggle only
   * makes sense (and only renders) when there's more than one, since a
   * single item prices the same either way. Shown for individual and
   * business requests alike — the evaluator's choice is never gated by
   * request_type. */
  items?: PickupRequestItem[];
};

type FormState = { price: string; note: string };

const INITIAL_STATE: FormState = { price: '', note: '' };

/** Approve or reject a pending request's product/category before it can
 * be scheduled — see CollectionRequestDecisionService.evaluate on the
 * backend; the caller only ever renders this when the request is still
 * `pending`. Unlike the other action modals, this one has two possible
 * outcomes instead of one, so there are two submit buttons (Reject/
 * Approve) rather than a single form submit — each just calls
 * handleSubmit with its own decision. Re-evaluating later (while still
 * pending) is allowed, so this isn't a one-shot action.
 *
 * Approving requires a price (creates/updates the linked finance
 * record — see FinanceRecord on the backend); rejecting requires a
 * note explaining why, same as CancelModal's required cancellation
 * reason. */
const EvaluateModal = ({
  requestId,
  open,
  onClose,
  onEvaluated,
  items = [],
}: EvaluateModalProps) => {
  const { execute: evaluate, loading: submitting } = useEvaluatePickup();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [pricingMode, setPricingMode] = useState<'lump' | 'itemized'>('lump');
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({});

  const canItemize = items.length > 1;

  useEffect(() => {
    if (!open) return;
    setPricingMode('lump');
    setItemPrices({});
  }, [open]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (decision: 'approved' | 'rejected'): boolean => {
    if (decision === 'approved') {
      if (canItemize && pricingMode === 'itemized') {
        if (!items.every((item) => isValidPrice(itemPrices[item.id]))) {
          setErrors({ price: 'Enter a valid price for every item.' });
          return false;
        }
      } else if (!isValidPrice(formData.price)) {
        setErrors({ price: 'Enter a valid price.' });
        return false;
      }
    } else if (!formData.note.trim()) {
      setErrors({ note: 'A reason is required when rejecting.' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleClose = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    setApiError('');
    setPricingMode('lump');
    setItemPrices({});
    onClose();
  };

  const handleSubmit = async (decision: 'approved' | 'rejected') => {
    setApiError('');
    if (!validate(decision)) return;
    const itemized =
      decision === 'approved' && canItemize && pricingMode === 'itemized';
    try {
      await evaluate(requestId, {
        decision,
        price:
          decision === 'approved' && !itemized ? formData.price : undefined,
        items: itemized
          ? items.map((item) => ({
              item_id: item.id,
              price: itemPrices[item.id] ?? '',
            }))
          : undefined,
        note: formData.note || undefined,
      });
      onEvaluated();
      handleClose();
    } catch {
      setApiError('Could not evaluate this pickup request. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Evaluate pickup request"
      subtitle="Approve with a price, or reject with a reason."
      footer={
        <FormActions>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('rejected')}
            disabled={submitting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Reject'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('approved')}
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Approve'}
          </button>
        </FormActions>
      }
    >
      <div className="space-y-1">
        <AlertBanner message={apiError} />

        <PricingEditor
          lines={items.map((item) => ({
            key: item.id,
            label: item.category.name,
            detail: item.estimated_quantity
              ? formatQuantity(item.estimated_quantity, item.quantity_unit)
              : undefined,
            dataField: `item-price-${item.category.name}`,
          }))}
          itemized={pricingMode === 'itemized'}
          onItemizedChange={(on) => {
            setPricingMode(on ? 'itemized' : 'lump');
            setErrors((prev) => ({ ...prev, price: '' }));
          }}
          total={formData.price}
          onTotalChange={(value) => updateFormData('price', value)}
          totalDataField="price"
          prices={itemPrices}
          onPriceChange={(key, value) => {
            setItemPrices((prev) => ({ ...prev, [key]: value }));
            setErrors((prev) => ({ ...prev, price: '' }));
          }}
          error={errors.price}
          disabled={submitting}
        />
        <TextareaField
          label="Note"
          field="note"
          required={false}
          placeholder="Required to reject — optional otherwise."
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      </div>
    </Modal>
  );
};

export { EvaluateModal };
