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
};

const listUsers = ({ page = 1, role }: ListUsersParams = {}): Promise<
  Paginated<UserListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (role) params.set('role', role);
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

const updateUser = (
  id: string,
  payload: Partial<
    Pick<UserDetail, 'full_name' | 'phone_number' | 'is_active'>
  >,
): Promise<UserDetail> =>
  apiFetch(`/accounts/users/${id}/`, { method: 'PATCH', json: payload });

const deleteUser = (id: string): Promise<void> =>
  apiFetch(`/accounts/users/${id}/`, { method: 'DELETE' });

export { createUser, deleteUser, listUsers, updateUser };
export type { CreateUserPayload, ListUsersParams, Paginated };
