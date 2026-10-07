import { apiFetch } from '../../../../lib/api';
import type {
  PickupEvaluationStatus,
  PickupQuickRequestListItem,
  PickupQuickRequestStatus,
  PickupRequestDetails,
  PickupRequestListItem,
  PickupRequestType,
  PickupStatus,
} from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListPickupRequestsParams = {
  page?: number;
  status?: PickupStatus;
  search?: string;
  requestType?: PickupRequestType;
  evaluationStatus?: PickupEvaluationStatus;
};

const listPickupRequests = ({
  page = 1,
  status,
  search,
  requestType,
  evaluationStatus,
}: ListPickupRequestsParams = {}): Promise<
  Paginated<PickupRequestListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (requestType) params.set('request_type', requestType);
  if (evaluationStatus) params.set('evaluation_status', evaluationStatus);
  return apiFetch(`/pickups/?${params.toString()}`);
};

const getPickupRequest = (id: string): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/`);

type CreatePickupRequestPayload = {
  full_name: string;
  email: string;
  phone_number?: string;
  category: string;
  request_type?: PickupRequestType;
  pickup_address: string;
  estimated_quantity?: string;
  quantity_unit?: string;
  requested_date?: string;
  note?: string;
};

// Public on the backend (CollectionRequestViewSet.get_permissions — no
// resident accounts, so submission never requires auth) — used by both
// the public request form and the admin/staff "New request" action,
// same endpoint either way.
const createPickupRequest = (
  payload: CreatePickupRequestPayload,
): Promise<PickupRequestDetails> =>
  apiFetch('/pickups/', { method: 'POST', json: payload });

type UpdatePickupRequestPayload = Partial<{
  pickup_address: string;
  estimated_quantity: string;
  requested_date: string;
  note: string;
}>;

// `status` is deliberately not editable here — see
// CollectionRequestUpdateSerializer's docstring on the backend; status
// only ever changes through schedule/collect/cancel below.
const updatePickupRequest = (
  id: string,
  payload: UpdatePickupRequestPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/`, { method: 'PATCH', json: payload });

const deletePickupRequest = (id: string): Promise<void> =>
  apiFetch(`/pickups/${id}/`, { method: 'DELETE' });

type EvaluatePickupPayload = {
  decision: 'approved' | 'rejected';
  /** Required when approving — creates/updates the linked finance
   * record. Ignored when rejecting. */
  price?: string;
  /** Required when rejecting (the reason); optional when approving. */
  note?: string;
};

// Only valid from `pending` — see CollectionRequestDecisionService.evaluate.
// Not a one-shot action: can be called again while still `pending`.
const evaluatePickupRequest = (
  id: string,
  payload: EvaluatePickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/evaluate/`, { method: 'POST', json: payload });

type SchedulePickupPayload = {
  collector: string;
  scheduled_at: string;
  note?: string;
};

// Only valid from `pending` + `evaluation_status=approved` — see
// CollectionRequestDecisionService.schedule.
const schedulePickupRequest = (
  id: string,
  payload: SchedulePickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/schedule/`, { method: 'POST', json: payload });

type AssignDriverPayload = {
  driver: string;
};

// A second, independent way to reach `scheduled` alongside
// schedulePickupRequest above — assigns a driver instead of a staff
// collector + exact time. Only valid from `pending` +
// `evaluation_status=approved` — see
// CollectionRequestDecisionService.assign_driver.
const assignDriverToRequest = (
  id: string,
  payload: AssignDriverPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/assign-driver/`, { method: 'POST', json: payload });

// The driver's self-service counterpart to assignDriverToRequest —
// claims using the logged-in driver's own profile, no body needed.
const claimPickupRequest = (id: string): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/claim/`, { method: 'POST' });

type CollectPickupPayload = {
  collected_quantity?: string;
  note?: string;
  /** Driver-collected only — ignored by the backend otherwise. See
   * FinanceRecord on the backend, updated by this same collect() call. */
  actual_amount?: string;
  payment_method?: 'duitnow' | 'cash' | 'bank_transfer';
  proof_of_payment?: string;
};

// Only valid from `scheduled` — see CollectionRequestDecisionService.collect.
const collectPickupRequest = (
  id: string,
  payload: CollectPickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/collect/`, { method: 'POST', json: payload });

type DropOffItem = {
  id: string;
  /** Optional — confirms nothing was lost/damaged in transit. */
  delivered_quantity?: string;
};

type DropOffPayload = {
  items: DropOffItem[];
  /** One proof photo for the whole batch, not per item. */
  proof?: string;
};

// The driver's batch store drop-off — every selected item on their
// current open Route, in one write. See
// apps.pickups.services.drop_off_route on the backend.
const dropOffRoute = (
  payload: DropOffPayload,
): Promise<PickupRequestListItem[]> =>
  apiFetch('/pickups/drop-off/', { method: 'POST', json: payload });

// Receiving Officer (or admin) verifying a delivered request and
// closing it out — only valid from `delivered`. See
// CollectionRequestDecisionService.close_delivery.
const closeDelivery = (id: string): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/close/`, { method: 'POST' });

type CancelPickupPayload = {
  /** Becomes `cancellation_reason` on the backend. */
  note: string;
};

// Not valid once `collected` or already `cancelled` — see
// CollectionRequestDecisionService.cancel.
const cancelPickupRequest = (
  id: string,
  payload: CancelPickupPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/${id}/cancel/`, { method: 'POST', json: payload });

type CreateQuickPickupRequestPayload = {
  request_type?: PickupRequestType;
  phone_number: string;
};

// Public on the backend (PickupQuickRequestViewSet.get_permissions) —
// same reasoning as createPickupRequest above.
const createQuickPickupRequest = (
  payload: CreateQuickPickupRequestPayload,
): Promise<PickupQuickRequestListItem> =>
  apiFetch('/pickups/quick/', { method: 'POST', json: payload });

type ListQuickPickupRequestsParams = {
  status?: PickupQuickRequestStatus;
};

const listQuickPickupRequests = ({
  status,
}: ListQuickPickupRequestsParams = {}): Promise<
  Paginated<PickupQuickRequestListItem>
> => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const query = params.toString();
  return apiFetch(`/pickups/quick/${query ? `?${query}` : ''}`);
};

const getQuickPickupRequest = (
  id: string,
): Promise<PickupQuickRequestListItem> => apiFetch(`/pickups/quick/${id}/`);

// Purely informational — doesn't block converting later. 400 if the
// lead was already converted.
const markQuickPickupRequestContacted = (
  id: string,
): Promise<PickupQuickRequestListItem> =>
  apiFetch(`/pickups/quick/${id}/mark-contacted/`, { method: 'POST' });

// Completes a lead into a real pickup request — same payload shape as
// createPickupRequest, since it's the same CollectionRequestCreateSerializer
// on the backend. Admin/staff only.
const convertQuickPickupRequest = (
  id: string,
  payload: CreatePickupRequestPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickups/quick/${id}/convert/`, { method: 'POST', json: payload });

export {
  assignDriverToRequest,
  cancelPickupRequest,
  claimPickupRequest,
  closeDelivery,
  collectPickupRequest,
  convertQuickPickupRequest,
  createPickupRequest,
  createQuickPickupRequest,
  deletePickupRequest,
  dropOffRoute,
  evaluatePickupRequest,
  getPickupRequest,
  getQuickPickupRequest,
  listPickupRequests,
  listQuickPickupRequests,
  markQuickPickupRequestContacted,
  schedulePickupRequest,
  updatePickupRequest,
};
export type {
  AssignDriverPayload,
  CancelPickupPayload,
  CollectPickupPayload,
  CreatePickupRequestPayload,
  CreateQuickPickupRequestPayload,
  DropOffItem,
  DropOffPayload,
  EvaluatePickupPayload,
  ListPickupRequestsParams,
  ListQuickPickupRequestsParams,
  Paginated,
  SchedulePickupPayload,
  UpdatePickupRequestPayload,
};
