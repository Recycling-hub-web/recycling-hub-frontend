import { apiFetch } from '../../../../lib/api';
import type { Classification, ClassificationListItem } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListClassificationsParams = {
  page?: number;
  /** DRF's SearchFilter — matches name (ClassificationView.search_fields,
   * added alongside this feature; the endpoint previously had no
   * server-side search at all). */
  search?: string;
};

const listClassifications = ({
  page = 1,
  search,
}: ListClassificationsParams = {}): Promise<
  Paginated<ClassificationListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set('search', search);
  return apiFetch(`/accounts/classifications/?${params.toString()}`);
};

const getClassification = (id: string): Promise<Classification> =>
  apiFetch(`/accounts/classifications/${id}/`);

type CreateClassificationPayload = {
  name: string;
  description?: string;
};

// `assigned_by` is set server-side from the requesting user
// (ClassificationView.perform_create) — never part of the payload.
const createClassification = (
  payload: CreateClassificationPayload,
): Promise<Classification> =>
  apiFetch('/accounts/classifications/', { method: 'POST', json: payload });

type UpdateClassificationPayload = Partial<{
  name: string;
  description: string;
}>;

const updateClassification = (
  id: string,
  payload: UpdateClassificationPayload,
): Promise<Classification> =>
  apiFetch(`/accounts/classifications/${id}/`, {
    method: 'PATCH',
    json: payload,
  });

// Real hard delete on the backend (default ModelViewSet.destroy, not
// overridden like Categories' soft-delete) — nothing left behind to
// reactivate.
const deleteClassification = (id: string): Promise<void> =>
  apiFetch(`/accounts/classifications/${id}/`, { method: 'DELETE' });

export {
  createClassification,
  deleteClassification,
  getClassification,
  listClassifications,
  updateClassification,
};
export type {
  CreateClassificationPayload,
  ListClassificationsParams,
  Paginated,
  UpdateClassificationPayload,
};
