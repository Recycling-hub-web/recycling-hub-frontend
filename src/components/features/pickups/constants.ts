import type { BadgeVariant } from '../../ui/badges/variants';
import { PICKUP_STATUS_LABELS, type PickupStatus } from './types';

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

export { STATUS_BADGE_VARIANT, STATUS_FILTER_OPTIONS };
