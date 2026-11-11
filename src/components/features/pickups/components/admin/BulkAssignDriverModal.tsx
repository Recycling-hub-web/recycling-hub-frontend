'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { ApiError } from '../../../../../lib/api';
import { InputField } from '../../../../form/fields/InputField';
import { SelectField } from '../../../../form/fields/SelectField';
import { ValidatedForm } from '../../../../form/ValidatedForm';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { FormActions } from '../../../../ui/buttons/FormActions';
import { Modal } from '../../../../ui/modal/Modal';
import { useBulkAssignDriver, useDrivers } from '../../hooks';

type BulkAssignDriverModalProps = {
  orderIds: string[];
  open: boolean;
  onClose: () => void;
  onAssigned: () => void;
};

type FormState = { driver: string; scheduled_at: string };

const INITIAL_STATE: FormState = { driver: '', scheduled_at: '' };

/** One driver (and an optional shared pickup time) assigned to several
 * selected orders at once — the bulk counterpart to AssignDriverModal,
 * for dispatching a driver's whole day from a pickup request's orders
 * table in one action. All-or-nothing on the backend: see
 * CollectionRequestViewSet.bulk_assign_driver. Only ever rendered with
 * orders that are already pending+approved — the table only lets those
 * be selected in the first place. */
const BulkAssignDriverModal = ({
  orderIds,
  open,
  onClose,
  onAssigned,
}: BulkAssignDriverModalProps) => {
  const { drivers, loading: loadingDrivers } = useDrivers(open);
  const { execute: bulkAssign, loading: submitting } = useBulkAssignDriver();
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
    const nextErrors: Record<string, string> = {};
    if (!formData.driver) nextErrors.driver = 'Choose a driver.';
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
      await bulkAssign({
        order_ids: orderIds,
        driver: formData.driver,
        scheduled_at: formData.scheduled_at
          ? new Date(formData.scheduled_at).toISOString()
          : undefined,
      });
      onAssigned();
      handleClose();
    } catch (err) {
      setApiError(
        err instanceof ApiError
          ? err.message
          : 'Could not assign these orders. Please try again.',
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Assign driver"
      subtitle={`Assign one driver to ${orderIds.length} selected order${orderIds.length === 1 ? '' : 's'}, with an optional shared confirmed pickup time.`}
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
            form="bulk-assign-driver-form"
            disabled={submitting}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? 'Assigning…'
              : `Assign ${orderIds.length} order${orderIds.length === 1 ? '' : 's'}`}
          </button>
        </FormActions>
      }
    >
      <ValidatedForm
        id="bulk-assign-driver-form"
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
          helperText="Optional. Applied to every selected order; the driver won't be asked to confirm it."
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
        />
      </ValidatedForm>
    </Modal>
  );
};

export { BulkAssignDriverModal };
