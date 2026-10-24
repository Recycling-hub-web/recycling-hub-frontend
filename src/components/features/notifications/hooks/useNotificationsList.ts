import { useCallback, useEffect, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import {
  NOTIFICATIONS_CHANGED_EVENT,
  notifyNotificationsChanged,
} from '../events';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService';
import type { NotificationItem } from '../types';

type UseNotificationsListParams = {
  page: number;
};

/** The full, paginated Notifications page — distinct from
 * useNotifications (the bell's lightweight polling hook, first page
 * only). No polling here: a visited page re-fetches on demand
 * (page change, mark-read/mark-all-read), it doesn't need a background
 * refresh timer. */
const useNotificationsList = ({ page }: UseNotificationsListParams) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listNotifications({ page });
      setNotifications(data.results);
      setCount(data.count);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not load notifications.',
      );
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // So marking read from the bell (a different hook instance) updates
  // this page too, without waiting on a poll tick — see events.ts.
  useEffect(() => {
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refetch);
    return () =>
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refetch);
  }, [refetch]);

  const markRead = async (id: string) => {
    await markNotificationRead(id);
    refetch();
    notifyNotificationsChanged();
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    refetch();
    notifyNotificationsChanged();
  };

  return {
    notifications,
    count,
    loading,
    error,
    refetch,
    markRead,
    markAllRead,
  };
};

export { useNotificationsList };
