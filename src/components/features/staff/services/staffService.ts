import { apiFetch, downloadFile } from '../../../../lib/api';
import type {
  CreateStaffPayload,
  StaffListItem,
  StaffProfileDetail,
  UpdateStaffPayload,
} from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// No `?search=`/`?page_size=` support on this endpoint — confirmed by
// reading StaffManagementView directly, no filter_backends/search_fields
// at all, unlike userService's listUsers.
const listStaff = (page = 1): Promise<Paginated<StaffListItem>> =>
  apiFetch(`/accounts/staff/?page=${page}`);

const getStaff = (id: string): Promise<StaffProfileDetail> =>
  apiFetch(`/accounts/staff/${id}/`);

const createStaff = (
  payload: CreateStaffPayload,
): Promise<StaffProfileDetail> =>
  apiFetch('/accounts/staff/', { method: 'POST', json: payload });

const updateStaff = (
  id: string,
  payload: UpdateStaffPayload,
): Promise<StaffProfileDetail> =>
  apiFetch(`/accounts/staff/${id}/`, { method: 'PATCH', json: payload });

// Real hard delete — StaffManagementView.destroy is a plain ModelViewSet
// destroy, no soft-delete override. The linked User account survives
// (per the endpoint's own docstring); only the StaffProfile row goes.
const deleteStaff = (id: string): Promise<void> =>
  apiFetch(`/accounts/staff/${id}/`, { method: 'DELETE' });

const exportStaffReport = (): Promise<void> =>
  downloadFile('/accounts/staff/export/', 'staff_report.xlsx');

export {
  createStaff,
  deleteStaff,
  exportStaffReport,
  getStaff,
  listStaff,
  updateStaff,
};
export type { Paginated };
