import { apiFetch } from '../../../../lib/api';
import type { CollectionPoint } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListCollectionPointsParams = {
  page?: number;
  /** DRF's SearchFilter — matches name, name_ar, point_uid, or city
   * (CollectionPointViewSet.search_fields). */
  search?: string;
};

// list/retrieve are AllowAny on the backend (the public "find a
// drop-off point" flow also reads this endpoint), but admin/staff get
// the same shape back either way — no separate admin serializer.
const listCollectionPoints = ({
  page = 1,
  search,
}: ListCollectionPointsParams = {}): Promise<Paginated<CollectionPoint>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set('search', search);
  return apiFetch(`/collection-points/?${params.toString()}`);
};

const getCollectionPoint = (id: string): Promise<CollectionPoint> =>
  apiFetch(`/collection-points/${id}/`);

type CollectionPointPayload = Partial<{
  name: string;
  name_ar: string;
  address: string;
  city: string;
  postcode: string;
  is_active: boolean;
}>;

const createCollectionPoint = (
  payload: CollectionPointPayload,
): Promise<CollectionPoint> =>
  apiFetch('/collection-points/', { method: 'POST', json: payload });

const updateCollectionPoint = (
  id: string,
  payload: CollectionPointPayload,
): Promise<CollectionPoint> =>
  apiFetch(`/collection-points/${id}/`, { method: 'PATCH', json: payload });

// Real hard delete on the backend (CollectionPointViewSet.perform_destroy
// just calls instance.delete(), no soft-delete) — nothing left behind
// to reactivate, unlike Categories.
const deleteCollectionPoint = (id: string): Promise<void> =>
  apiFetch(`/collection-points/${id}/`, { method: 'DELETE' });

export {
  createCollectionPoint,
  deleteCollectionPoint,
  getCollectionPoint,
  listCollectionPoints,
  updateCollectionPoint,
};
export type { CollectionPointPayload, ListCollectionPointsParams, Paginated };
