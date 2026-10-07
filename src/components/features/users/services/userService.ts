import { apiFetch } from '../../../../lib/api';
import type {
  RegistrationStatus,
  UserDetail,
  UserListItem,
  UserRole,
} from '../../../../types/auth';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListUsersParams = {
  page?: number;
  role?: UserRole;
  /** Case-insensitive partial match against full_name or email — a real
   * backend query (see UserManagementView.get_queryset), not a client-side
   * filter, since results are paginated and a client-side filter would
   * silently miss matches sitting on other pages. */
  search?: string;
  /** Also a real backend query — see UserManagementView._registration_status_q,
   * which translates this into the same filter the (unstored,
   * derived-on-read) registration_status property would compute. */
  registrationStatus?: RegistrationStatus;
};

const listUsers = ({
  page = 1,
  role,
  search,
  registrationStatus,
}: ListUsersParams = {}): Promise<Paginated<UserListItem>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (role) params.set('role', role);
  if (search) params.set('search', search);
  if (registrationStatus) {
    params.set('registration_status', registrationStatus);
  }
  return apiFetch(`/accounts/users/?${params.toString()}`);
};

type CreateUserPayload = {
  full_name: string;
  email: string;
  phone_number?: string;
  role: UserRole;
  /** Staff/Driver/Receiving Officer/Accounting only. */
  department?: string;
  job_title?: string;
  branch?: string;
  joining_date?: string;
  profile_photo?: string | null;
  /** Driver only — where to send reimbursement (see FinanceRecord's
   * Verify & Reimburse, which refuses to complete without these on
   * file). Settable at creation only — there's no general driver-
   * profile edit surface yet, same gap as department/position/branch. */
  payout_method?: 'duitnow' | 'cash' | 'bank_transfer';
  payout_account_details?: string;
};

const createUser = (payload: CreateUserPayload): Promise<UserDetail> =>
  apiFetch('/accounts/users/', { method: 'POST', json: payload });

const getUser = (id: string): Promise<UserDetail> =>
  apiFetch(`/accounts/users/${id}/`);

// `email` and `role` are deliberately not editable here even though
// UserDetailSerializer accepts both on PATCH: role has no backend service
// migrating the role-specific profile model (StaffProfile/DriverProfile/…)
// when it changes — unlike creation, which goes through
// User.objects.create_staff/create_driver/etc. — so a PATCH-ed role change
// would leave a stale or missing profile row. Email is the login
// credential; changing it here would take effect with no re-verification
// step. Both need real backend work first, not a UI field that can quietly
// corrupt data in the meantime.
const updateUser = (
  id: string,
  payload: Partial<
    Pick<
      UserDetail,
      'full_name' | 'phone_number' | 'is_active' | 'is_2fa_enabled'
    >
  > & {
    // Write shape is the plain storage key, unlike UserDetail's own
    // `{file_key, public_url}` read shape — same split as
    // CreateStaffPayload/UpdateStaffPayload.
    profile_photo?: string | null;
  },
): Promise<UserDetail> =>
  apiFetch(`/accounts/users/${id}/`, { method: 'PATCH', json: payload });

const deleteUser = (id: string): Promise<void> =>
  apiFetch(`/accounts/users/${id}/`, { method: 'DELETE' });

// Admin-only on the backend (narrower than every other action here) and
// rate-limited per target user, independent of the 2FA OTP-resend
// throttle — see UserManagementView.resend_invite. A 429 means "wait and
// try again", a 409 means the verification-email cap (3) is reached and
// the account must be re-registered instead — both surface as
// ApiError.message like any other API error, no special handling needed
// here.
const resendInvite = (id: string): Promise<{ detail: string }> =>
  apiFetch(`/accounts/users/${id}/resend-invite/`, { method: 'POST' });

export { createUser, deleteUser, getUser, listUsers, resendInvite, updateUser };
export type { CreateUserPayload, ListUsersParams, Paginated };
