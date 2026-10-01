import {
  type RegistrationStatus,
  ROLE_LABELS,
  type UserRole,
} from '../../../types/auth';
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
};

// The complete role set (see apps.accounts.models.user.User.Role on the
// backend) — no resident/end-user role to exclude here anymore.
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

const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  expired: 'Expired',
};

const REGISTRATION_STATUS_BADGE_VARIANT: Record<
  RegistrationStatus,
  BadgeVariant
> = {
  verified: 'success',
  pending: 'warning',
  expired: 'danger',
};

// Mirrors settings.MAX_VERIFICATION_EMAILS on the backend — the cap
// send_password_reset_email enforces (VerificationLimitReached) once
// verification_emails_sent reaches this. No API field carries the limit
// itself today, only the running count, so this is a plain mirrored
// constant — same pattern as VerifyOtpView's RESEND_COOLDOWN_SECONDS.
const MAX_VERIFICATION_EMAILS = 3;

const REGISTRATION_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(REGISTRATION_STATUS_LABELS) as RegistrationStatus[]).map(
    (value) => ({ value, label: REGISTRATION_STATUS_LABELS[value] }),
  ),
];

export {
  CREATABLE_ROLES,
  MAX_VERIFICATION_EMAILS,
  REGISTRATION_STATUS_BADGE_VARIANT,
  REGISTRATION_STATUS_FILTER_OPTIONS,
  REGISTRATION_STATUS_LABELS,
  ROLE_BADGE_VARIANT,
  ROLE_FILTER_OPTIONS,
  ROLE_OPTIONS,
  ROLES_WITH_PROFILE,
};
