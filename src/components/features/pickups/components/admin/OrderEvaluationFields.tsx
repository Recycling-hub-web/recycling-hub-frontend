'use client';

import type { ComponentProps } from 'react';
import { LuCircleCheck, LuCircleX, LuClock } from 'react-icons/lu';

import { TextareaField } from '../../../../form/fields/TextareaField';
import type { SegmentedOption } from '../../../../ui/buttons/SegmentedControl';
import { SegmentedControl } from '../../../../ui/buttons/SegmentedControl';
import type { PickupRequestItemInput } from '../../services/pickupService';
import type { PickupItemsFieldArray } from '../shared/PickupItemsFieldArray';
import { isValidPrice, PricingEditor } from '../shared/PricingEditor';

type EvaluationDecision = 'none' | 'approved' | 'rejected';

/** "Not yet / Approve / Reject" — evaluating while creating, shared by
 * the New pickup request form's orders and Convert quick lead. */
const EVALUATE_NOW_OPTIONS: SegmentedOption<EvaluationDecision>[] = [
  { value: 'none', label: 'Not yet', icon: LuClock },
  {
    value: 'approved',
    label: 'Approve',
    icon: LuCircleCheck,
    activeClassName: 'text-brand-600',
  },
  {
    value: 'rejected',
    label: 'Reject',
    icon: LuCircleX,
    activeClassName: 'text-red-600',
  },
];

/** A draft order's evaluation, before it's sent. `itemPrices[i]` prices
 * the order's `items[i]` (the API takes them by position too). */
type DraftEvaluation = {
  decision: EvaluationDecision;
  price: string;
  itemized: boolean;
  itemPrices: string[];
  note: string;
};

const EMPTY_EVALUATION: DraftEvaluation = {
  decision: 'none',
  price: '',
  itemized: false,
  itemPrices: [],
  note: '',
};

/** Field errors for one evaluation: `price` and/or `note`. */
const validateEvaluation = (
  evaluation: DraftEvaluation,
  itemCount: number,
): Record<string, string> => {
  if (evaluation.decision === 'approved') {
    if (evaluation.itemized && itemCount > 1) {
      const every = Array.from({ length: itemCount }, (_, i) =>
        isValidPrice(evaluation.itemPrices[i]),
      ).every(Boolean);
      return every ? {} : { price: 'Enter a valid price for every item.' };
    }
    return isValidPrice(evaluation.price)
      ? {}
      : { price: 'Enter a valid price.' };
  }
  if (evaluation.decision === 'rejected' && !evaluation.note.trim()) {
    return { note: 'A reason is required when rejecting.' };
  }
  return {};
};

type OrderEvaluationFieldsProps = {
  /** Unique per order on the page — ids and e2e hooks. */
  id: string;
  evaluation: DraftEvaluation;
  onChange: (evaluation: DraftEvaluation) => void;
  items: PickupRequestItemInput[];
  categoryOptions: ComponentProps<
    typeof PickupItemsFieldArray
  >['categoryOptions'];
  errors?: Record<string, string>;
  disabled?: boolean;
};

/** Optional "Evaluation" block for an order being created: decide it now
 * (price to approve, reason to reject) instead of using the Evaluate
 * button on the order afterwards. */
const OrderEvaluationFields = ({
  id,
  evaluation,
  onChange,
  items,
  categoryOptions,
  errors = {},
  disabled = false,
}: OrderEvaluationFieldsProps) => {
  const set = (patch: Partial<DraftEvaluation>) =>
    onChange({ ...evaluation, ...patch });
  const headingId = `${id}-evaluation-heading`;
  const categoryLabel = (categoryId: string) => {
    const option = categoryOptions.find((o) =>
      typeof o === 'string' ? o === categoryId : o.value === categoryId,
    );
    if (!option) return '';
    return typeof option === 'string' ? option : option.label;
  };

  return (
    <section
      aria-labelledby={headingId}
      data-testid="order-evaluation"
      className="mt-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:col-span-2"
    >
      <h3 id={headingId} className="text-sm font-semibold text-neutral-950">
        Evaluation{' '}
        <span className="font-normal text-slate-400">(optional)</span>
      </h3>
      <p className="mt-0.5 text-xs text-slate-500">
        Already know the outcome? Decide it now and skip the Evaluate step on
        the order later.
      </p>

      <SegmentedControl
        ariaLabel="Evaluation decision"
        options={EVALUATE_NOW_OPTIONS}
        value={evaluation.decision}
        onChange={(decision) => set({ decision })}
        disabled={disabled}
        fullWidth
        className="mt-3"
      />

      {evaluation.decision === 'approved' && (
        <div className="mt-4">
          <PricingEditor
            lines={items.map((item, i) => {
              const quantity = item.estimated_quantity?.trim();
              return {
                key: String(i),
                label: categoryLabel(item.category) || `Item ${i + 1}`,
                detail: quantity
                  ? `${quantity} ${item.quantity_unit?.trim() || 'kg'}`
                  : undefined,
                dataField: `${id}-item-price-${i}`,
              };
            })}
            itemized={evaluation.itemized}
            onItemizedChange={(itemized) => set({ itemized })}
            total={evaluation.price}
            onTotalChange={(price) => set({ price })}
            totalDataField={`${id}-price`}
            prices={Object.fromEntries(
              evaluation.itemPrices.map((value, i) => [String(i), value]),
            )}
            onPriceChange={(key, value) => {
              const itemPrices = [...evaluation.itemPrices];
              itemPrices[Number(key)] = value;
              set({ itemPrices });
            }}
            error={errors.price}
            disabled={disabled}
          />
        </div>
      )}
      {evaluation.decision === 'rejected' && (
        <div className="mt-4">
          <TextareaField
            label="Reason"
            field="note"
            placeholder="Why this order is being rejected"
            formData={{ note: evaluation.note }}
            errors={errors}
            updateFormData={(_, note) => set({ note })}
            disabled={disabled}
          />
        </div>
      )}
    </section>
  );
};

export {
  EMPTY_EVALUATION,
  EVALUATE_NOW_OPTIONS,
  OrderEvaluationFields,
  validateEvaluation,
};
export type { DraftEvaluation, EvaluationDecision };
