// Mirrors apps.blogs.serializers.BlogPostSerializer.
type BlogStatus = 'draft' | 'published' | 'archived';

type BlogContentType =
  | 'article'
  | 'guide'
  | 'how_to'
  | 'news'
  | 'case_study'
  | 'educational'
  | 'announcement';

type BlogVisibility = 'public' | 'private';

type BlogDifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

type BlogMediaType =
  | 'featured'
  | 'content'
  | 'gallery'
  | 'infographic'
  | 'video_thumbnail';

// StorageFileField's read representation — see
// features/storageFiles/types.ts's PresignedUpload for the write side.
type CoverImage = { file_key: string; public_url: string | null } | null;

type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

// Mirrors apps.blogs.serializers.BlogMediaSerializer.
type BlogMedia = {
  id: string;
  blog: string;
  type: BlogMediaType;
  file_key: CoverImage;
  alt_text: string;
  caption: string;
  sort_order: number;
};

// Mirrors apps.blogs.serializers.BlogPostListSerializer — the minimal
// shape nested inside `related_blogs`, not the full BlogPost.
type BlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: CoverImage;
  status: BlogStatus;
};

// `title_ar`/`content_ar` are auto-translated and read-only on the
// backend (model fields are `editable=False`) — kept here only for
// display. `slug` is read-only, auto-generated from `title`.
// `reading_time`/`views_count` are also read-only, computed server-side.
// `category` and `author` are both plain ids (not nested) —
// BlogPostSerializer uses a bare FK for `category` and an explicit
// read-only PrimaryKeyRelatedField for `author`, unlike Categories'
// nested `children` or Classifications' nested `assigned_by`.
// `related_blog_ids` (write-only on the backend, used to set
// `related_blogs`) is deliberately omitted here — no admin UI writes it
// yet, see recycling-hub-blogs-module memory's "follow-up work" note.
type BlogPost = {
  id: string;
  title: string;
  title_ar: string;
  slug: string;
  excerpt: string;
  content: string;
  content_ar: string;
  content_type: BlogContentType;
  cover_image: CoverImage;
  category: string | null;
  tags: string[];
  media: BlogMedia[];
  related_blogs: BlogPostSummary[];
  author: string | null;
  status: BlogStatus;
  visibility: BlogVisibility;
  published_at: string | null;
  reading_time: number;
  views_count: number;
  is_featured: boolean;
  allow_comments: boolean;
  location: string;
  difficulty_level: BlogDifficultyLevel | null;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  no_index: boolean;
  created_at: string;
  updated_at: string;
};

export type {
  BlogContentType,
  BlogDifficultyLevel,
  BlogMedia,
  BlogMediaType,
  BlogPost,
  BlogPostSummary,
  BlogStatus,
  BlogTag,
  BlogVisibility,
  CoverImage,
};
