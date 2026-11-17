'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { LuPackageCheck, LuPlus, LuTrash2 } from 'react-icons/lu';

import { ApiError } from '../../../../../lib/api';
import { InputField } from '../../../../form/fields/InputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { StatusFileUpload } from '../../../../form/upload/StatusFileUpload';
import { ValidatedForm } from '../../../../form/ValidatedForm';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useUploadStorageFile } from '../../../storageFiles/hooks';
import { useCollectPickup, usePickupCategories } from '../../hooks';
import type { PickupRequestItem } from '../../types';
import {
  hasItemErrors,
  QUANTITY_UNIT_LABELS,
  QUANTITY_UNITS,
  quantityError,
  type QuantityUnit,
  validateItem,
} from '../../units';

type CollectModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onCollected: () => void;
  /** Only true when the request was collected by an assigned driver
   * (who pays the customer out of pocket, then claims reimbursement
   * later) — a staff collector has nothing to reimburse, so these
   * fields stay hidden on that path. See FinanceRecord on the backend. */
  showPaymentFields?: boolean;
  /** The Order's materials — a single-item Order still collects via
   * the scalar convenience path (no quantity UI at all, same as before
   * this field existed); a multi-item one gets one quantity input per
   * item here, defaulting to its estimated_quantity, plus a category
   * select to correct a miscategorized line. */
  items?: PickupRequestItem[];
  agreedPrice?: string | null;
};

type FormState = {
  note: string;
  payment_method: string;
  proof_of_payment: string;
};

/** One brand-new material the driver found on-site — no `id`, unlike a
 * correction to an existing item. */
type NewItemRow = {
  category: string;
  collected_quantity: string;
  quantity_unit: string;
  price: string;
};

const EMPTY_NEW_ITEM: NewItemRow = {
  category: '',
  collected_quantity: '',
  quantity_unit: '',
  price: '',
};

const PAYMENT_METHOD_OPTIONS = [
  { value: 'duitnow', label: 'DuitNow' },
  { value: 'bank_transfer', label: 'Bank transfer' },
];

/** Mark a scheduled request as collected. Only valid from `scheduled` —
 * see CollectionRequestDecisionService.collect on the backend. The
 * driver is standing at the customer's door once, paying them right
 * there — this captures how, in the same submit, rather than sending
 * them to a second screen later. Also where the driver corrects an
 * existing item's category/quantity, or adds a brand-new material
 * found on-site — both go to the backend in the same `collect()` call
 * (see the extended `items` payload shape on CollectPickupPayload). */
const CollectModal = ({
  requestId,
  open,
  onClose,
  onCollected,
  showPaymentFields = false,
  items = [],
  agreedPrice,
}: CollectModalProps) => {
  const { execute: collect, loading: submitting } = useCollectPickup();
  const { execute: upload, loading: uploading } = useUploadStorageFile();
  const {
    options: categoryOptions,
    unitsByCategory,
    loading: loadingCategories,
  } = usePickupCategories();
  const initialState: FormState = {
    note: '',
    payment_method: '',
    proof_of_payment: '',
  };
  const [formData, setFormData] = useState<FormState>(initialState);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [itemQuantities, setItemQuantities] = useState<Record<string, string>>(
    {},
  );
  const [itemCategories, setItemCategories] = useState<Record<string, string>>(
    {},
  );
  const [newItems, setNewItems] = useState<NewItemRow[]>([]);
  // Unit/quantity problems — per existing item (by id) and per new row.
  const [itemErrors, setItemErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [newItemErrors, setNewItemErrors] = useState<Record<string, string>[]>(
    [],
  );

  // Re-seed the per-item quantities/categories (defaulting to each
  // item's own values) every time the modal is opened for a request.
  useEffect(() => {
    if (!open) return;
    setItemQuantities(
      Object.fromEntries(
        items.map((item) => [item.id, item.estimated_quantity ?? '']),
      ),
    );
    setItemCategories(
      Object.fromEntries(items.map((item) => [item.id, item.category.id])),
    );
    setNewItems([]);
  }, [open, items]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // An existing item's fields are keyed by its id in this form.
  const errorFor = (id: string, key: 'category' | 'quantity') => {
    const message = itemErrors[id]?.[key];
    return message ? { [id]: message } : undefined;
  };

  const unitsFor = (category: string): QuantityUnit[] =>
    category ? unitsByCategory[category] ?? QUANTITY_UNITS : [];

  const updateNewItem = (index: number, field: string, value: string) => {
    setNewItems((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        const next = { ...row, [field]: value };
        // Same rule as the order forms: a category with one unit always
        // uses it; a new category drops a unit it doesn't allow.
        if (field === 'category') {
          const allowed = unitsFor(value);
          if (
            allowed.length === 1 ||
            !(allowed as string[]).includes(next.quantity_unit)
          ) {
            next.quantity_unit = allowed.length === 1 ? allowed[0] ?? '' : '';
          }
        }
        return next;
      }),
    );
  };

  const additionalCents = newItems.reduce((total, row) => {
    const amount = Number(row.price);
    return (
      total +
      (Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) : 0)
    );
  }, 0);
  const totalCents =
    Math.round(Number(agreedPrice ?? 0) * 100) + additionalCents;

  const addNewItemRow = () =>
    setNewItems((prev) => [...prev, { ...EMPTY_NEW_ITEM }]);
  const removeNewItemRow = (index: number) =>
    setNewItems((prev) => prev.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (showPaymentFields && !formData.payment_method) {
      nextErrors.payment_method = 'Select how the customer was paid.';
    }
    if (showPaymentFields && !formData.proof_of_payment) {
      nextErrors.proof_of_payment = 'Upload proof of payment.';
    }
    setErrors(nextErrors);

    // Existing items: the quantity must suit the item's unit, and a new
    // category must allow that unit.
    const nextItemErrors: Record<string, Record<string, string>> = {};
    items.forEach((item) => {
      const rowErrors: Record<string, string> = {};
      const quantity = quantityError(
        itemQuantities[item.id],
        item.quantity_unit,
      );
      if (quantity) rowErrors.quantity = quantity;
      const category = itemCategories[item.id];
      if (
        category &&
        !(unitsFor(category) as string[]).includes(item.quantity_unit)
      ) {
        rowErrors.category = `That material isn't measured in ${QUANTITY_UNIT_LABELS[item.quantity_unit as QuantityUnit] ?? item.quantity_unit}.`;
      }
      if (Object.keys(rowErrors).length) nextItemErrors[item.id] = rowErrors;
    });
    setItemErrors(nextItemErrors);

    // New on-site items: only rows with something filled in are sent.
    const nextNewItemErrors = newItems.map((row) => {
      if (!row.category && !row.collected_quantity && !row.price) return {};
      const rowErrors = validateItem(
        {
          category: row.category,
          estimated_quantity: row.collected_quantity,
          quantity_unit: row.quantity_unit,
        },
        unitsByCategory,
      );
      if (!row.collected_quantity.trim())
        rowErrors.collected_quantity = 'Enter the collected quantity.';
      if (!/^[0-9]{1,8}(?:[.][0-9]{1,2})?$/.test(row.price.trim())) {
        rowErrors.price =
          'Enter a valid price, using up to 2 decimal places. Use 0 for no charge.';
      }
      if (rowErrors.estimated_quantity) {
        rowErrors.collected_quantity = rowErrors.estimated_quantity;
        delete rowErrors.estimated_quantity;
      }
      return rowErrors;
    });
    setNewItemErrors(nextNewItemErrors);
    if (totalCents > 9999999999)
      nextErrors.price = 'The total payment is too large.';
    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0 &&
      Object.keys(nextItemErrors).length === 0 &&
      !hasItemErrors(nextNewItemErrors)
    );
  };

  const handleClose = () => {
    if (submitting || uploading) return;
    setFormData(initialState);
    setProofFile(null);
    setErrors({});
    setApiError('');
    setItemQuantities({});
    setItemCategories({});
    setNewItems([]);
    setItemErrors({});
    setNewItemErrors([]);
    onClose();
  };

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    setProofFile(file);
    updateFormData('proof_of_payment', '');
    setApiError('');
    try {
      const result = await upload(file);
      updateFormData('proof_of_payment', result.file_key);
    } catch {
      setApiError('Could not upload the proof of payment. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (submitting || uploading || !validate()) return;

    const existingItemEntries = items.map((item) => {
      const categoryChanged = itemCategories[item.id] !== item.category.id;
      return {
        id: item.id,
        collected_quantity: itemQuantities[item.id] || undefined,
        ...(categoryChanged && itemCategories[item.id]
          ? { category: itemCategories[item.id] }
          : {}),
      };
    });
    const newItemEntries = newItems
      .filter((row) => row.category && row.collected_quantity)
      .map((row) => ({
        category: row.category,
        collected_quantity: row.collected_quantity,
        price: row.price.trim(),
        // Omitted when blank — the API fills in a single-unit category's
        // unit itself.
        ...(row.quantity_unit ? { quantity_unit: row.quantity_unit } : {}),
      }));
    const anyItemEntries =
      items.length > 0 || newItemEntries.length > 0
        ? [...existingItemEntries, ...newItemEntries]
        : undefined;

    try {
      await collect(requestId, {
        note: formData.note || undefined,
        ...(anyItemEntries && { items: anyItemEntries }),
        ...(showPaymentFields && {
          // The server calculates the agreed amount plus validated
          // on-site item prices; do not trust a client-computed total.
          payment_method: formData.payment_method as
            | 'duitnow'
            | 'bank_transfer',
          proof_of_payment: formData.proof_of_payment,
        }),
      });
      onCollected();
      handleClose();
    } catch (error) {
      setApiError(
        error instanceof ApiError && error.status === 400
          ? error.message
          : 'Could not mark this pickup as collected. Please try again.',
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Mark as collected"
      subtitle="Confirm materials and payment."
      icon={<LuPackageCheck className="size-5 text-brand-600" />}
      size="xl"
      dismissible={!submitting && !uploading}
      footer={
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {agreedPrice != null && (
            <div className="flex items-center justify-between gap-4 sm:block">
              <p className="text-xs font-medium text-slate-500">
                Total payment
              </p>
              <p className="text-xl font-bold tabular-nums text-brand-800">
                RM {(totalCents / 100).toFixed(2)}
              </p>
            </div>
          )}
          <FormActions className="flex-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="collect-pickup-form"
              disabled={submitting || uploading}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Mark collected'}
            </button>
          </FormActions>
        </div>
      }
    >
      <ValidatedForm
        id="collect-pickup-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 py-2"
      >
        <AlertBanner message={apiError} />

        {items.length > 0 && (
          <section
            aria-label="Collected materials"
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                1
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Collected materials
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Confirm the category and actual quantity for each item.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-x-4 rounded-xl bg-slate-50 px-3 pt-3 sm:grid-cols-2"
                >
                  <SelectField
                    label={`Category (${item.category.name})`}
                    field={item.id}
                    dataField={`item-category-${item.category.name}`}
                    required={false}
                    options={categoryOptions}
                    formData={itemCategories}
                    errors={errorFor(item.id, 'category')}
                    updateFormData={(field, value) =>
                      setItemCategories((prev) => ({ ...prev, [field]: value }))
                    }
                    disabled={loadingCategories}
                  />
                  <InputField
                    label={`${item.category.name} (${QUANTITY_UNIT_LABELS[item.quantity_unit as QuantityUnit] ?? item.quantity_unit})`}
                    field={item.id}
                    dataField={`item-quantity-${item.category.name}`}
                    type="number"
                    required={false}
                    placeholder={
                      item.quantity_unit === 'unit' ? 'e.g. 3' : 'e.g. 5'
                    }
                    formData={itemQuantities}
                    errors={errorFor(item.id, 'quantity')}
                    updateFormData={(field, value) =>
                      setItemQuantities((prev) => ({ ...prev, [field]: value }))
                    }
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          aria-label="New materials"
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                2
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Found on-site{' '}
                  <span className="font-normal text-slate-400">· Optional</span>
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Add any extra material and its total price.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={addNewItemRow}
              className="px-3.5 py-1.5 text-xs"
            >
              <LuPlus className="mr-1.5 size-3.5" />
              Add another material
            </Button>
          </div>
          {newItems.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              No additional materials. Add one if you collected more than
              expected.
            </p>
          )}
          {newItems.length > 0 && (
            <div className="space-y-3">
              {newItems.map((row, index) => (
                // eslint-disable-next-line react/no-array-index-key -- rows have no stable id until submitted
                <div
                  key={index}
                  className="grid grid-cols-1 gap-x-4 rounded-xl border border-slate-200 bg-slate-50 p-3 pb-0 sm:grid-cols-2"
                >
                  <div className="mb-3 flex items-center justify-between sm:col-span-2">
                    <p className="text-xs font-semibold text-slate-700">
                      Additional material {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeNewItemRow(index)}
                      aria-label="Remove this material"
                      className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LuTrash2 className="size-4" />
                    </button>
                  </div>
                  <SelectField
                    label="Category"
                    field="category"
                    options={categoryOptions}
                    formData={row}
                    errors={newItemErrors[index]}
                    updateFormData={(field, value) =>
                      updateNewItem(index, field, value)
                    }
                    disabled={loadingCategories}
                  />
                  <InputField
                    label="Quantity"
                    field="collected_quantity"
                    type="number"
                    required={false}
                    placeholder="e.g. 5"
                    formData={row}
                    errors={newItemErrors[index]}
                    updateFormData={(field, value) =>
                      updateNewItem(index, field, value)
                    }
                  />
                  <div className="min-w-0">
                    <SelectField
                      label="Unit"
                      field="quantity_unit"
                      required={false}
                      options={unitsFor(row.category).map((unit) => ({
                        value: unit,
                        label: QUANTITY_UNIT_LABELS[unit],
                      }))}
                      formData={row}
                      errors={newItemErrors[index]}
                      updateFormData={(field, value) =>
                        updateNewItem(index, field, value)
                      }
                      disabled={unitsFor(row.category).length <= 1}
                    />
                  </div>
                  <div className="min-w-0">
                    <InputField
                      label="Price"
                      field="price"
                      dataField={`new-item-price-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      prefix="RM"
                      helperText="Total for this material, not per unit. Use 0 for no charge."
                      formData={row}
                      errors={newItemErrors[index]}
                      updateFormData={(field, value) =>
                        updateNewItem(index, field, value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {agreedPrice != null && (
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm">
            <dl className="space-y-2">
              <div className="flex justify-between gap-3">
                <dt>Existing amount</dt>
                <dd>RM {Number(agreedPrice).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>New materials</dt>
                <dd>RM {(additionalCents / 100).toFixed(2)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-brand-200 pt-2 font-semibold">
                <dt>Total payment</dt>
                <dd>RM {(totalCents / 100).toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        )}
        <AlertBanner message={errors.price} />
        <div className="rounded-2xl border border-slate-200 p-4 pb-0">
          <TextareaField
            label="Collection note"
            field="note"
            required={false}
            placeholder="Anything the team should know about this collection?"
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        {showPaymentFields && (
          <section
            aria-label="Payment confirmation"
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="mb-4 flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                3
              </span>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Payment confirmation
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Use DuitNow or bank transfer and upload the payment receipt.
                </p>
              </div>
            </div>
            <SelectField
              label="Payment method"
              field="payment_method"
              required
              options={PAYMENT_METHOD_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />

            <div className="mb-4" data-field="proof_of_payment">
              <StatusFileUpload
                id="collect-proof-input"
                label="Proof of payment"
                compact
                description="Upload a receipt showing the customer was paid."
                file={proofFile}
                onFileChange={handleProofChange}
                onRemove={() => {
                  if (submitting || uploading) return;
                  setProofFile(null);
                  updateFormData('proof_of_payment', '');
                }}
                onError={setApiError}
                required
                disabled={submitting || uploading}
                uploading={uploading}
              />
              {errors.proof_of_payment && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.proof_of_payment}
                </p>
              )}
            </div>
          </section>
        )}
      </ValidatedForm>
    </Modal>
  );
};

export { CollectModal };
