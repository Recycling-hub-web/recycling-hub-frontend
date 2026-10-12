type FinanceCollectionRequest = {
  id: string;
  full_name: string;
  /** "First item's category + N more" — a summary, not the full items
   * list (see FinanceRecordItem for the itemized price breakdown). */
  items_summary: string;
  pickup_address: string;
};

/** One priced line, only present when the evaluator chose itemized
 * pricing for this record (see CollectionRequestDecisionService
 * .evaluate on the backend) — empty for a lump-sum FinanceRecord. */
type FinanceRecordItem = {
  id: string;
  category: string;
  price: string;
};

type FinanceStatus = 'pending' | 'claimed' | 'verified' | 'reimbursed';

type FinancePaymentMethod = 'duitnow' | 'cash' | 'bank_transfer';

type FinanceDriver = {
  id: string;
  full_name: string;
  payout_method: FinancePaymentMethod | '';
  payout_account_details: string;
};

type ProofOfPayment = { file_key: string; public_url: string | null } | null;

/** Flat shape from GET /finance/ (FinanceRecordListSerializer) — a
 * priced, approved pickup request, created by
 * CollectionRequestDecisionService.evaluate on the pickups side and
 * updated by .collect() when an assigned driver pays the customer out
 * of pocket. */
type FinanceRecordListItem = {
  id: string;
  collection_request: FinanceCollectionRequest;
  price: string;
  /** Only populated when the evaluator chose itemized pricing. */
  items: FinanceRecordItem[];
  driver: FinanceDriver | null;
  actual_amount: string | null;
  payment_method: FinancePaymentMethod | '';
  proof_of_payment: ProofOfPayment;
  reimbursement_proof: ProofOfPayment;
  status: FinanceStatus;
  claimed_at: string | null;
  verified_at: string | null;
  verified_by: string | null;
  reimbursed_at: string | null;
  reimbursed_by: string | null;
  created_at: string;
};

const FINANCE_STATUS_LABELS: Record<FinanceStatus, string> = {
  pending: 'Pending',
  claimed: 'Claimed',
  verified: 'Verified',
  reimbursed: 'Reimbursed',
};

const FINANCE_PAYMENT_METHOD_LABELS: Record<FinancePaymentMethod, string> = {
  duitnow: 'DuitNow',
  cash: 'Cash',
  bank_transfer: 'Bank transfer',
};

export { FINANCE_PAYMENT_METHOD_LABELS, FINANCE_STATUS_LABELS };
export type {
  FinanceCollectionRequest,
  FinanceDriver,
  FinancePaymentMethod,
  FinanceRecordItem,
  FinanceRecordListItem,
  FinanceStatus,
  ProofOfPayment,
};
