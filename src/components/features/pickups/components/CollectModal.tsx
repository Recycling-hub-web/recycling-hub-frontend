'use client';

import { type FormEvent, useState } from 'react';

import { InputField } from '../../../form/fields/InputField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useCollectPickup } from '../hooks';

type CollectModalProps = {
  requestId: string;
  quantityUnit: string;
  open: boolean;
  onClose: () => void;
  onCollected: () => void;
};

type FormState = {
  collected_quantity: string;
  note: string;
};

const INITIAL_STATE: FormState = { collected_quantity: '', note: '' };

/** Mark a scheduled request as collected. Only valid from `scheduled` —
 * see CollectionRequestDecisionService.collect on the backend. Both
 * fields are optional, so there's nothing required to gate the submit
 * button on beyond "not already in flight". */
const CollectModal = ({
  requestId,
  quantityUnit,
  open,
  onClose,
  onCollected,
}: CollectModalProps) => {
  const { execute: collect, loading: submitting } = useCollectPickup();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

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
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleClose = () => {
    setFormData(INITIAL_STATE);
    setErrors({});
    setApiError('');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    try {
      await collect(requestId, {
        collected_quantity: formData.collected_quantity || undefined,
        note: formData.note || undefined,
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
            disabled={submitting}
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
      </form>
    </Modal>
  );
};

export { CollectModal };
