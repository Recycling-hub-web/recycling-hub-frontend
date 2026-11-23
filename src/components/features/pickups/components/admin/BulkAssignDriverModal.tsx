'use client';

import { type FormEvent, useMemo, useState } from 'react';

import { usePortalLocale } from '../../../../../contexts/PortalLocaleContext';
import { ApiError } from '../../../../../lib/api';
import { localizeErrors } from '../../../../../lib/localizeErrors';
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

type FormState = { driver: string };

const INITIAL_STATE: FormState = { driver: '' };

/** One driver assigned to several
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
  const { t } = usePortalLocale();
  const {
    drivers,
    loading: loadingDrivers,
    error: driversError,
    refetch: retryDrivers,
  } = useDrivers(open);
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
        // The work detail is optional; leave it off instead of showing "null".
        label: [d.user.full_name, d.department || d.position || d.branch]
          .filter(Boolean)
          .join(' — '),
      })),
    [drivers],
  );

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!formData.driver) nextErrors.driver = 'Choose a driver.';
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
    if (submitting || !validate()) return;
    try {
      await bulkAssign({
        order_ids: orderIds,
        driver: formData.driver,
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
      dismissible={!submitting}
      title={t('Assign driver')}
      subtitle={t(
        'Assign one driver to {value0} selected order{value1}. The driver will confirm pickup times.',
        { value0: orderIds.length, value1: orderIds.length === 1 ? '' : 's' },
      )}
      footer={
        <FormActions>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('Cancel')}
          </button>
          <button
            type="submit"
            form="bulk-assign-driver-form"
            disabled={submitting}
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? t('Assigning…')
              : t('Assign {value0} order{value1}', {
                  value0: orderIds.length,
                  value1: orderIds.length === 1 ? '' : 's',
                })}
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
        <AlertBanner message={t(apiError ?? '')} />
        {driversError && (
          <div className="mb-4">
            <AlertBanner message={t(driversError)} />
            <button
              type="button"
              onClick={retryDrivers}
              className="min-h-11 rounded px-3 text-sm font-semibold text-brand-800 underline"
            >
              {t('Retry drivers')}
            </button>
          </div>
        )}
        <SelectField
          label={t('Driver')}
          field="driver"
          options={driverOptions}
          formData={formData}
          errors={localizeErrors(errors, t)}
          updateFormData={updateFormData}
          disabled={loadingDrivers || submitting || Boolean(driversError)}
        />
      </ValidatedForm>
    </Modal>
  );
};

export { BulkAssignDriverModal };
