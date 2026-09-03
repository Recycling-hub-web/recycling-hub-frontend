type PickupStatus = 'pending' | 'scheduled' | 'collected' | 'cancelled';

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
  pickup_address: string;
  estimated_quantity: string | null;
  quantity_unit: string;
  requested_date: string | null;
  scheduled_at: string | null;
  collected_at: string | null;
  collected_quantity: string | null;
  assigned_collector: string | null;
  scheduled_by: string | null;
  cancelled_by: string | null;
  note: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
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

const PICKUP_STATUS_LABELS: Record<PickupStatus, string> = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  collected: 'Collected',
  cancelled: 'Cancelled',
};

export { PICKUP_STATUS_LABELS };
export type {
  Collector,
  PickupCategory,
  PickupCollectionPoint,
  PickupRequestDetails,
  PickupRequestListItem,
  PickupStatus,
};
