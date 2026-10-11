import {
  type RegistrationStatus,
  ROLE_LABELS,
  type UserRole,
} from '../../../types/auth';
import type { BadgeVariant } from '../../ui/badges/variants';

const ALL_ROLES: UserRole[] = [
  'super_admin',
  'admin',
  'staff',
  'driver',
  'receiving_officer',
  'accounting',
];

// Roles below Admin that stay deprioritized for everyone — `accounting`
// (Staff already covers those duties, see the Create User/role-filter
// history) stays out of both browsing and creation regardless of who's
// looking, Super Admin included; Super Admin can still see Super
// Admin/Admin accounts a plain Admin can't (the backend's own
// visible_to() already enforces the real boundary — this only keeps
// the UI from offering an option that would just come back empty or
// 404).
const roleFilterOptionsFor = (actorRole: UserRole | undefined) => {
  const roles = ALL_ROLES.filter((role) => {
    if (role === 'accounting') return false;
    if (role === 'super_admin') return actorRole === 'super_admin';
    return true;
  });
  return [
    { value: '', label: 'All roles' },
    ...roles.map((role) => ({ value: role, label: ROLE_LABELS[role] })),
  ];
};

const ROLE_BADGE_VARIANT: Record<UserRole, BadgeVariant> = {
  super_admin: 'danger',
  admin: 'danger',
  staff: 'info',
  driver: 'success',
  receiving_officer: 'warning',
  accounting: 'attention',
};

// The role set offered when creating a new user — a function of who's
// creating it, not a flat list (see apps.accounts.services.
// assert_can_assign_role on the backend, the real enforcement this
// mirrors). Super Admin can create any of the six; everyone else who
// can reach this screen at all (Admin/Staff) is limited to the four
// roles below Admin — an Admin can no longer create another Admin,
// and `accounting` stays deprioritized the same as the role filter
// above.
const creatableRolesFor = (actorRole: UserRole | undefined): UserRole[] =>
  actorRole === 'super_admin'
    ? ALL_ROLES
    : ['staff', 'driver', 'receiving_officer'];

// `roleLimits` is `{ role: { used, limit } }` for just the two limited
// roles (admin, super_admin) — pass it to grey out + explain an option
// whose limit is already full, instead of letting the submit fail (see
// useRoleLimits). Omit it (or a role's entry) when limits don't apply
// or haven't loaded yet.
const roleOptionsFor = (
  actorRole: UserRole | undefined,
  roleLimits?: Partial<Record<UserRole, { used: number; limit: number }>>,
) =>
  creatableRolesFor(actorRole).map((role) => {
    const usage = roleLimits?.[role];
    const full = usage !== undefined && usage.used >= usage.limit;
    return {
      value: role,
      label: ROLE_LABELS[role],
      disabled: full,
      title: full
        ? `${ROLE_LABELS[role]} limit reached — ${usage!.used} of ${usage!.limit} in use.`
        : undefined,
    };
  });

// These roles get a Staff/Driver/Receiving-Officer/Accounting-style
// employment profile (department/position/branch/joining date); Admin
// and Super Admin do not.
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
  ALL_ROLES,
  creatableRolesFor,
  MAX_VERIFICATION_EMAILS,
  REGISTRATION_STATUS_BADGE_VARIANT,
  REGISTRATION_STATUS_FILTER_OPTIONS,
  REGISTRATION_STATUS_LABELS,
  ROLE_BADGE_VARIANT,
  roleFilterOptionsFor,
  roleOptionsFor,
  ROLES_WITH_PROFILE,
};
