import type { BadgeVariant } from '../../ui/badges/variants';
import {
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STATUS_LABELS,
  type PickupQuickRequestStatus,
  type PickupRequestType,
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

const QUICK_REQUEST_STATUS_BADGE_VARIANT: Record<
  PickupQuickRequestStatus,
  BadgeVariant
> = {
  new: 'warning',
  contacted: 'info',
  converted: 'success',
};

export {
  QUICK_REQUEST_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
  REQUEST_TYPE_FILTER_OPTIONS,
  STATUS_BADGE_VARIANT,
  STATUS_FILTER_OPTIONS,
};
