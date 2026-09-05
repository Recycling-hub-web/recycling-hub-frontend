// Mirrors apps.blogs.serializers.BlogPostSerializer.
type BlogStatus = 'draft' | 'published' | 'archived';

// StorageFileField's read representation — see
// features/storageFiles/types.ts's PresignedUpload for the write side.
type CoverImage = { file_key: string; public_url: string | null } | null;

// `title_ar`/`content_ar` are auto-translated and read-only on the
// backend (model fields are `editable=False`) — kept here only for
// display. `slug` is read-only, auto-generated from `title`. `category`
// and `author` are both plain ids (not nested) — BlogPostSerializer uses
// a bare FK for `category` and an explicit read-only
// PrimaryKeyRelatedField for `author`, unlike Categories' nested
// `children` or Classifications' nested `assigned_by`.
type BlogPost = {
  id: string;
  title: string;
  title_ar: string;
  slug: string;
  content: string;
  content_ar: string;
  cover_image: CoverImage;
  category: string | null;
  author: string | null;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type { BlogPost, BlogStatus, CoverImage };
