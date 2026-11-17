/** How a driver is paid back for reimbursements — the backend's
 * DriverProfile.PayoutMethod. Shared by Create user and the driver's own
 * profile. */
// Cash remains readable for historical records, but cannot be selected.
type PayoutMethod = 'duitnow' | 'cash' | 'bank_transfer';

const PAYOUT_METHOD_LABELS: Record<PayoutMethod, string> = {
  duitnow: 'DuitNow',
  cash: 'Cash (legacy)',
  bank_transfer: 'Bank transfer',
};

const PAYOUT_METHOD_OPTIONS = (
  Object.keys(PAYOUT_METHOD_LABELS) as PayoutMethod[]
)
  .filter((value) => value !== 'cash')
  .map((value) => ({ value, label: PAYOUT_METHOD_LABELS[value] }));

export { PAYOUT_METHOD_LABELS, PAYOUT_METHOD_OPTIONS };
export type { PayoutMethod };
