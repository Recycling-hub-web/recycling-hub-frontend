'use client';

import { type FormEvent, useState } from 'react';

import { TextareaField } from '../../../form/fields/TextareaField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useCancelPickup } from '../hooks';

type CancelModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onCancelled: () => void;
};

type FormState = { note: string };

const INITIAL_STATE: FormState = { note: '' };

/** Cancel a pending or scheduled request. Not valid once `collected` —
 * see CollectionRequestDecisionService.cancel on the backend; the caller
 * only ever renders this when status allows it. Unlike schedule/collect,
 * the reason is required here — it becomes `cancellation_reason`, the
 * only record of why a request didn't go through. */
const CancelModal = ({
  requestId,
  open,
  onClose,
  onCancelled,
}: CancelModalProps) => {
  const { execute: cancel, loading: submitting } = useCancelPickup();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const isValid = formData.note.trim().length > 0;

  const validate = (): boolean => {
    if (!isValid) {
      setErrors({ note: 'A cancellation reason is required.' });
      return false;
    }
    setErrors({});
    return true;
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
      await cancel(requestId, { note: formData.note.trim() });
      onCancelled();
      handleClose();
    } catch {
      setApiError('Could not cancel this pickup. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cancel pickup"
      subtitle="This can't be undone."
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep request
          </button>
          <button
            type="submit"
            form="cancel-pickup-form"
            disabled={submitting || !isValid}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Cancelling…' : 'Cancel pickup'}
          </button>
        </div>
      }
    >
      <form
        id="cancel-pickup-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        <TextareaField
          label="Cancellation reason"
          field="note"
          placeholder="Why is this pickup being cancelled?"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      </form>
    </Modal>
  );
};

export { CancelModal };
