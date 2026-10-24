import type { BadgeVariant } from '../../ui/badges/variants';
import type { Ownership, VehicleType } from './types';

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Car',
  motorbike: 'Motorbike',
  van: 'Van',
};

const OWNERSHIP_LABELS: Record<Ownership, string> = {
  company: 'Company',
  personal: 'Personal',
};

const VEHICLE_TYPE_OPTIONS = [
  { value: 'car', label: 'Car' },
  { value: 'motorbike', label: 'Motorbike' },
  { value: 'van', label: 'Van' },
];

const OWNERSHIP_OPTIONS = [
  { value: 'company', label: 'Company' },
  { value: 'personal', label: 'Personal' },
];

// SelectField always renders its own disabled `<option value="">Select
// ...</option>` placeholder ahead of whatever options are passed in — so
// an actual "no driver assigned" choice can't use `value: ''` too, or the
// browser shows the disabled placeholder instead of it (both share the
// empty value; the disabled one comes first in the DOM). Same gotcha as
// categories/constants.ts's NONE_PARENT; a non-empty sentinel avoids it.
const NONE_DRIVER = 'none' as const;

const STATUS_BADGE_VARIANT: Record<'active' | 'inactive', BadgeVariant> = {
  active: 'success',
  inactive: 'neutral',
};

export {
  NONE_DRIVER,
  OWNERSHIP_LABELS,
  OWNERSHIP_OPTIONS,
  STATUS_BADGE_VARIANT,
  VEHICLE_TYPE_LABELS,
  VEHICLE_TYPE_OPTIONS,
};
