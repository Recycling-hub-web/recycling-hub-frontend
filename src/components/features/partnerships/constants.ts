import type { BadgeVariant } from '../../ui/badges/variants';
import type { PartnershipType } from './types';

const PARTNERSHIP_TYPE_LABELS: Record<PartnershipType, string> = {
  strategic: 'Strategic',
  sponsor: 'Sponsor',
  corporate: 'Corporate',
  government: 'Government',
  ngo: 'NGO',
  academic: 'Academic',
  community: 'Community',
};

const PARTNERSHIP_TYPE_OPTIONS = (
  Object.keys(PARTNERSHIP_TYPE_LABELS) as PartnershipType[]
).map((type) => ({ value: type, label: PARTNERSHIP_TYPE_LABELS[type] }));

const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All types' },
  ...PARTNERSHIP_TYPE_OPTIONS,
];

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
// inactive partner," since there's no separate restore action (same
// pattern as Categories).
const STATUS_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

export {
  PARTNERSHIP_TYPE_LABELS,
  PARTNERSHIP_TYPE_OPTIONS,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
  STATUS_OPTIONS,
  TYPE_FILTER_OPTIONS,
};
