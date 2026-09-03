import { apiFetch } from '../../../../lib/api';
import type {
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
};

const listUsers = ({ page = 1, role, search }: ListUsersParams = {}): Promise<
  Paginated<UserListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (role) params.set('role', role);
  if (search) params.set('search', search);
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
  >,
): Promise<UserDetail> =>
  apiFetch(`/accounts/users/${id}/`, { method: 'PATCH', json: payload });

const deleteUser = (id: string): Promise<void> =>
  apiFetch(`/accounts/users/${id}/`, { method: 'DELETE' });

export { createUser, deleteUser, getUser, listUsers, updateUser };
export type { CreateUserPayload, ListUsersParams, Paginated };
