import { apiFetch } from '../../../../lib/api';
import type { PresignedUpload } from '../../storageFiles/types';
import type {
  LatLng,
  OptimizeRouteResult,
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
  /** Required for `business` requests only — optional for `individual`,
   * see CollectionRequestCreateSerializer.validate on the backend. */
  email?: string;
  phone_number?: string;
  category: string;
  request_type?: PickupRequestType;
  pickup_address: string;
  /** Optional photo of the item(s) to be collected — a storage file key. */
  photo?: string;
  estimated_quantity?: string;
  quantity_unit?: string;
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

// AllowAny, unlike the generic storage app's presigned-upload-urls — a
// deliberately narrow endpoint (hard-coded folder/file_type, a small
// image-only content-type allowlist, a 5 MB cap) specifically so the
// public pickup form's optional photo field works for anonymous
// visitors without exposing the full generic upload surface to them.
// See PickupPhotoUploadUrlView on the backend.
const requestPickupPhotoUploadUrl = (
  fileName: string,
  contentType: string,
): Promise<{ uploads: PresignedUpload[] }> =>
  apiFetch('/pickups/photo-upload-url/', {
    method: 'POST',
    json: { file_name: fileName, content_type: contentType },
  });

type UpdatePickupRequestPayload = Partial<{
  pickup_address: string;
  photo: string;
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
  scheduled_at?: string;
};

// The only way to schedule a pickup from the UI — assigns a driver and,
// optionally, a pickup time. schedulePickupRequest above (a staff
// collector, no driver) still exists on the backend but no longer has a
// frontend caller. Only valid from `pending` +
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

type OptimizeRoutePayload = {
  request_ids: string[];
  /** Omit once the route already has one — the backend ignores a
   * conflicting value after the first call, a route doesn't change
   * destination mid-way. */
  collection_point?: string | null;
  origin: LatLng;
};

// Driver only, only for their own current open Route's `scheduled`
// stops — see apps.pickups.services.optimize_route on the backend.
// Nothing here is persisted beyond the route's own collection_point;
// re-optimizing is just calling this again.
const optimizeRoute = (
  payload: OptimizeRoutePayload,
): Promise<OptimizeRouteResult> =>
  apiFetch('/pickups/optimize-route/', { method: 'POST', json: payload });

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
  optimizeRoute,
  requestPickupPhotoUploadUrl,
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
  OptimizeRoutePayload,
  Paginated,
  SchedulePickupPayload,
  UpdatePickupRequestPayload,
};
