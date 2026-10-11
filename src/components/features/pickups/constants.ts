import type { BadgeVariant } from '../../ui/badges/variants';
import {
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STATUS_LABELS,
  type PickupEvaluationStatus,
  type PickupQuickRequestStatus,
  type PickupRequestType,
  type PickupStage,
  type PickupStatus,
} from './types';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(PICKUP_STATUS_LABELS) as PickupStatus[]).map((status) => ({
    value: status,
    label: PICKUP_STATUS_LABELS[status],
  })),
];

const STATUS_BADGE_VARIANT: Record<PickupStatus, BadgeVariant> = {
  pending: 'warning',
  scheduled: 'info',
  collected: 'success',
  delivered: 'info',
  closed: 'success',
  cancelled: 'danger',
};

const REQUEST_TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All types' },
  ...(Object.keys(PICKUP_REQUEST_TYPE_LABELS) as PickupRequestType[]).map(
    (type) => ({
      value: type,
      label: PICKUP_REQUEST_TYPE_LABELS[type],
    }),
  ),
];

const REQUEST_TYPE_BADGE_VARIANT: Record<PickupRequestType, BadgeVariant> = {
  individual: 'neutral',
  business: 'info',
};

const EVALUATION_STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All evaluations' },
  ...(
    Object.keys(PICKUP_EVALUATION_STATUS_LABELS) as PickupEvaluationStatus[]
  ).map((status) => ({
    value: status,
    label: PICKUP_EVALUATION_STATUS_LABELS[status],
  })),
];

const EVALUATION_STATUS_BADGE_VARIANT: Record<
  PickupEvaluationStatus,
  BadgeVariant
> = {
  pending: 'attention',
  approved: 'success',
  rejected: 'danger',
};

// Table-column variant for the merged status+evaluation badge (see
// derivePickupStage) — 'pending' is unreachable (derivePickupStage never
// returns it) but TypeScript's Record<PickupStage, ...> still requires an
// entry for every PickupStatus it's a superset of.
const PICKUP_STAGE_BADGE_VARIANT: Record<PickupStage, BadgeVariant> = {
  ...STATUS_BADGE_VARIANT,
  awaiting_review: 'attention',
  rejected: 'danger',
  approved: 'info',
};

const QUICK_REQUEST_STATUS_BADGE_VARIANT: Record<
  PickupQuickRequestStatus,
  BadgeVariant
> = {
  new: 'warning',
  contacted: 'info',
  converted: 'success',
};

export {
  EVALUATION_STATUS_BADGE_VARIANT,
  EVALUATION_STATUS_FILTER_OPTIONS,
  PICKUP_STAGE_BADGE_VARIANT,
  QUICK_REQUEST_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
  REQUEST_TYPE_FILTER_OPTIONS,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
};
