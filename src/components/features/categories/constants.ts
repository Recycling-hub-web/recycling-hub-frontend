import type { BadgeVariant } from '../../ui/badges/variants';

// This whole feature only ever manages the `materials` slice of the
// backend's generic Category model — every service call hardcodes this,
// no component ever exposes `module` as a field.
const MODULE = 'materials' as const;

// SelectField always renders its own disabled `<option value="">Select
// ...</option>` placeholder ahead of whatever options are passed in —
// so an actual "no parent" choice can't use `value: ''` too, or the
// browser shows the disabled placeholder instead of it (both share the
// empty value; the disabled one comes first in the DOM). A non-empty
// sentinel avoids the collision.
const NONE_PARENT = 'none' as const;

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

const STATUS_BADGE_VARIANT: Record<'active' | 'inactive', BadgeVariant> = {
  active: 'success',
  inactive: 'neutral',
};

// Used by the edit form's Status field — doubles as "reactivate an
// inactive category," since there's no separate restore action.
const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export {
  MODULE,
  NONE_PARENT,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
  STATUS_OPTIONS,
};
