import { useCallback, useEffect, useState } from 'react';

import {
  NOTIFICATIONS_CHANGED_EVENT,
  notifyNotificationsChanged,
} from '../events';
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService';
import type { NotificationItem } from '../types';

const POLL_INTERVAL_MS = 30_000;

/** Polling, not websockets — refetches on a short interval and on
 * window focus, same reasoning already applied elsewhere in this
 * project for starting simple (free-tier hosting, no custom route
 * solver, etc.): this team's scale doesn't justify real-time
 * infrastructure yet. A failed poll stays silent (no error state) and
 * just retries next tick — a background refresh isn't worth
 * interrupting the UI over. */
const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const [list, unread] = await Promise.all([
        listNotifications(),
        getUnreadCount(),
      ]);
      setNotifications(list.results);
      setCount(unread.count);
    } catch {
      // Silent on purpose — see docstring above.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, POLL_INTERVAL_MS);
    window.addEventListener('focus', refetch);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refetch);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refetch);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refetch);
    };
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

  return { notifications, count, loading, refetch, markRead, markAllRead };
};

export { useNotifications };
