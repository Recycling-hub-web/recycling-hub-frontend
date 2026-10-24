import { apiFetch, downloadFile } from '../../../../lib/api';
import type {
  CreateStaffPayload,
  StaffProfileDetail,
  UpdateStaffPayload,
} from '../types';

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

export { createStaff, deleteStaff, exportStaffReport, getStaff, updateStaff };
