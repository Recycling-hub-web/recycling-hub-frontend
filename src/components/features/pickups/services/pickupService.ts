import { apiFetch } from '../../../../lib/api';
import type {
  CollectionRequestDetails,
  CollectionRequestListItem,
  LatLng,
  OptimizeRouteResult,
  PickupEvaluationStatus,
  PickupQuickRequestListItem,
  PickupQuickRequestStatus,
  PickupRequestDetails,
  PickupRequestListItem,
  PickupRequestStatus,
  PickupRequestType,
  PickupStatus,
} from '../types';

/** One material line as submitted on an Order's create/update — an
 * Order may hold zero to MAX_PICKUP_ITEMS of these. */
type PickupRequestItemInput = {
  category: string;
  estimated_quantity?: string;
  quantity_unit?: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ── PickupRequest (the customer's ask) ──────────────────────────────

type ListPickupRequestsParams = {
  page?: number;
  status?: PickupRequestStatus;
  search?: string;
  requestType?: PickupRequestType;
};

// Admin/staff only — GET /pickup-requests/.
const listPickupRequests = ({
  page = 1,
  status,
  search,
  requestType,
}: ListPickupRequestsParams = {}): Promise<
  Paginated<PickupRequestListItem>
> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (requestType) params.set('request_type', requestType);
  return apiFetch(`/pickup-requests/?${params.toString()}`);
};

// Admin/staff only — GET /pickup-requests/{id}/.
const getPickupRequest = (id: string): Promise<PickupRequestDetails> =>
  apiFetch(`/pickup-requests/${id}/`);

type PickupRequestCreatePayload = {
  request_type?: PickupRequestType;
  full_name: string;
  /** Required for `business` requests only — optional for `individual`,
   * see PickupRequestCreateSerializer.validate on the backend. */
  email?: string;
  phone_number: string;
  /** Optional FK to a collection point, for drop-off instead of
   * doorstep pickup. */
  collection_point?: string;
  pickup_address: string;
  /** The requester's own chosen pickup date/time — required, ISO
   * datetime. */
  requested_at: string;
  note?: string;
  /** Admin/staff only: orders to create together with the request (at
   * most 7) — see PickupRequestCreateSerializer.orders. */
  orders?: CreateOrderPayload[];
};

/** The common subset of what POST /pickup-requests/ always returns —
 * for an anonymous (public) caller the backend deliberately returns
 * only `{id, status}` (security audit L-6: internal fields are for
 * admin/staff only); an authenticated admin/staff caller gets the full
 * PickupRequestDetailsSerializer, a superset of this. */
type PickupRequestCreateResult = {
  id: string;
  status: PickupRequestStatus;
};

// Public, no auth (AllowAny on create — see
// PickupRequestViewSet.get_permissions) — used by both the public
// request form and the admin/staff "New pickup request" view, same
// endpoint either way. Unlike the old, now-removed flat create, there's
// no `items`/`photo` here — those belong to an Order, created
// separately via createOrder below.
const createPickupRequest = (
  payload: PickupRequestCreatePayload,
): Promise<PickupRequestCreateResult> =>
  apiFetch('/pickup-requests/', { method: 'POST', json: payload });

type PickupRequestUpdatePayload = Partial<{
  full_name: string;
  email: string;
  phone_number: string;
  pickup_address: string;
  collection_point: string;
  requested_at: string;
  note: string;
}>;

// Admin/staff correcting the requester's own details — see
// PickupRequestUpdateSerializer. `status`/`request_type` aren't
// editable here — status only ever changes via cancel (or the
// automatic recompute once every Order under it is terminal).
const updatePickupRequest = (
  id: string,
  payload: PickupRequestUpdatePayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickup-requests/${id}/`, { method: 'PATCH', json: payload });

type CancelPickupRequestPayload = {
  /** Becomes `cancellation_reason` on the backend. */
  note: string;
};

// Cancels the request AND force-cancels every non-terminal Order under
// it, in one action — see PickupRequestViewSet.cancel /
// cancel_pickup_request on the backend.
const cancelPickupRequest = (
  id: string,
  payload: CancelPickupRequestPayload,
): Promise<PickupRequestDetails> =>
  apiFetch(`/pickup-requests/${id}/cancel/`, { method: 'POST', json: payload });

type CreateOrderPayload = {
  /** Optional now (unlike the old public create) — staff can add/
   * correct them afterward via updateOrder's whole-list items replace,
   * while evaluation is still pending. Max 20. */
  items?: PickupRequestItemInput[];
  /** Up to 4 storage file keys — see PickupPhotosUploader. */
  photos?: string[];
};

// Admin/staff creating an Order under an existing PickupRequest — up to
// 7 per request (hard block past that, see validate_order_count on the
// backend).
const createOrder = (
  pickupRequestId: string,
  payload: CreateOrderPayload,
): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickup-requests/${pickupRequestId}/orders/`, {
    method: 'POST',
    json: payload,
  });

// ── Order (CollectionRequest — "Order" is a UI/API label only) ──────

type ListOrdersParams = {
  page?: number;
  status?: PickupStatus;
  search?: string;
  requestType?: PickupRequestType;
  evaluationStatus?: PickupEvaluationStatus;
  /** Collection point id — Orders whose route was dropped off there. */
  dropOffPoint?: string;
};

const listOrders = ({
  page = 1,
  status,
  search,
  requestType,
  evaluationStatus,
  dropOffPoint,
}: ListOrdersParams = {}): Promise<Paginated<CollectionRequestListItem>> => {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  if (requestType) params.set('request_type', requestType);
  if (evaluationStatus) params.set('evaluation_status', evaluationStatus);
  if (dropOffPoint) params.set('drop_off_point', dropOffPoint);
  return apiFetch(`/pickups/?${params.toString()}`);
};

const getOrder = (id: string): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/`);

type UpdateOrderPayload = Partial<{
  requested_date: string;
  note: string;
  /** Whole-list replace — every existing item is deleted and recreated
   * from this payload. Only accepted by the backend while
   * evaluation_status is still `pending` (see
   * CollectionRequestUpdateSerializer.validate_items). Contact/address
   * fields used to be editable here too — they live on the parent
   * PickupRequest now (see updatePickupRequest above). */
  items: PickupRequestItemInput[];
}>;

// `status` is deliberately not editable here — see
// CollectionRequestUpdateSerializer's docstring on the backend; status
// only ever changes through schedule/collect/cancel below.
const updateOrder = (
  id: string,
  payload: UpdateOrderPayload,
): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/`, { method: 'PATCH', json: payload });

const deleteOrder = (id: string): Promise<void> =>
  apiFetch(`/pickups/${id}/`, { method: 'DELETE' });

/** One item's price, for the itemized-pricing path. */
type EvaluateItemInput = {
  item_id: string;
  price: string;
};

type EvaluatePickupPayload = {
  decision: 'approved' | 'rejected';
  /** One lump total — required when approving, unless `items` is given
   * instead. The evaluator's choice, for either request_type. */
  price?: string;
  /** A price per item, summed into the total — required when
   * approving, unless `price` is given instead. */
  items?: EvaluateItemInput[];
  /** Required when rejecting (the reason); optional when approving. */
  note?: string;
};

// Only valid from `pending` — see CollectionRequestDecisionService.evaluate.
// Not a one-shot action: can be called again while still `pending`.
const evaluatePickupRequest = (
  id: string,
  payload: EvaluatePickupPayload,
): Promise<CollectionRequestDetails> =>
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
): Promise<CollectionRequestDetails> =>
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
): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/assign-driver/`, { method: 'POST', json: payload });

// The driver's self-service counterpart to assignDriverToRequest —
// claims using the logged-in driver's own profile, no body needed.
const claimOrder = (id: string): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/claim/`, { method: 'POST' });

type ConfirmSchedulePayload = {
  scheduled_at: string;
};

// The assigned driver's explicit confirmation of the pickup time —
// closes the gap where assign-driver/claim alone reach `scheduled` with
// no explicit time commitment from the driver. Only valid from
// `scheduled`, and only by the assigned driver. Driver only.
const confirmSchedule = (
  id: string,
  payload: ConfirmSchedulePayload,
): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/confirm-schedule/`, {
    method: 'POST',
    json: payload,
  });

/** One item's actual collected quantity — corrects an existing item
 * (`id` given, optionally with a corrected `category`/
 * `estimated_quantity` too), or records a brand-new one the driver
 * found on-site (no `id`, `category`/`collected_quantity`/
 * `quantity_unit` all required). */
type CollectItemInput =
  | {
      id: string;
      collected_quantity?: string;
      category?: string;
      estimated_quantity?: string;
    }
  | {
      category: string;
      collected_quantity: string;
      /** "kg" or "unit" — may be omitted when the category allows only
       * one (the API fills it in). */
      quantity_unit?: string;
    };

type CollectPickupPayload = {
  /** Single-item convenience path — only valid when the request has
   * exactly one item. Use `items` instead for a multi-item request. */
  collected_quantity?: string;
  /** Per-item collected quantities (and on-site additions/corrections)
   * for a multi-item request. */
  items?: CollectItemInput[];
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
): Promise<CollectionRequestDetails> =>
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
  /** The store the batch is dropped at — the route's planned end point,
   * or a different one if the driver went elsewhere. Required by the
   * backend when the route has no end point yet. */
  collection_point?: string;
};

// The driver's batch store drop-off — every selected item on their
// current open Route, in one write. See
// apps.pickups.services.drop_off_route on the backend.
const dropOffRoute = (
  payload: DropOffPayload,
): Promise<CollectionRequestListItem[]> =>
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
const closeDelivery = (id: string): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/close/`, { method: 'POST' });

type CancelOrderPayload = {
  /** Becomes `cancellation_reason` on the backend. */
  note: string;
};

// Not valid once `collected` or already `cancelled` — see
// CollectionRequestDecisionService.cancel.
const cancelOrder = (
  id: string,
  payload: CancelOrderPayload,
): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/${id}/cancel/`, { method: 'POST', json: payload });

// ── Quick leads (PickupQuickRequest — unaffected by the Request/Order
// split beyond convert()'s payload, below) ──────────────────────────

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

type ConvertQuickPickupRequestPayload = PickupRequestCreatePayload & {
  /** Optional — unlike createOrder, there's no separate step here: the
   * lead is completed into a PickupRequest and one Order under it in a
   * single call (see PickupQuickRequestViewSet.convert on the backend).
   * No `photos` here — convert() doesn't accept them. */
  items?: PickupRequestItemInput[];
};

// Completes a lead into a real pickup request — creates both a
// PickupRequest and one Order under it in a single step, linking this
// lead to the new Order. Admin/staff only.
const convertQuickPickupRequest = (
  id: string,
  payload: ConvertQuickPickupRequestPayload,
): Promise<CollectionRequestDetails> =>
  apiFetch(`/pickups/quick/${id}/convert/`, { method: 'POST', json: payload });

type DailyVolumePoint = {
  date: string;
  count: number;
};

export {
  assignDriverToRequest,
  cancelOrder,
  cancelPickupRequest,
  claimOrder,
  closeDelivery,
  collectPickupRequest,
  confirmSchedule,
  convertQuickPickupRequest,
  createOrder,
  createPickupRequest,
  createQuickPickupRequest,
  deleteOrder,
  dropOffRoute,
  evaluatePickupRequest,
  getOrder,
  getPickupRequest,
  getQuickPickupRequest,
  listOrders,
  listPickupRequests,
  listQuickPickupRequests,
  markQuickPickupRequestContacted,
  optimizeRoute,
  schedulePickupRequest,
  updateOrder,
  updatePickupRequest,
};
export type {
  AssignDriverPayload,
  CancelOrderPayload,
  CancelPickupRequestPayload,
  CollectItemInput,
  CollectPickupPayload,
  ConfirmSchedulePayload,
  ConvertQuickPickupRequestPayload,
  CreateOrderPayload,
  CreateQuickPickupRequestPayload,
  DailyVolumePoint,
  DropOffItem,
  DropOffPayload,
  EvaluateItemInput,
  EvaluatePickupPayload,
  ListOrdersParams,
  ListPickupRequestsParams,
  ListQuickPickupRequestsParams,
  OptimizeRoutePayload,
  Paginated,
  PickupRequestCreatePayload,
  PickupRequestCreateResult,
  PickupRequestItemInput,
  PickupRequestUpdatePayload,
  SchedulePickupPayload,
  UpdateOrderPayload,
};
