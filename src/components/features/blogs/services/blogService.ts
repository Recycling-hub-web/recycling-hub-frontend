import { apiFetch } from '../../../../lib/api';
import { CATEGORY_MODULE } from '../constants';
import type {
  BlogContentType,
  BlogDifficultyLevel,
  BlogMedia,
  BlogMediaType,
  BlogPost,
  BlogStatus,
  BlogTag,
  BlogVisibility,
} from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListBlogPostsParams = {
  page?: number;
  status?: BlogStatus;
  /** DRF's SearchFilter — matches title/excerpt/content
   * (BlogPostViewSet.search_fields). */
  search?: string;
  /** Override the server's default page size (12) — for option pickers
   * (e.g. usePostOptions' Related Posts picker) that need the full set
   * in one request rather than the real paginated table's page-at-a-time
   * flow. Backed by apps.core.pagination.DefaultPagination, capped at
   * 200 server-side. */
  page_size?: number;
};

const listBlogPosts = ({
  page = 1,
  status,
  search,
  page_size,
}: ListBlogPostsParams = {}): Promise<Paginated<BlogPost>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (page_size) params.set('page_size', String(page_size));
  return apiFetch(`/blogs/?${params.toString()}`);
};

const getBlogPost = (id: string): Promise<BlogPost> =>
  apiFetch(`/blogs/${id}/`);

type CategoryOption = { id: string; name: string };

// Not part of the Blogs domain's own service in spirit — this hits the
// generic Category endpoint (features/categories/ only ever manages the
// `materials` module) scoped to `posts` instead, for the category
// picker. Kept minimal (just id/name) rather than importing
// features/categories' materials-hardcoded service. page_size=200
// (server-capped, apps.core.pagination.DefaultPagination) so the picker
// shows every posts-category rather than silently truncating to the
// first 12 — a real bug this surfaced live once enough categories
// existed to spill past page 1.
const listPostCategories = (): Promise<Paginated<CategoryOption>> =>
  apiFetch(`/categories/?module=${CATEGORY_MODULE}&page_size=200`);

// The detail serializer only returns `category` as an id, same as
// Categories' own `parent` — resolve its name with one extra fetch
// rather than showing a raw UUID (see CategoryDetailsView's identical
// pattern for `parent`).
const getCategoryName = (id: string): Promise<CategoryOption> =>
  apiFetch(`/categories/${id}/`);

type BlogPostPayload = Partial<{
  title: string;
  content: string;
  excerpt: string;
  // '' clears it — the serializer field (StorageFileField, a CharField
  // subclass) is `allow_blank=True` but not `allow_null=True`, so `null`
  // is rejected with "This field may not be null." Confirmed live.
  cover_image: string;
  category: string | null;
  content_type: BlogContentType;
  visibility: BlogVisibility;
  difficulty_level: BlogDifficultyLevel | null;
  status: BlogStatus;
  is_featured: boolean;
  allow_comments: boolean;
  location: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  no_index: boolean;
  tags: string[];
  related_blog_ids: string[];
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

// ─────────────────────────────────────────────────────────────────────
// Tags
// ─────────────────────────────────────────────────────────────────────

type ListBlogTagsParams = { search?: string };

const listBlogTags = ({ search }: ListBlogTagsParams = {}): Promise<
  Paginated<BlogTag>
> => {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  // page_size=200 (server-capped) — this list backs both the Tags CRUD
  // table (no pagination controls, see BlogTagTable) and the Tags
  // picker on Create/Edit; both silently truncated to 12 before this.
  params.set('page_size', '200');
  return apiFetch(`/blogs/tags/?${params.toString()}`);
};

const createBlogTag = (name: string): Promise<BlogTag> =>
  apiFetch('/blogs/tags/', { method: 'POST', json: { name } });

const updateBlogTag = (id: string, name: string): Promise<BlogTag> =>
  apiFetch(`/blogs/tags/${id}/`, { method: 'PATCH', json: { name } });

// Real hard delete on the backend (BlogTagViewSet is a plain
// ModelViewSet, no soft-delete override) — a tag in use is simply
// unlinked from any post that had it (the M2M row is removed), not
// blocked.
const deleteBlogTag = (id: string): Promise<void> =>
  apiFetch(`/blogs/tags/${id}/`, { method: 'DELETE' });

// ─────────────────────────────────────────────────────────────────────
// Media
// ─────────────────────────────────────────────────────────────────────

const listBlogMedia = (blogId: string): Promise<Paginated<BlogMedia>> =>
  apiFetch(`/blogs/media/?blog=${blogId}`);

type CreateBlogMediaPayload = {
  blog: string;
  type: BlogMediaType;
  file_key: string;
  alt_text?: string;
  caption?: string;
  sort_order?: number;
};

const createBlogMedia = (payload: CreateBlogMediaPayload): Promise<BlogMedia> =>
  apiFetch('/blogs/media/', { method: 'POST', json: payload });

const deleteBlogMedia = (id: string): Promise<void> =>
  apiFetch(`/blogs/media/${id}/`, { method: 'DELETE' });

export {
  createBlogMedia,
  createBlogPost,
  createBlogTag,
  deleteBlogMedia,
  deleteBlogPost,
  deleteBlogTag,
  getBlogPost,
  getCategoryName,
  listBlogMedia,
  listBlogPosts,
  listBlogTags,
  listPostCategories,
  updateBlogPost,
  updateBlogTag,
};
export type {
  BlogPostPayload,
  CategoryOption,
  CreateBlogMediaPayload,
  ListBlogPostsParams,
  ListBlogTagsParams,
  Paginated,
};
