import type { BadgeVariant } from '../../ui/badges/variants';
import {
  CLAIM_CATEGORY_LABELS,
  CLAIM_STATUS_LABELS,
  type ClaimCategory,
  type ClaimStatus,
} from './types';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(CLAIM_STATUS_LABELS) as ClaimStatus[]).map((status) => ({
    value: status,
    label: CLAIM_STATUS_LABELS[status],
  })),
];

const CATEGORY_FILTER_OPTIONS = [
  { value: '', label: 'All categories' },
  ...(Object.keys(CLAIM_CATEGORY_LABELS) as ClaimCategory[]).map(
    (category) => ({
      value: category,
      label: CLAIM_CATEGORY_LABELS[category],
    }),
  ),
];

const STATUS_BADGE_VARIANT: Record<ClaimStatus, BadgeVariant> = {
  pending: 'neutral',
  approved: 'info',
  rejected: 'danger',
  paid: 'success',
};

// Mirrors the backend's RM50 threshold for requiring a receipt on tool
// claims — checked here only as a nicety so the form can show the
// uploader as required up front; the backend stays authoritative (its
// validation error surfaces if this client-side guess is ever wrong).
const TOOL_RECEIPT_THRESHOLD = 50;

export {
  CATEGORY_FILTER_OPTIONS,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
  TOOL_RECEIPT_THRESHOLD,
};
