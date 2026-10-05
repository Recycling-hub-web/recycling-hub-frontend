'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { SelectField } from '../../../form/fields/SelectField';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Modal } from '../../../ui/modal/Modal';
import { useAssignDriver, useDrivers } from '../hooks';

type AssignDriverModalProps = {
  requestId: string;
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
};

type FormState = { driver: string };

const INITIAL_STATE: FormState = { driver: '' };

/** Assign a specific driver to a pending, approved request — a second,
 * independent way to reach `scheduled` alongside ScheduleModal (collector
 * + exact time). Only valid from `pending` + `evaluation_status=approved`
 * — see CollectionRequestDecisionService.assign_driver on the backend;
 * the caller only ever renders this when that's the case. No time field
 * (unlike scheduling) — a driver assignment is binding immediately, no
 * accept step, so there's nothing to schedule for in advance. */
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

  const validate = (): boolean => {
    if (!formData.driver) {
      setErrors({ driver: 'Choose a driver.' });
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
      await assignDriver(requestId, { driver: formData.driver });
      onAssigned();
      handleClose();
    } catch {
      setApiError(
        'Could not assign a driver to this pickup. Please try again.',
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign driver"
      subtitle="Assign this pickup directly to a driver."
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
            form="assign-driver-form"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Assigning…' : 'Assign'}
          </button>
        </div>
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
      </form>
    </Modal>
  );
};

export { AssignDriverModal };
