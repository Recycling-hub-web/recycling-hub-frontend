/** Flat shape from GET /audit/notifications/ (NotificationSerializer) —
 * a per-user, mutable (is_read) inbox row, generated server-side from
 * an AuditLog entry. Not the same thing as an ActivityLogEntry
 * (features/activity) — that's the immutable trail; this is what gets
 * surfaced to the recipient. */
type NotificationItem = {
  id: string;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
};

export type { NotificationItem };
