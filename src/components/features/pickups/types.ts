type PickupStatus = 'pending' | 'scheduled' | 'collected' | 'cancelled';

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

/** Flat shape from the list endpoint (CollectionRequestListSerializer). */
type PickupRequestListItem = {
  id: string;
  category: PickupCategory;
  full_name: string;
  email: string;
  status: PickupStatus;
  evaluation_status: PickupEvaluationStatus;
  price: string | null;
  request_type: PickupRequestType;
  requested_date: string | null;
  scheduled_at: string | null;
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
  category: PickupCategory;
  collection_point: PickupCollectionPoint;
  status: PickupStatus;
  evaluation_status: PickupEvaluationStatus;
  evaluated_by: string | null;
  evaluated_at: string | null;
  evaluation_note: string;
  price: string | null;
  request_type: PickupRequestType;
  pickup_address: string;
  estimated_quantity: string | null;
  quantity_unit: string;
  requested_date: string | null;
  scheduled_at: string | null;
  collected_at: string | null;
  collected_quantity: string | null;
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

export {
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_QUICK_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STATUS_LABELS,
};
export type {
  Collector,
  Driver,
  PickupCategory,
  PickupCollectionPoint,
  PickupEvaluationStatus,
  PickupQuickRequestListItem,
  PickupQuickRequestStatus,
  PickupRequestDetails,
  PickupRequestListItem,
  PickupRequestType,
  PickupStatus,
};
