'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { InputField } from '../../../../form/fields/InputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useAssignDriver, useDrivers } from '../../hooks';

type AssignDriverModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
};

type FormState = { driver: string; scheduled_at: string };

const INITIAL_STATE: FormState = { driver: '', scheduled_at: '' };

/** Schedule a pending, approved request by assigning it to a driver —
 * the only way to schedule a pickup from the UI (ScheduleModal's staff
 * collector + exact time still exists on the backend, but is no longer
 * surfaced here). Only valid from `pending` + `evaluation_status=approved`
 * — see CollectionRequestDecisionService.assign_driver on the backend;
 * the caller only ever renders this when that's the case. */
const AssignDriverModal = ({
  requestId,
  open,
  onClose,
  onAssigned,
}: AssignDriverModalProps) => {
  const { drivers, loading: loadingDrivers } = useDrivers(open);
  const { execute: assignDriver, loading: submitting } = useAssignDriver();
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const driverOptions = useMemo(
    () =>
      drivers.map((d) => ({
        value: d.id,
        label: `${d.user.full_name} — ${d.department || d.position || d.branch}`,
      })),
    [drivers],
  );

  // Validated on submit, not proactively — the submit button only
  // disables while the request is actually in flight; missing/invalid
  // fields surface as inline errors once someone tries to submit.
  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.driver) nextErrors.driver = 'Choose a driver.';
    // Optional. When given, it's the time agreed with the customer and
    // counts as confirmed — the driver isn't asked to confirm it again.
    if (
      formData.scheduled_at &&
      new Date(formData.scheduled_at).getTime() < Date.now()
    ) {
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
      await assignDriver(requestId, {
        driver: formData.driver,
        scheduled_at: formData.scheduled_at
          ? new Date(formData.scheduled_at).toISOString()
          : undefined,
      });
      onAssigned();
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
      subtitle="Assign a driver, with an optional confirmed pickup date and time."
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
            form="assign-driver-form"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Scheduling…' : 'Schedule'}
          </button>
        </FormActions>
      }
    >
      <form
        id="assign-driver-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-1"
      >
        <AlertBanner message={apiError} />
        <SelectField
          label="Driver"
          field="driver"
          options={driverOptions}
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
          disabled={loadingDrivers}
        />
        <InputField
          label="Confirmed pickup date & time"
          field="scheduled_at"
          type="datetime-local"
          required={false}
          helperText="Optional. If set, the driver won't be asked to confirm the time."
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      </form>
    </Modal>
  );
};

export { AssignDriverModal };
