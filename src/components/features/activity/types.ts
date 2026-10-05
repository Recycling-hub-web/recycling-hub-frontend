type ActivityModule =
  | 'accounts'
  | 'pickups'
  | 'finance'
  | 'categories'
  | 'classifications'
  | 'storage'
  | 'contact'
  | 'opportunities'
  | 'partnerships'
  | 'blogs'
  | 'collection_points'
  | 'service_areas';

type ActivityAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'status_changed'
  | 'approved'
  | 'rejected'
  | 'scheduled'
  | 'assigned'
  | 'collected'
  | 'cancelled'
  | 'deactivated'
  | 'reactivated'
  | 'invited'
  | 'contacted'
  | 'converted'
  | 'uploaded';

/** Flat shape from GET /audit/ (AuditLogSerializer). `details` is a
 * free-form JSON object whose keys depend on `action` (e.g. `price` for
 * `approved`, `reason` for `rejected`/`cancelled`) — rendered generically
 * as key/value pairs rather than modeled per-action. */
type ActivityLogEntry = {
  id: string;
  actor_name: string;
  actor_role: string;
  module: ActivityModule;
  action: ActivityAction;
  entity_type: string;
  object_id: string;
  details: Record<string, unknown>;
  created_at: string;
};

const MODULE_LABELS: Record<ActivityModule, string> = {
  accounts: 'Accounts',
  pickups: 'Pickups',
  finance: 'Finance',
  categories: 'Categories',
  classifications: 'Classifications',
  storage: 'Storage',
  contact: 'Contact',
  opportunities: 'Opportunities',
  partnerships: 'Partnerships',
  blogs: 'Blogs',
  collection_points: 'Collection Points',
  service_areas: 'Service Areas',
};

const ACTION_LABELS: Record<ActivityAction, string> = {
  created: 'Created',
  updated: 'Updated',
  deleted: 'Deleted',
  status_changed: 'Status changed',
  approved: 'Approved',
  rejected: 'Rejected',
  scheduled: 'Scheduled',
  assigned: 'Assigned',
  collected: 'Collected',
  cancelled: 'Cancelled',
  deactivated: 'Deactivated',
  reactivated: 'Reactivated',
  invited: 'Invited',
  contacted: 'Contacted',
  converted: 'Converted',
  uploaded: 'Uploaded',
};

export { ACTION_LABELS, MODULE_LABELS };
export type { ActivityAction, ActivityLogEntry, ActivityModule };
