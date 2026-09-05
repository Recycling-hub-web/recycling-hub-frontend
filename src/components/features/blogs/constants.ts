import type { BadgeVariant } from '../../ui/badges/variants';
import type {
  BlogContentType,
  BlogDifficultyLevel,
  BlogMediaType,
  BlogStatus,
  BlogVisibility,
} from './types';

// Blog posts are categorized against the same generic Category model as
// Material Categories, just a different module — see
// apps.blogs.models.BlogPost.category's `limit_choices_to`. There's no
// admin UI to create `posts`-module categories yet (features/categories/
// only ever manages `materials`) — the picker below will just show
// "None" until that exists. Documented limitation, not a silent bug.
const CATEGORY_MODULE = 'posts' as const;

// SelectField always renders its own disabled `<option value="">Select
// ...</option>` ahead of whatever options are passed in — an actual
// "none" choice can't use value: '' too, or the disabled placeholder
// wins the display (see recycling-hub-categories-module memory). Same
// sentinel pattern reused for every optional single-select below.
const NONE_CATEGORY = 'none' as const;
const NONE_DIFFICULTY = 'none' as const;

const STATUS_LABELS: Record<BlogStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(STATUS_LABELS) as BlogStatus[]).map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

const STATUS_BADGE_VARIANT: Record<BlogStatus, BadgeVariant> = {
  draft: 'neutral',
  published: 'success',
  archived: 'danger',
};

const STATUS_OPTIONS = (Object.keys(STATUS_LABELS) as BlogStatus[]).map(
  (status) => ({ value: status, label: STATUS_LABELS[status] }),
);

const CONTENT_TYPE_LABELS: Record<BlogContentType, string> = {
  article: 'Article',
  guide: 'Guide',
  how_to: 'How-to',
  news: 'News',
  case_study: 'Case study',
  educational: 'Educational',
  announcement: 'Announcement',
};

const CONTENT_TYPE_OPTIONS = (
  Object.keys(CONTENT_TYPE_LABELS) as BlogContentType[]
).map((value) => ({ value, label: CONTENT_TYPE_LABELS[value] }));

const VISIBILITY_LABELS: Record<BlogVisibility, string> = {
  public: 'Public',
  private: 'Private',
};

const VISIBILITY_OPTIONS = (
  Object.keys(VISIBILITY_LABELS) as BlogVisibility[]
).map((value) => ({ value, label: VISIBILITY_LABELS[value] }));

const DIFFICULTY_LABELS: Record<BlogDifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const DIFFICULTY_OPTIONS = [
  { value: NONE_DIFFICULTY, label: 'None' },
  ...(Object.keys(DIFFICULTY_LABELS) as BlogDifficultyLevel[]).map((value) => ({
    value,
    label: DIFFICULTY_LABELS[value],
  })),
];

const MEDIA_TYPE_LABELS: Record<BlogMediaType, string> = {
  featured: 'Featured',
  content: 'Content',
  gallery: 'Gallery',
  infographic: 'Infographic',
  video_thumbnail: 'Video thumbnail',
};

const MEDIA_TYPE_OPTIONS = (
  Object.keys(MEDIA_TYPE_LABELS) as BlogMediaType[]
).map((value) => ({ value, label: MEDIA_TYPE_LABELS[value] }));

export {
  CATEGORY_MODULE,
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_OPTIONS,
  DIFFICULTY_LABELS,
  DIFFICULTY_OPTIONS,
  MEDIA_TYPE_LABELS,
  MEDIA_TYPE_OPTIONS,
  NONE_CATEGORY,
  NONE_DIFFICULTY,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
  VISIBILITY_LABELS,
  VISIBILITY_OPTIONS,
};
