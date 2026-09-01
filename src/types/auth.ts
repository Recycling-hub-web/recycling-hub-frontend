// Mirrors apps.accounts.models.user.User.Role on the backend.
type UserRole =
  | 'admin'
  | 'staff'
  | 'driver'
  | 'receiving_officer'
  | 'accounting'
  | 'resident';

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
// Officer/Accounting); Admin and Resident have none.
type CurrentUser = {
  id: string;
  email: string;
  full_name: string;
  full_name_ar: string;
  phone_number: string | null;
  whatsapp_enabled: boolean;
  role: UserRole;
  is_2fa_enabled: boolean;
  profile_photo: { file_key: string; url?: string } | null;
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
  profile_photo: { file_key: string; url?: string } | null;
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
  profile_photo: { file_key: string; url?: string } | null;
  password_reset_required: boolean;
  created_at: string;
  updated_at: string;
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  staff: 'Staff',
  driver: 'Driver',
  receiving_officer: 'Receiving Officer',
  accounting: 'Accounting',
  resident: 'Resident',
};

export { ROLE_LABELS };
export type {
  CurrentUser,
  EmployeeProfile,
  UserDetail,
  UserListItem,
  UserRole,
};
