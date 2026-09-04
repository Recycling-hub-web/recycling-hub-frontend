'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { TextareaField } from '../../../form/fields/TextareaField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useCollectors, useSchedulePickup } from '../hooks';

type ScheduleModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onScheduled: () => void;
};

type FormState = {
  collector: string;
  scheduled_at: string;
  note: string;
};

const INITIAL_STATE: FormState = { collector: '', scheduled_at: '', note: '' };

/** Assign a collector + pickup time to a pending request. Only valid from
 * `pending` — see CollectionRequestDecisionService.schedule on the
 * backend; the caller only ever renders this when status is pending. */
const ScheduleModal = ({
  requestId,
  open,
  onClose,
  onScheduled,
}: ScheduleModalProps) => {
  const { collectors, loading: loadingCollectors } = useCollectors(open);
  const { execute: schedule, loading: submitting } = useSchedulePickup();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const collectorOptions = useMemo(
    () =>
      collectors.map((c) => ({
        value: c.id,
        label: `${c.user.full_name} — ${c.department || c.position || c.branch}`,
      })),
    [collectors],
  );

  // Validated on submit, not proactively — the submit button only
  // disables while the request is actually in flight; missing/invalid
  // fields surface as inline errors once someone tries to submit.
  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.collector) nextErrors.collector = 'Choose a collector.';
    if (!formData.scheduled_at) {
      nextErrors.scheduled_at = 'Pick a pickup date and time.';
    } else if (new Date(formData.scheduled_at).getTime() < Date.now()) {
      nextErrors.scheduled_at = 'Pickup time must be in the future.';
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
      await schedule(requestId, {
        collector: formData.collector,
        scheduled_at: new Date(formData.scheduled_at).toISOString(),
        note: formData.note || undefined,
      });
      onScheduled();
      handleClose();
    } catch {
      setApiError('Could not schedule this pickup. Please try again.');
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Schedule pickup"
      subtitle="Assign a collector and pickup time."
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
            form="schedule-pickup-form"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Scheduling…' : 'Schedule'}
          </button>
        </div>
      }
    >
      <form
        id="schedule-pickup-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        <SelectField
          label="Collector"
          field="collector"
          options={collectorOptions}
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
          disabled={loadingCollectors}
        />
        <InputField
          label="Pickup date & time"
          field="scheduled_at"
          type="datetime-local"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
        <TextareaField
          label="Note"
          field="note"
          required={false}
          placeholder="Optional — visible to the collector."
          formData={formData}
          updateFormData={updateFormData}
        />
      </form>
    </Modal>
  );
};

export { ScheduleModal };
