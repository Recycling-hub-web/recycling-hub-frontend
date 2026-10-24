import { apiFetch } from '../../../../lib/api';
import type {
  ClaimCategory,
  ClaimListItem,
  ClaimStatus,
  Vehicle,
} from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListClaimsParams = {
  page?: number;
  pageSize?: number;
  status?: ClaimStatus;
  category?: ClaimCategory;
};

// GET /claims/ — accounting/admin see every claim; staff is read-only
// over the same list; a driver sees only their own (mirrors Finance's
// own role split, see financeService.listFinanceRecords).
const listClaims = ({
  page = 1,
  pageSize,
  status,
  category,
}: ListClaimsParams = {}): Promise<Paginated<ClaimListItem>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (pageSize) params.set('page_size', String(pageSize));
  if (status) params.set('status', status);
  if (category) params.set('category', category);
  return apiFetch(`/claims/?${params.toString()}`);
};

// GET /claims/{id}/ — same serializer as the list.
const getClaim = (id: string): Promise<ClaimListItem> =>
  apiFetch(`/claims/${id}/`);

// POST /claims/ — create. Same shape for both categories now: the
// driver's vehicle (petrol only) is resolved server-side from their
// own assignment, never sent by the form.
type CreateClaimPayload = {
  category: ClaimCategory;
  date: string;
  amount_claimed: number;
  receipt?: string;
};

const createClaim = (payload: CreateClaimPayload): Promise<ClaimListItem> =>
  apiFetch('/claims/', { method: 'POST', json: payload });

// POST /claims/{id}/approve/ — `amount_approved` optional; omit to
// approve at the claimed amount.
const approveClaim = (
  id: string,
  amountApproved?: number,
): Promise<ClaimListItem> =>
  apiFetch(`/claims/${id}/approve/`, {
    method: 'POST',
    json:
      amountApproved !== undefined ? { amount_approved: amountApproved } : {},
  });

// POST /claims/{id}/reject/ — `rejection_reason` is required.
const rejectClaim = (
  id: string,
  rejectionReason: string,
): Promise<ClaimListItem> =>
  apiFetch(`/claims/${id}/reject/`, {
    method: 'POST',
    json: { rejection_reason: rejectionReason },
  });

// POST /claims/{id}/mark-paid/ — no body.
const markClaimPaid = (id: string): Promise<ClaimListItem> =>
  apiFetch(`/claims/${id}/mark-paid/`, { method: 'POST' });

// GET /claims/vehicles/mine/ — the requesting driver's own assigned
// vehicle. 404s with {"detail": "No vehicle is assigned to you."} when
// none is assigned — an expected, valid state (see useMyVehicle),
// not an error.
const getMyVehicle = (): Promise<Vehicle> => apiFetch('/claims/vehicles/mine/');

export {
  approveClaim,
  createClaim,
  getClaim,
  getMyVehicle,
  listClaims,
  markClaimPaid,
  rejectClaim,
};
export type { CreateClaimPayload, ListClaimsParams, Paginated };
