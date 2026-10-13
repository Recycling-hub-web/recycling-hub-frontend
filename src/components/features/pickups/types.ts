type PickupStatus =
  | 'pending'
  | 'scheduled'
  | 'collected'
  | 'delivered'
  | 'closed'
  | 'cancelled';

/** Only ever set on the driver-collected path — see Route on the
 * backend, created implicitly when a request is first assigned to a
 * driver. */
type RouteInfo = {
  id: string;
  status: 'open' | 'dropped_off';
  dropped_off_at: string | null;
  // This route's drop-off store (its end point) — set from the first
  // assigned stop that names a collection point, kept after; the
  // drop-off records the store actually used. null only if no stop on
  // the route had one yet.
  collection_point: PickupCollectionPoint;
};

type PickupRequestType = 'individual' | 'business';

type PickupEvaluationStatus = 'pending' | 'approved' | 'rejected';

type PickupCategory = {
  id: string;
  name: string;
};

type PickupCollectionPoint = {
  id: string;
  name: string;
  address: string;
} | null;

type LatLng = { lat: number; lng: number };

/** One option for the Optimize Route modal's collection-point picker —
 * GET /collection-points/ (public, already existed for the public
 * "find a drop-off point" flow). Only the fields this feature needs. */
type CollectionPointOption = {
  id: string;
  name: string;
  address: string;
};

/** One material line on a request — a request always has at least one,
 * for either request_type (individual and business can both hold
 * several, e.g. "10 computers, 3 phones, 3 AirPods" in one visit). */
type PickupRequestItem = {
  id: string;
  category: PickupCategory;
  estimated_quantity: string | null;
  quantity_unit: string;
  collected_quantity: string | null;
};

type OptimizeRouteStop = LatLng & { request_id: string };

/** Response shape from POST /pickups/optimize-route/ — `stops` is
 * already in the optimized visiting order. Nothing here is persisted
 * beyond the route's own `collection_point` (see RouteInfo) — this is
 * consumed once by the caller. */
type OptimizeRouteResult = {
  collection_point: CollectionPointOption;
  destination: LatLng;
  stops: OptimizeRouteStop[];
};

/** Flat shape from the list endpoint (CollectionRequestListSerializer). */
type PickupRequestListItem = {
  id: string;
  items: PickupRequestItem[];
  full_name: string;
  email: string;
  status: PickupStatus;
  evaluation_status: PickupEvaluationStatus;
  price: string | null;
  request_type: PickupRequestType;
  pickup_address: string;
  requested_date: string | null;
  scheduled_at: string | null;
  delivered_quantity: string | null;
  route: RouteInfo | null;
};

/** Full shape from the retrieve/schedule/collect/cancel endpoints
 * (CollectionRequestDetailsSerializer) — assigned_collector/scheduled_by/
 * cancelled_by are StringRelatedFields on the backend, so they arrive as
 * plain display strings ("Full Name (email)"), not objects. */
type PickupRequestDetails = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  items: PickupRequestItem[];
  collection_point: PickupCollectionPoint;
  status: PickupStatus;
  evaluation_status: PickupEvaluationStatus;
  evaluated_by: string | null;
  evaluated_at: string | null;
  evaluation_note: string;
  price: string | null;
  request_type: PickupRequestType;
  pickup_address: string;
  photo: { file_key: string; public_url: string | null } | null;
  requested_date: string | null;
  scheduled_at: string | null;
  collected_at: string | null;
  delivered_quantity: string | null;
  route: RouteInfo | null;
  closed_by: string | null;
  closed_at: string | null;
  assigned_collector: string | null;
  scheduled_by: string | null;
  assigned_driver: string | null;
  driver_assigned_by: string | null;
  driver_assigned_at: string | null;
  cancelled_by: string | null;
  note: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
};

type PickupQuickRequestStatus = 'new' | 'contacted' | 'converted';

/** Flat shape from GET /pickups/quick/ — the Quick Leads tab's list. */
type PickupQuickRequestListItem = {
  id: string;
  request_type: PickupRequestType;
  phone_number: string;
  status: PickupQuickRequestStatus;
  collection_request: string | null;
  created_at: string;
};

/** A StaffProfile, as returned by GET /accounts/staff/ — used only to
 * populate the "collector" picker on the schedule action. */
type Collector = {
  id: string;
  employee_id: string;
  department: string;
  position: string;
  branch: string;
  user: {
    full_name: string;
    email: string;
  };
};

/** A DriverProfile, as returned by GET /accounts/drivers/ — used to
 * populate the "assign driver" picker, same shape as Collector. */
type Driver = {
  id: string;
  employee_id: string;
  department: string;
  position: string;
  branch: string;
  user: {
    full_name: string;
    email: string;
  };
};

const PICKUP_STATUS_LABELS: Record<PickupStatus, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  collected: 'Collected',
  delivered: 'Delivered',
  closed: 'Closed',
  cancelled: 'Cancelled',
};

const PICKUP_REQUEST_TYPE_LABELS: Record<PickupRequestType, string> = {
  individual: 'Individual',
  business: 'Business',
};

const PICKUP_EVALUATION_STATUS_LABELS: Record<PickupEvaluationStatus, string> =
  {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  };

const PICKUP_QUICK_REQUEST_STATUS_LABELS: Record<
  PickupQuickRequestStatus,
  string
> = {
  new: 'New',
  contacted: 'Contacted',
  converted: 'Converted',
};

/** The single, glanceable "what's happening" value a table/badge should
 * show — collapses `status` + `evaluation_status` into one state rather
 * than two separately-badged columns that often just repeat each other
 * ("Status: Pending" + "Evaluation: Pending"). Safe to collapse without
 * losing information: `evaluate()` on the backend only ever runs while
 * `status === 'pending'`, and `status` can only leave `pending` once
 * `evaluation_status === 'approved'` (see CollectionRequestDecisionService
 * .assign_driver/.schedule) — so `evaluation_status` only ever carries
 * real, distinct meaning (pending/rejected) during the `pending` stage;
 * every later stage implies "approved" on its own. */
type PickupStage = 'awaiting_review' | 'rejected' | 'approved' | PickupStatus;

const derivePickupStage = (
  status: PickupStatus,
  evaluationStatus: PickupEvaluationStatus,
): PickupStage => {
  if (status !== 'pending') return status;
  if (evaluationStatus === 'pending') return 'awaiting_review';
  if (evaluationStatus === 'rejected') return 'rejected';
  return 'approved';
};

/** "First item's category + N more" — the shared display convention
 * for anywhere a request's items need to fit in a single line (table
 * rows, compact previews). Not a comma list (unbounded width, hides
 * the count) and not a bare count badge (hides which material is
 * actually in it). First-by-submission-order is used as the anchor
 * since "largest quantity" has no defined meaning across mixed units
 * (10 computers vs. 3 kg of cable). */
const itemsSummary = (items: PickupRequestItem[]): string => {
  const first = items[0];
  if (!first) return '—';
  const extra = items.length - 1;
  return extra > 0
    ? `${first.category.name} +${extra} more`
    : first.category.name;
};

const PICKUP_STAGE_LABELS: Record<PickupStage, string> = {
  ...PICKUP_STATUS_LABELS,
  awaiting_review: 'Awaiting review',
  rejected: 'Rejected',
  // Approved but not yet assigned to a driver — distinct from the plain
  // "Pending" status label, which would otherwise still show for a
  // request that's actually already past the decision that mattered.
  approved: 'Approved',
};

export {
  derivePickupStage,
  itemsSummary,
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_QUICK_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STAGE_LABELS,
  PICKUP_STATUS_LABELS,
};
export type {
  CollectionPointOption,
  Collector,
  Driver,
  LatLng,
  OptimizeRouteResult,
  OptimizeRouteStop,
  PickupCategory,
  PickupCollectionPoint,
  PickupEvaluationStatus,
  PickupQuickRequestListItem,
  PickupQuickRequestStatus,
  PickupRequestDetails,
  PickupRequestItem,
  PickupRequestListItem,
  PickupRequestType,
  PickupStage,
  PickupStatus,
  RouteInfo,
};
