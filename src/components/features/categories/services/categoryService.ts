import { apiFetch } from '../../../../lib/api';
import { MODULE } from '../constants';
import type { Category, CategoryListItem } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListCategoriesParams = {
  page?: number;
  /** `?is_active=` on the backend — added alongside this feature since
   * CategoryViewSet.get_queryset previously only supported `?module=`. */
  isActive?: 'true' | 'false';
  /** DRF's SearchFilter — matches name or slug (CategoryViewSet.search_fields). */
  search?: string;
};

const listCategories = ({
  page = 1,
  isActive,
  search,
}: ListCategoriesParams = {}): Promise<Paginated<CategoryListItem>> => {
  const params = new URLSearchParams({ page: String(page), module: MODULE });
  if (isActive) params.set('is_active', isActive);
  if (search) params.set('search', search);
  return apiFetch(`/categories/?${params.toString()}`);
};

const getCategory = (id: string): Promise<Category> =>
  apiFetch(`/categories/${id}/`);

type CreateCategoryPayload = {
  name: string;
  description?: string;
  parent?: string | null;
};

const createCategory = (
  payload: CreateCategoryPayload,
): Promise<CategoryListItem> =>
  apiFetch('/categories/', {
    method: 'POST',
    json: { ...payload, module: MODULE },
  });

type UpdateCategoryPayload = Partial<{
  name: string;
  description: string;
  parent: string | null;
  is_active: boolean;
}>;

const updateCategory = (
  id: string,
  payload: UpdateCategoryPayload,
): Promise<CategoryListItem> =>
  apiFetch(`/categories/${id}/`, { method: 'PATCH', json: payload });

// Soft delete on the backend (CategoryViewSet.perform_destroy sets
// is_active=False, not a real row removal) — blocked with a 400 if the
// category is still linked to a collection request. The UI surfaces that
// message rather than assuming delete always succeeds.
const deleteCategory = (id: string): Promise<void> =>
  apiFetch(`/categories/${id}/`, { method: 'DELETE' });

export {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
};
export type {
  CreateCategoryPayload,
  ListCategoriesParams,
  Paginated,
  UpdateCategoryPayload,
};
