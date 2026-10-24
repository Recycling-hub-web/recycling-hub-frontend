// Mirrors apps.accounts.models.user.User.Role on the backend. No
// resident/end-user role — these six are the complete set. Super Admin
// is deliberately separate from Django's own is_superuser/is_staff
// flags on the backend; nothing on the frontend should ever infer
// "super admin" from anything but this literal role value.
type UserRole =
  | 'super_admin'
  | 'admin'
  | 'staff'
  | 'driver'
  | 'receiving_officer'
  | 'accounting';

// The Admin permission bundle — every check that passes for Admin must
// also pass for Super Admin (see User.is_admin on the backend, the ONE
// place this is granted there). Use this instead of comparing `role`
// to the literal string 'admin' anywhere a Super Admin should also
// pass — a check written that way silently excludes Super Admins.
const isAdminRole = (role: UserRole | undefined): boolean =>
  role === 'admin' || role === 'super_admin';

// Mirrors User.registration_status (a derived backend property, not a
// stored field) — whether the account has completed its set-password
// link. "expired" means every allowed verification email has been sent
// and the last one lapsed unused; the only way forward from there is to
// delete and recreate the account, not another resend.
type RegistrationStatus = 'verified' | 'pending' | 'expired';

// Shape shared by StaffProfile/DriverProfile/ReceivingOfficerProfile/
// AccountingProfile — see apps.accounts.serializers.staff.StaffDetailSerializer
// and its siblings on the backend.
type EmployeeProfile = {
  id: string;
  employee_id: string;
  department: string | null;
  department_ar: string | null;
  position: string | null;
  position_ar: string | null;
  branch: string | null;
  branch_ar: string | null;
  joining_date: string | null;
  created_at: string;
  updated_at: string;
};

// Response shape of GET/PATCH /accounts/me/ — the `profile` key is only
// present for roles with an extended profile (Staff/Driver/Receiving
// Officer/Accounting); Admin has none.
//
// `profile_photo` (here and on UserListItem/UserDetail below) is
// StorageFileField's actual read shape (apps.storage.serializers —
// `{"file_key": ..., "public_url": ...}`, confirmed by reading the field
// itself) — this previously said `url`, which the backend has never
// once returned, so Sidebar.tsx's own avatar image silently never
// rendered a real uploaded photo. Found and fixed alongside the Staff
// Management feature, which depends on this field round-tripping
// correctly.
type CurrentUser = {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string;
  phone_number: string | null;
  whatsapp_enabled: boolean;
  role: UserRole;
  is_2fa_enabled: boolean;
  profile_photo: { file_key: string; public_url?: string } | null;
  profile?: EmployeeProfile;
};

// Row shape from GET /accounts/users/ (UserListSerializer).
type UserListItem = {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string;
  role: UserRole;
  is_active: boolean;
  profile_photo: { file_key: string; public_url?: string } | null;
  registration_status: RegistrationStatus;
  verification_emails_sent: number;
};

// Row shape from GET/PATCH /accounts/users/<id>/ (UserDetailSerializer).
type UserDetail = {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string;
  phone_number: string | null;
  role: UserRole;
  is_active: boolean;
  is_2fa_enabled: boolean;
  is_2fa_verified: boolean;
  profile_photo: { file_key: string; public_url?: string } | null;
  password_reset_required: boolean;
  registration_status: RegistrationStatus;
  verification_emails_remaining: number;
  created_at: string;
  updated_at: string;
};

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  staff: 'Staff',
  driver: 'Driver',
  receiving_officer: 'Receiving Officer',
  accounting: 'Accounting',
};

// Where each role lands after login / on a role-mismatch bounce-back. Every
// role gets its own dedicated layout+sidebar now
// (src/layouts/OperationalLayout.tsx) instead of the old shared /dashboard,
// which stays alive only as a stable fallback for stale bookmarks/links
// (see DashboardRedirectView) — not tied to any particular role.
//
// Super Admin has its OWN section (/super-admin, SuperAdminLayout) —
// separate from Admin's /admin, not a shared landing page. Super Admin
// still reaches every /admin/* page too (middleware.ts's
// ROUTE_ROLES['/admin'] allows both roles), via a link out from its own
// sidebar, same as any other cross-section navigation.
const ROLE_HOME: Record<UserRole, string> = {
  super_admin: '/super-admin',
  admin: '/admin',
  staff: '/staff',
  driver: '/driver',
  receiving_officer: '/receiving',
  accounting: '/accounting',
};

export { isAdminRole, ROLE_HOME, ROLE_LABELS };
export type {
  CurrentUser,
  EmployeeProfile,
  RegistrationStatus,
  UserDetail,
  UserListItem,
  UserRole,
};
