'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { ApiError } from '../../../../lib/api';
import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { SettingToggleInput } from '../../../form/toggle/SettingToggleInput';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Card } from '../../../ui/card/Card';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
// Same cross-feature reuse as CreateVehicleView — see its doc comment.
import { useDrivers } from '../../pickups/hooks';
import {
  NONE_DRIVER,
  OWNERSHIP_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
} from '../constants';
import { useUpdateVehicle, useVehicle } from '../hooks';
import type { Ownership, VehicleType } from '../types';

type FormState = {
  plate_number: string;
  vehicle_type: string;
  ownership: string;
  assigned_driver: string;
  has_fleet_card: boolean;
  is_active: boolean;
};

type EditVehicleViewProps = {
  vehicleId: string;
  basePath: '/admin/vehicles' | '/staff/vehicles';
};

const EditVehicleView = ({ vehicleId, basePath }: EditVehicleViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    vehicle,
    loading: loadingVehicle,
    error: loadError,
  } = useVehicle(vehicleId);
  const { execute: updateVehicle, loading: submitting } = useUpdateVehicle();
  const { drivers, loading: loadingDrivers } = useDrivers(true);
  const [formData, setFormData] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!vehicle) return;
    setFormData({
      plate_number: vehicle.plate_number,
      vehicle_type: vehicle.vehicle_type,
      ownership: vehicle.ownership,
      assigned_driver: vehicle.assigned_driver ?? NONE_DRIVER,
      has_fleet_card: vehicle.has_fleet_card,
      is_active: vehicle.is_active,
    });
  }, [vehicle]);

  const driverOptions = useMemo(
    () => [
      { value: NONE_DRIVER, label: 'Unassigned' },
      ...drivers.map((d) => ({
        value: d.id,
        label: `${d.user.full_name} — ${d.employee_id}`,
      })),
    ],
    [drivers],
  );

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (data: FormState): boolean => {
    const nextErrors: Record<string, string> = {};
    if (!data.plate_number.trim())
      nextErrors.plate_number = 'Plate number is required.';
    if (!data.vehicle_type) nextErrors.vehicle_type = 'Choose a vehicle type.';
    if (!data.ownership) nextErrors.ownership = 'Choose an ownership type.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData || !vehicle) return;
    setApiError('');
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      await updateVehicle(vehicle.id, {
        plate_number: formData.plate_number.trim(),
        vehicle_type: formData.vehicle_type as VehicleType,
        ownership: formData.ownership as Ownership,
        assigned_driver:
          formData.assigned_driver === NONE_DRIVER
            ? null
            : formData.assigned_driver,
        has_fleet_card: formData.has_fleet_card,
        is_active: formData.is_active,
      });
      toast.success('Vehicle updated');
      router.push(`${basePath}/${vehicle.id}`);
    } catch (err) {
      setApiError(
        err instanceof ApiError ? err.message : 'Could not save this vehicle.',
      );
    }
  };

  if (loadingVehicle) return <Loading text="Loading vehicle…" />;

  if (loadError || !vehicle || !formData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {loadError || 'Vehicle not found.'}
      </div>
    );
  }

  // `vehicle` is the snapshot useVehicle loaded — this component never
  // refetches it mid-edit, so comparing formData against it directly is a
  // safe, real dirty-check, not just a first-render diff.
  const hasChanges =
    formData.plate_number !== vehicle.plate_number ||
    formData.vehicle_type !== vehicle.vehicle_type ||
    formData.ownership !== vehicle.ownership ||
    formData.assigned_driver !== (vehicle.assigned_driver ?? NONE_DRIVER) ||
    formData.has_fleet_card !== vehicle.has_fleet_card ||
    formData.is_active !== vehicle.is_active;

  return (
    <PageContainer variant="form">
      <Link
        href={`${basePath}/${vehicle.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to vehicle
      </Link>

      <PageHeader title="Edit vehicle" subtitle={vehicle.plate_number} />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={apiError} />

          <div className="grid gap-x-4 sm:grid-cols-2">
            <InputField
              label="Plate number"
              field="plate_number"
              placeholder="e.g. WXY 1234"
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Vehicle type"
              field="vehicle_type"
              options={VEHICLE_TYPE_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Ownership"
              field="ownership"
              options={OWNERSHIP_OPTIONS}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting}
            />
            <SelectField
              label="Assigned driver"
              field="assigned_driver"
              required={false}
              options={driverOptions}
              formData={formData}
              errors={errors}
              updateFormData={updateFormData}
              disabled={submitting || loadingDrivers}
            />
          </div>

          <SettingToggleInput
            label="Fleet card"
            field="has_fleet_card"
            formData={formData}
            updateFormData={updateFormData}
            enabledText="Has a fleet card"
            disabledText="No fleet card"
            enabledDescription="Fuel receipts aren't required on claims for this vehicle"
            disabledDescription="Click to mark this vehicle as having a fleet card"
          />
          <SettingToggleInput
            label="Status"
            field="is_active"
            formData={formData}
            updateFormData={updateFormData}
            enabledText="Active"
            disabledText="Inactive"
            enabledDescription="Can be assigned to drivers and claimed against"
            disabledDescription="Click to activate this vehicle"
          />

          <FormActions className="pt-2">
            <Button href={`${basePath}/${vehicle.id}`} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !hasChanges}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { EditVehicleView };
