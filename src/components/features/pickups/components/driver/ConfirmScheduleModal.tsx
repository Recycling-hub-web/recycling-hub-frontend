'use client';

import { type FormEvent, useState } from 'react';

import { InputField } from '../../../../form/fields/InputField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useConfirmSchedule } from '../../hooks';

type ConfirmScheduleModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onConfirmed: () => void;
  /** Prefilled from the Order's current scheduled_at, if any. */
  initialScheduledAt?: string | null;
};

type FormState = { scheduled_at: string };

/** The assigned driver's explicit confirmation of the pickup time —
 * closes the gap where assign-driver/claim alone reach `scheduled`
 * with no explicit time commitment from the driver (see
 * CollectionRequestDecisionService.confirm_schedule on the backend).
 * Only valid from `scheduled`, and only by the assigned driver — the
 * caller only ever renders this once `pickup_confirmed_at` is still
 * null. Same Modal/FormActions conventions as AssignDriverModal. */
const ConfirmScheduleModal = ({
  requestId,
  open,
  onClose,
  onConfirmed,
  initialScheduledAt,
}: ConfirmScheduleModalProps) => {
  const { execute: confirmSchedule, loading: submitting } =
    useConfirmSchedule();
  const [formData, setFormData] = useState<FormState>({
    scheduled_at: initialScheduledAt?.slice(0, 16) ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    if (!formData.scheduled_at) {
      setErrors({ scheduled_at: 'Pick the pickup date and time.' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleClose = () => {
    setErrors({});
    setApiError('');
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    try {
      await confirmSchedule(requestId, {
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
      });
      onConfirmed();
      handleClose();
    } catch {
      setApiError('Could not confirm the pickup time. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Confirm pickup time"
      subtitle="Let the customer know exactly when you'll arrive."
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
            form="confirm-schedule-form"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Confirming…' : 'Confirm'}
          </button>
        </FormActions>
      }
    >
      <form
        id="confirm-schedule-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        <InputField
          label="Pickup date & time"
          field="scheduled_at"
          type="datetime-local"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      </form>
    </Modal>
  );
};

export { ConfirmScheduleModal };
