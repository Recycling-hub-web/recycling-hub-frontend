'use client';

import { type FormEvent, useState } from 'react';

import { TextareaField } from '../../../../form/fields/TextareaField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useCancelPickupRequest } from '../../hooks';

type CancelPickupRequestModalProps = {
  pickupRequestId: string;
  open: boolean;
  onClose: () => void;
  onCancelled: () => void;
};

type FormState = { note: string };

const INITIAL_STATE: FormState = { note: '' };

/** Cancel the whole pickup request — force-cancels every non-terminal
 * Order under it in the same action (see PickupRequestViewSet.cancel
 * on the backend). Distinct from CancelModal, which cancels one Order
 * only. Not valid once already cancelled — the caller only ever
 * renders this when status allows it. */
const CancelPickupRequestModal = ({
  pickupRequestId,
  open,
  onClose,
  onCancelled,
}: CancelPickupRequestModalProps) => {
  const { execute: cancel, loading: submitting } = useCancelPickupRequest();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    if (!formData.note.trim()) {
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
      await cancel(pickupRequestId, { note: formData.note.trim() });
      onCancelled();
      handleClose();
    } catch {
      setApiError('Could not cancel this pickup request. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Cancel pickup request"
      subtitle="This cancels every order still in progress under this request. This can't be undone."
      footer={
        <FormActions>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Keep request
          </button>
          <button
            type="submit"
            form="cancel-pickup-request-form"
            disabled={submitting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Cancelling…' : 'Cancel pickup request'}
          </button>
        </FormActions>
      }
    >
      <form
        id="cancel-pickup-request-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        <TextareaField
          label="Cancellation reason"
          field="note"
          placeholder="Why is this pickup request being cancelled?"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      </form>
    </Modal>
  );
};

export { CancelPickupRequestModal };
