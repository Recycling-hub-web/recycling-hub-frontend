/** Flat shape from GET /audit/notifications/ (NotificationSerializer) —
 * a per-user, mutable (is_read) inbox row, generated server-side from
 * an AuditLog entry. Not the same thing as an ActivityLogEntry
 * (features/activity) — that's the immutable trail; this is what gets
 * surfaced to the recipient. */
type NotificationItem = {
  module?: string | null;
  action?: string | null;
  id: string;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
};

export type { NotificationItem };

const NOTIFICATION_MODULE_LABELS: Record<string, string> = {
  pickups: 'Pickups',
  finance: 'Finance',
  claims: 'Claims & vehicles',
  accounts: 'Accounts & banks',
  contact: 'Contact',
  opportunities: 'Opportunities',
  categories: 'Categories',
  collection_points: 'Collection points',
  service_areas: 'Service areas',
  partnerships: 'Partnerships',
  blogs: 'Blog content',
  storage: 'Storage',
  system: 'System settings',
};
export { NOTIFICATION_MODULE_LABELS };
