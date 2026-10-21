import { apiFetch } from '../../../../lib/api';
import type { Ownership, Vehicle, VehicleType } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// Unlike categoryService.ts, VehicleViewSet.get_queryset has no
// `?search=`/`?is_active=` query-param support — admin/staff just get
// every vehicle, active or not, straight off `.all()` — so this stays
// to plain pagination only. `pageSize` still works: pagination is the
// project-wide DefaultPagination (page_size_query_param="page_size",
// max 200).
type ListVehiclesParams = {
  page?: number;
  pageSize?: number;
};

const listVehicles = ({ page = 1, pageSize }: ListVehiclesParams = {}): Promise<
  Paginated<Vehicle>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (pageSize) params.set('page_size', String(pageSize));
  return apiFetch(`/claims/vehicles/?${params.toString()}`);
};

const getVehicle = (id: string): Promise<Vehicle> =>
  apiFetch(`/claims/vehicles/${id}/`);

type VehiclePayload = {
  plate_number: string;
  vehicle_type: VehicleType;
  ownership: Ownership;
  assigned_driver?: string | null;
  has_fleet_card?: boolean;
  is_active?: boolean;
};

const createVehicle = (payload: VehiclePayload): Promise<Vehicle> =>
  apiFetch('/claims/vehicles/', { method: 'POST', json: payload });

type UpdateVehiclePayload = Partial<VehiclePayload>;

const updateVehicle = (
  id: string,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> =>
  apiFetch(`/claims/vehicles/${id}/`, { method: 'PATCH', json: payload });

// Real hard delete on the backend (VehicleViewSet.perform_destroy calls
// instance.delete(), no soft-delete override) — unlike categoryService's
// deleteCategory, this actually removes the row.
const deleteVehicle = (id: string): Promise<void> =>
  apiFetch(`/claims/vehicles/${id}/`, { method: 'DELETE' });

export {
  createVehicle,
  deleteVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
};
export type {
  ListVehiclesParams,
  Paginated,
  UpdateVehiclePayload,
  VehiclePayload,
};
