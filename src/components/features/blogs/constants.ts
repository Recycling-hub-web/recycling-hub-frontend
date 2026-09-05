import type { BadgeVariant } from '../../ui/badges/variants';
import type { BlogStatus } from './types';

// Blog posts are categorized against the same generic Category model as
// Material Categories, just a different module — see
// apps.blogs.models.BlogPost.category's `limit_choices_to`. There's no
// admin UI to create `posts`-module categories yet (features/categories/
// only ever manages `materials`) — the picker below will just show
// "None" until that exists. Documented limitation, not a silent bug.
const CATEGORY_MODULE = 'posts' as const;

// Same SelectField-placeholder-collision gotcha as Categories' Parent
// field (see recycling-hub-categories-module memory) — a non-empty
// sentinel for "no category" instead of ''.
const NONE_CATEGORY = 'none' as const;

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

export {
  CATEGORY_MODULE,
  NONE_CATEGORY,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
  STATUS_LABELS,
  STATUS_OPTIONS,
};
