'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { LuArrowLeft } from 'react-icons/lu';

import { InputField } from '../../../form/fields/InputField';
import { SelectField } from '../../../form/fields/SelectField';
import { SettingToggleInput } from '../../../form/toggle/SettingToggleInput';
import { PageContainer } from '../../../layout/PageContainer';
import { AlertBanner } from '../../../ui/AlertBanner';
import { Button } from '../../../ui/buttons/Button';
import { FormActions } from '../../../ui/buttons/FormActions';
import { Card } from '../../../ui/card/Card';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
// Reuses Pickups' driver picker wholesale (same GET /accounts/drivers/
// call the assign-driver modal already uses) rather than a new
// driver-listing service in this feature — see useDrivers' own doc
// comment. Deliberately NOT filtering out drivers who already have a
// vehicle: the backend's OneToOneField already rejects a duplicate
// assignment with a clear `assigned_driver` error, surfaced below as-is
// (see the ask: keep this simple, don't build that client-side).
import { useDrivers } from '../../pickups/hooks';
import {
  NONE_DRIVER,
  OWNERSHIP_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
} from '../constants';
import { useCreateVehicle } from '../hooks';
import type { Ownership, VehicleType } from '../types';

type FormState = {
  plate_number: string;
  vehicle_type: string;
  ownership: string;
  assigned_driver: string;
  has_fleet_card: boolean;
  is_active: boolean;
};

const INITIAL_STATE: FormState = {
  plate_number: '',
  vehicle_type: '',
  ownership: '',
  assigned_driver: NONE_DRIVER,
  has_fleet_card: false,
  is_active: true,
};

type CreateVehicleViewProps = {
  basePath: '/admin/vehicles' | '/staff/vehicles';
};

// Full page, not a modal — same footing as CreateCategoryView, since a
// vehicle is a standalone record with its own detail page to land on
// afterwards, not a quick inline add.
const CreateVehicleView = ({ basePath }: CreateVehicleViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const {
    execute: createVehicle,
    loading: submitting,
    error,
  } = useCreateVehicle();
  const { drivers, loading: loadingDrivers } = useDrivers(true);
  const [formData, setFormData] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    // Validation error: stay on this page, keep entered values, show
    // inline errors — never navigate away.
    if (!validate(formData)) return;

    try {
      const vehicle = await createVehicle({
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
      toast.success(
        'Vehicle created',
        `${formData.plate_number} has been added.`,
      );
      router.push(`${basePath}/${vehicle.id}`);
    } catch {
      // useCreateVehicle already captured the message in `error`, shown
      // below — this is also where the backend's duplicate-driver 400
      // ("vehicle with this assigned driver already exists") surfaces,
      // generically, via ApiError's extractErrorMessage.
    }
  };

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to vehicles
      </Link>

      <PageHeader
        title="New vehicle"
        subtitle="Register a fleet vehicle drivers can claim petrol expenses against."
      />

      <Card className="p-5">
        <form onSubmit={handleSubmit}>
          <AlertBanner message={error} />

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
            <Button href={basePath} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create vehicle'}
            </Button>
          </FormActions>
        </form>
      </Card>
    </PageContainer>
  );
};

export { CreateVehicleView };
