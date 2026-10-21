'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { LuPlus, LuReceipt, LuTrash2, LuUpload } from 'react-icons/lu';

import { InputField } from '../../../../form/fields/InputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { TextareaField } from '../../../../form/fields/TextareaField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useUploadStorageFile } from '../../../storageFiles/hooks';
import { useCollectPickup, usePickupCategories } from '../../hooks';
import type { PickupRequestItem } from '../../types';

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
};

const EMPTY_NEW_ITEM: NewItemRow = {
  category: '',
  collected_quantity: '',
  quantity_unit: 'kg',
};

const PAYMENT_METHOD_OPTIONS = [
  { value: 'duitnow', label: 'DuitNow' },
  { value: 'cash', label: 'Cash' },
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
}: CollectModalProps) => {
  const { execute: collect, loading: submitting } = useCollectPickup();
  const { execute: upload, loading: uploading } = useUploadStorageFile();
  const { options: categoryOptions, loading: loadingCategories } =
    usePickupCategories();
  const initialState: FormState = {
    note: '',
    payment_method: '',
    proof_of_payment: '',
  };
  const [formData, setFormData] = useState<FormState>(initialState);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [itemQuantities, setItemQuantities] = useState<Record<string, string>>(
    {},
  );
  const [itemCategories, setItemCategories] = useState<Record<string, string>>(
    {},
  );
  const [newItems, setNewItems] = useState<NewItemRow[]>([]);

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

  let uploadLabel = 'Upload';
  if (uploading) uploadLabel = 'Uploading…';
  else if (formData.proof_of_payment) uploadLabel = 'Replace';

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const updateNewItem = (index: number, field: string, value: string) => {
    setNewItems((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  const addNewItemRow = () =>
    setNewItems((prev) => [...prev, { ...EMPTY_NEW_ITEM }]);
  const removeNewItemRow = (index: number) =>
    setNewItems((prev) => prev.filter((_, i) => i !== index));

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (showPaymentFields && !formData.payment_method) {
      nextErrors.payment_method = 'Select how the customer was paid.';
    }
    // Proof of payment is optional for now — not required client-side.
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    setFormData(initialState);
    setProofPreview(null);
    setErrors({});
    setApiError('');
    setItemQuantities({});
    setItemCategories({});
    setNewItems([]);
    onClose();
  };

  const handleProofChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const result = await upload(file);
      updateFormData('proof_of_payment', result.file_key);
      setProofPreview(URL.createObjectURL(file));
    } catch {
      setApiError('Could not upload the proof of payment. Please try again.');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

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
        quantity_unit: row.quantity_unit || 'kg',
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
          // actual_amount deliberately omitted — defaults server-side
          // to the agreed price (set at evaluation), which is always
          // the right amount here.
          payment_method: formData.payment_method as
            | 'duitnow'
            | 'cash'
            | 'bank_transfer',
          proof_of_payment: formData.proof_of_payment,
        }),
      });
      onCollected();
      handleClose();
    } catch {
      setApiError('Could not mark this pickup as collected. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Mark as collected"
      subtitle="Confirm what was actually picked up."
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
            type="submit"
            form="collect-pickup-form"
            disabled={submitting || uploading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Mark collected'}
          </button>
        </FormActions>
      }
    >
      <form
        id="collect-pickup-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />

        {items.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-slate-900">
              Collected quantity per item
            </p>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 gap-x-4 sm:grid-cols-2"
                >
                  <SelectField
                    label={`Category (${item.category.name})`}
                    field={item.id}
                    dataField={`item-category-${item.category.name}`}
                    required={false}
                    options={categoryOptions}
                    formData={itemCategories}
                    updateFormData={(field, value) =>
                      setItemCategories((prev) => ({ ...prev, [field]: value }))
                    }
                    disabled={loadingCategories}
                  />
                  <InputField
                    label={`${item.category.name} (${item.quantity_unit})`}
                    field={item.id}
                    dataField={`item-quantity-${item.category.name}`}
                    type="number"
                    required={false}
                    placeholder="e.g. 5"
                    formData={itemQuantities}
                    updateFormData={(field, value) =>
                      setItemQuantities((prev) => ({ ...prev, [field]: value }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-900">
              Found on-site{' '}
              <span className="font-normal text-slate-400">(optional)</span>
            </p>
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
          {newItems.length > 0 && (
            <div className="space-y-3">
              {newItems.map((row, index) => (
                // eslint-disable-next-line react/no-array-index-key -- rows have no stable id until submitted
                <div
                  key={index}
                  className="grid grid-cols-1 gap-x-4 gap-y-1 rounded-xl border border-slate-200 p-3 sm:grid-cols-3"
                >
                  <SelectField
                    label="Category"
                    field="category"
                    options={categoryOptions}
                    formData={row}
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
                    updateFormData={(field, value) =>
                      updateNewItem(index, field, value)
                    }
                  />
                  <div className="flex items-end gap-2">
                    <InputField
                      label="Unit"
                      field="quantity_unit"
                      required={false}
                      placeholder="e.g. kg"
                      formData={row}
                      updateFormData={(field, value) =>
                        updateNewItem(index, field, value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeNewItemRow(index)}
                      aria-label="Remove this material"
                      className="mb-4 inline-flex size-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LuTrash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <TextareaField
          label="Note"
          field="note"
          required={false}
          placeholder="Optional."
          formData={formData}
          updateFormData={updateFormData}
        />

        {showPaymentFields && (
          <>
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
              <label className="block text-sm font-medium text-slate-900">
                Proof of payment
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                A receipt screenshot — distinct from the collection photo, this
                proves the money moved.
              </p>
              <div className="mt-2 flex items-center gap-4">
                {proofPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a static asset
                  <img
                    src={proofPreview}
                    alt=""
                    className="size-16 shrink-0 rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                    <LuReceipt className="size-6" />
                  </span>
                )}
                <label
                  htmlFor="collect-proof-input"
                  className={`flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300 hover:bg-slate-50 ${
                    uploading ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <LuUpload className="size-4" />
                  {uploadLabel}
                </label>
              </div>
              <input
                id="collect-proof-input"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={uploading}
                onChange={(e) => handleProofChange(e.target.files?.[0])}
              />
              {errors.proof_of_payment && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.proof_of_payment}
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export { CollectModal };
