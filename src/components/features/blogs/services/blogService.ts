import { apiFetch } from '../../../../lib/api';
import { CATEGORY_MODULE } from '../constants';
import type { BlogPost, BlogStatus } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListBlogPostsParams = {
  page?: number;
  status?: BlogStatus;
  /** DRF's SearchFilter — matches title (BlogPostViewSet.search_fields). */
  search?: string;
};

const listBlogPosts = ({
  page = 1,
  status,
  search,
}: ListBlogPostsParams = {}): Promise<Paginated<BlogPost>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return apiFetch(`/blogs/?${params.toString()}`);
};

const getBlogPost = (id: string): Promise<BlogPost> =>
  apiFetch(`/blogs/${id}/`);

type CategoryOption = { id: string; name: string };

// Not part of the Blogs domain's own service in spirit — this hits the
// generic Category endpoint (features/categories/ only ever manages the
// `materials` module) scoped to `posts` instead, for the category
// picker. Kept minimal (just id/name) rather than importing
// features/categories' materials-hardcoded service.
const listPostCategories = (): Promise<Paginated<CategoryOption>> =>
  apiFetch(`/categories/?module=${CATEGORY_MODULE}`);

// The detail serializer only returns `category` as an id, same as
// Categories' own `parent` — resolve its name with one extra fetch
// rather than showing a raw UUID (see CategoryDetailsView's identical
// pattern for `parent`).
const getCategoryName = (id: string): Promise<CategoryOption> =>
  apiFetch(`/categories/${id}/`);

type BlogPostPayload = Partial<{
  title: string;
  content: string;
  // '' clears it — the serializer field (StorageFileField, a CharField
  // subclass) is `allow_blank=True` but not `allow_null=True`, so `null`
  // is rejected with "This field may not be null." Confirmed live.
  cover_image: string;
  category: string | null;
  status: BlogStatus;
}>;

const createBlogPost = (payload: BlogPostPayload): Promise<BlogPost> =>
  apiFetch('/blogs/', { method: 'POST', json: payload });

const updateBlogPost = (
  id: string,
  payload: BlogPostPayload,
): Promise<BlogPost> =>
  apiFetch(`/blogs/${id}/`, { method: 'PATCH', json: payload });

// Soft delete on the backend (BlogPostViewSet.perform_destroy sets
// status=archived, same spirit as Categories' is_active soft-delete) —
// no hard-delete endpoint.
const deleteBlogPost = (id: string): Promise<void> =>
  apiFetch(`/blogs/${id}/`, { method: 'DELETE' });

export {
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  getCategoryName,
  listBlogPosts,
  listPostCategories,
  updateBlogPost,
};
export type { BlogPostPayload, CategoryOption, ListBlogPostsParams, Paginated };
