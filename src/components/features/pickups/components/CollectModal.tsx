'use client';

import { type FormEvent, useState } from 'react';
import { LuReceipt, LuUpload } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useUploadStorageFile } from '../../storageFiles/hooks';
import { useCollectPickup } from '../hooks';

type CollectModalProps = {
  requestId: string;
  quantityUnit: string;
  open: boolean;
  onClose: () => void;
  onCollected: () => void;
  /** Only true when the request was collected by an assigned driver
   * (who pays the customer out of pocket, then claims reimbursement
   * later) — a staff collector has nothing to reimburse, so these
   * fields stay hidden on that path. See FinanceRecord on the backend. */
  showPaymentFields?: boolean;
  /** The agreed price, to prefill `actual_amount` — defaults to it
   * server-side too if left untouched. */
  price?: string | null;
};

type FormState = {
  collected_quantity: string;
  note: string;
  actual_amount: string;
  payment_method: string;
  proof_of_payment: string;
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
 * them to a second screen later. */
const CollectModal = ({
  requestId,
  quantityUnit,
  open,
  onClose,
  onCollected,
  showPaymentFields = false,
  price,
}: CollectModalProps) => {
  const { execute: collect, loading: submitting } = useCollectPickup();
  const { execute: upload, loading: uploading } = useUploadStorageFile();
  const initialState: FormState = {
    collected_quantity: '',
    note: '',
    actual_amount: price ?? '',
    payment_method: '',
    proof_of_payment: '',
  };
  const [formData, setFormData] = useState<FormState>(initialState);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  let uploadLabel = 'Upload';
  if (uploading) uploadLabel = 'Uploading…';
  else if (formData.proof_of_payment) uploadLabel = 'Replace';

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (formData.collected_quantity) {
      const qty = Number(formData.collected_quantity);
      if (Number.isNaN(qty) || qty <= 0) {
        nextErrors.collected_quantity = 'Enter a positive number.';
      }
    }
    if (showPaymentFields) {
      if (!formData.payment_method) {
        nextErrors.payment_method = 'Select how the customer was paid.';
      }
      if (!formData.proof_of_payment) {
        nextErrors.proof_of_payment = 'Upload proof of payment.';
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    setFormData(initialState);
    setProofPreview(null);
    setErrors({});
    setApiError('');
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
    try {
      await collect(requestId, {
        collected_quantity: formData.collected_quantity || undefined,
        note: formData.note || undefined,
        ...(showPaymentFields && {
          actual_amount: formData.actual_amount || undefined,
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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="collect-pickup-form"
            disabled={submitting || uploading}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Saving…' : 'Mark collected'}
          </button>
        </div>
      }
    >
      <form
        id="collect-pickup-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        <InputField
          label={`Collected quantity (${quantityUnit})`}
          field="collected_quantity"
          type="number"
          required={false}
          placeholder="Optional — defaults to the estimated quantity."
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
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
            <InputField
              label="Amount actually paid to the customer"
              field="actual_amount"
              type="number"
              required={false}
              placeholder="Defaults to the agreed price if left blank."
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
            />
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
                Proof of payment <span className="text-red-600">*</span>
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
