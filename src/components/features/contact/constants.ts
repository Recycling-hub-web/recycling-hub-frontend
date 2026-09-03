import type { BadgeVariant } from '../../ui/badges/variants';
import { CONTACT_STATUS_LABELS, type ContactMessageStatus } from './types';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(CONTACT_STATUS_LABELS) as ContactMessageStatus[]).map(
    (status) => ({ value: status, label: CONTACT_STATUS_LABELS[status] }),
  ),
];

const STATUS_BADGE_VARIANT: Record<ContactMessageStatus, BadgeVariant> = {
  pending: 'warning',
  follow_up: 'info',
  closed: 'neutral',
};

const STATUS_OPTIONS = (
  Object.keys(CONTACT_STATUS_LABELS) as ContactMessageStatus[]
).map((status) => ({ value: status, label: CONTACT_STATUS_LABELS[status] }));

export { STATUS_BADGE_VARIANT, STATUS_FILTER_OPTIONS, STATUS_OPTIONS };
