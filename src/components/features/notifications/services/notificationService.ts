import { apiFetch } from '../../../../lib/api';
import type { NotificationItem } from '../types';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ListNotificationsParams = {
  page?: number;
};

// All under /audit/notifications/ — see NotificationViewSet on the
// backend. Every authenticated role has their own inbox (no admin-only
// gate, unlike /audit/ itself).
const listNotifications = ({ page = 1 }: ListNotificationsParams = {}): Promise<
  Paginated<NotificationItem>
> => apiFetch(`/audit/notifications/?page=${page}`);

const getUnreadCount = (): Promise<{ count: number }> =>
  apiFetch('/audit/notifications/unread-count/');

const markNotificationRead = (id: string): Promise<NotificationItem> =>
  apiFetch(`/audit/notifications/${id}/mark-read/`, { method: 'POST' });

const markAllNotificationsRead = (): Promise<{ detail: string }> =>
  apiFetch('/audit/notifications/mark-all-read/', { method: 'POST' });

export {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
};
export type { ListNotificationsParams, Paginated };
