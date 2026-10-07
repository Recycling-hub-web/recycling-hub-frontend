import type { BadgeVariant } from '../../ui/badges/variants';
import { FINANCE_STATUS_LABELS, type FinanceStatus } from './types';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...(Object.keys(FINANCE_STATUS_LABELS) as FinanceStatus[]).map((status) => ({
    value: status,
    label: FINANCE_STATUS_LABELS[status],
  })),
];

const STATUS_BADGE_VARIANT: Record<FinanceStatus, BadgeVariant> = {
  pending: 'neutral',
  claimed: 'warning',
  verified: 'info',
  reimbursed: 'success',
};

export { STATUS_BADGE_VARIANT, STATUS_FILTER_OPTIONS };
