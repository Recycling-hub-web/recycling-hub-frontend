type VehicleType = 'car' | 'motorbike' | 'van';

type VehicleOwnership = 'company' | 'personal';

/** GET /claims/vehicles/mine/ — the requesting driver's own assigned
 * vehicle (every driver has at most one, assigned once by an admin).
 * A vehicle with `ownership === 'company' && has_fleet_card === true`
 * can't be claimed against at all (fleet card vehicles are reimbursed
 * directly) — the create form blocks submission for that combination
 * client-side; the backend also rejects it. */
type Vehicle = {
  id: string;
  plate_number: string;
  vehicle_type: VehicleType;
  ownership: VehicleOwnership;
  has_fleet_card: boolean;
};

type ClaimCategory = 'petrol' | 'tool';

type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'paid';

/** Same shape as finance's ProofOfPayment — a StorageFileField read. */
type ReceiptFile = { file_key: string; public_url: string | null } | null;

type ClaimDriver = { id: string; full_name: string };

/** Flat shape from GET /claims/ and /claims/{id}/ (same serializer for
 * list and detail — no separate "list item" vs "detail" split needed,
 * unlike Finance). Decimal fields (`amount_claimed`, `amount_approved`)
 * come through as strings, matching this codebase's convention for
 * money/decimal fields (see FinanceRecordListItem.price). `vehicle` is
 * always server-resolved from the driver's own assignment — never
 * something the create form sends. */
type ClaimListItem = {
  id: string;
  driver: ClaimDriver;
  category: ClaimCategory;
  vehicle: Vehicle | null;
  date: string;
  amount_claimed: string;
  amount_approved: string | null;
  receipt: ReceiptFile;
  status: ClaimStatus;
  rejection_reason: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  paid_at: string | null;
  paid_by: string | null;
  created_at: string;
};

const CLAIM_CATEGORY_LABELS: Record<ClaimCategory, string> = {
  petrol: 'Petrol',
  tool: 'Tool',
};

const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  paid: 'Paid',
};

const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Car',
  motorbike: 'Motorbike',
  van: 'Van',
};

export { CLAIM_CATEGORY_LABELS, CLAIM_STATUS_LABELS, VEHICLE_TYPE_LABELS };
export type {
  ClaimCategory,
  ClaimDriver,
  ClaimListItem,
  ClaimStatus,
  ReceiptFile,
  Vehicle,
  VehicleOwnership,
  VehicleType,
};
