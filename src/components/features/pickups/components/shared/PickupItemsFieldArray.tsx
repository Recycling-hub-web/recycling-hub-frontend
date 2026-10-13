'use client';

import { LuPlus, LuTrash2 } from 'react-icons/lu';

import { InputField } from '../../../../form/fields/InputField';
import {
  SelectField,
  type SelectOption,
} from '../../../../form/fields/SelectField';
import { Button } from '../../../../ui/buttons/Button';
import type { PickupRequestItemInput } from '../../services/pickupService';

const EMPTY_ITEM: PickupRequestItemInput = {
  category: '',
  estimated_quantity: '',
  quantity_unit: '',
};

type PickupItemsFieldArrayLabels = {
  itemsSection: string;
  category: string;
  estimatedQuantity: string;
  estimatedQuantityPlaceholder: string;
  quantityUnit: string;
  quantityUnitPlaceholder: string;
  addItem: string;
  removeItem: string;
  /** Per-row heading shown with 2+ rows, numbered, e.g. "Item" → "Item 2". */
  itemHeading: string;
};

type PickupItemsFieldArrayProps = {
  items: PickupRequestItemInput[];
  onChange: (items: PickupRequestItemInput[]) => void;
  categoryOptions: SelectOption[];
  loadingCategories?: boolean;
  disabled?: boolean;
  /** One error map per row, same shape/index as `items`. */
  errors?: Record<string, string>[];
  /** Passed in rather than read from useDictionary() directly — only
   * the public form is part of the bilingual site; the admin/staff
   * "New request" view that reuses this component is English-only,
   * like every other dashboard screen. */
  labels: PickupItemsFieldArrayLabels;
};

/** Shared repeatable "materials" editor — a request (individual or
 * business alike) can hold several items in one visit, e.g. "10
 * computers, 3 phones, 3 AirPods." Used by both the public pickup
 * request form and the admin/staff "New request" view. */
const PickupItemsFieldArray = ({
  items,
  onChange,
  categoryOptions,
  loadingCategories = false,
  disabled = false,
  errors = [],
  labels,
}: PickupItemsFieldArrayProps) => {
  const updateItem = (index: number, field: string, value: string) => {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addItem = () => onChange([...items, { ...EMPTY_ITEM }]);

  const removeItem = (index: number) =>
    onChange(items.filter((_, i) => i !== index));

  return (
    <div className="mb-4 sm:col-span-2">
      {/* Section header — the add action sits top-right, like every
          section-level action in the app. */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-900">
          {labels.itemsSection}
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={addItem}
          disabled={disabled}
          className="px-3.5 py-1.5 text-xs"
        >
          <LuPlus className="mr-1.5 size-3.5" />
          {labels.addItem}
        </Button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key -- rows have no stable id until submitted; index is fine for a client-only draft list
          <div key={index} className="rounded-xl border border-slate-200 p-4">
            {items.length > 1 && (
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {labels.itemHeading} {index + 1}
                </p>
                <Button
                  type="button"
                  variant="danger-outline"
                  onClick={() => removeItem(index)}
                  disabled={disabled}
                  className="px-3.5 py-1.5 text-xs"
                >
                  <LuTrash2 className="mr-1.5 size-3.5" />
                  {labels.removeItem}
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
              <SelectField
                label={labels.category}
                field="category"
                options={categoryOptions}
                formData={item}
                errors={errors[index]}
                updateFormData={(field, value) =>
                  updateItem(index, field, value)
                }
                disabled={disabled || loadingCategories}
              />
              <InputField
                label={labels.estimatedQuantity}
                field="estimated_quantity"
                type="number"
                required={false}
                placeholder={labels.estimatedQuantityPlaceholder}
                formData={item}
                updateFormData={(field, value) =>
                  updateItem(index, field, value)
                }
                disabled={disabled}
              />
              <InputField
                label={labels.quantityUnit}
                field="quantity_unit"
                required={false}
                placeholder={labels.quantityUnitPlaceholder}
                formData={item}
                updateFormData={(field, value) =>
                  updateItem(index, field, value)
                }
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { PickupItemsFieldArray };
export type { PickupItemsFieldArrayLabels };
