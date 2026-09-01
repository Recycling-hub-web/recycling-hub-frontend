import { ROLE_LABELS, type UserRole } from '../../../types/auth';
import type { BadgeVariant } from '../../ui/badges/variants';

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'All roles' },
  ...(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
  })),
];

const ROLE_BADGE_VARIANT: Record<UserRole, BadgeVariant> = {
  admin: 'danger',
  staff: 'info',
  driver: 'success',
  receiving_officer: 'warning',
  accounting: 'attention',
  resident: 'neutral',
};

// Residents have no accounts for MVP (pickups are public/anonymous) — see
// apps.accounts.models.user.User.Role on the backend — so they're not a
// creatable role here.
const CREATABLE_ROLES: UserRole[] = [
  'admin',
  'staff',
  'driver',
  'receiving_officer',
  'accounting',
];

const ROLE_OPTIONS = CREATABLE_ROLES.map((r) => ({
  value: r,
  label: ROLE_LABELS[r],
}));

// These roles get a Staff/Driver/Receiving-Officer/Accounting-style
// employment profile (department/position/branch/joining date); Admin
// does not.
const ROLES_WITH_PROFILE: UserRole[] = [
  'staff',
  'driver',
  'receiving_officer',
  'accounting',
];

export {
  CREATABLE_ROLES,
  ROLE_BADGE_VARIANT,
  ROLE_FILTER_OPTIONS,
  ROLE_OPTIONS,
  ROLES_WITH_PROFILE,
};
