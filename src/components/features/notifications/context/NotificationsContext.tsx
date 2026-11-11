'use client';

import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { useToast } from '../../../ui/toast/ToastContext';
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

type NotificationsState = {
  notifications: NotificationItem[];
  count: number;
  loading: boolean;
  error: string;
  markingAll: boolean;
  pendingIds: Set<string>;
  refetch: () => Promise<void>;
  markRead: (id: string) => Promise<boolean>;
  markAllRead: () => Promise<boolean>;
};

const NotificationsContext = createContext<NotificationsState | null>(null);

// One session-scoped feed shared by desktop bell, mobile navigation and inbox.
const NotificationSession = ({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const requests = useRef(new Set<string>());
  const markingAllRef = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const { error: showError } = useToast();

  const refetch = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    try {
      const [list, unread] = await Promise.all([
        listNotifications({ signal: request.signal }),
        getUnreadCount(request.signal),
      ]);
      if (request.signal.aborted) return;
      setNotifications(list.results);
      setCount(unread.count);
      setError('');
    } catch {
      if (!request.signal.aborted) setError('Could not refresh notifications.');
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    const refreshVisible = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) refetch();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === NOTIFICATIONS_CHANGED_EVENT) refreshVisible();
    };
    refreshVisible();
    const timer = setInterval(refreshVisible, POLL_INTERVAL_MS);
    window.addEventListener('focus', refreshVisible);
    window.addEventListener('online', refreshVisible);
    document.addEventListener('visibilitychange', refreshVisible);
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshVisible);
    window.addEventListener('storage', onStorage);
    return () => {
      clearInterval(timer);
      controller.current?.abort();
      window.removeEventListener('focus', refreshVisible);
      window.removeEventListener('online', refreshVisible);
      document.removeEventListener('visibilitychange', refreshVisible);
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshVisible);
      window.removeEventListener('storage', onStorage);
    };
  }, [refetch]);

  const markRead = useCallback(
    async (id: string) => {
      if (requests.current.has(id)) return false;
      requests.current.add(id);
      setPendingIds(new Set(requests.current));
      try {
        await markNotificationRead(id);
        controller.current?.abort();
        setNotifications((items) =>
          items.map((item) =>
            item.id === id ? { ...item, is_read: true } : item,
          ),
        );
        notifyNotificationsChanged();
        return true;
      } catch {
        showError('Could not mark notification as read', 'Please try again.');
        return false;
      } finally {
        requests.current.delete(id);
        setPendingIds(new Set(requests.current));
      }
    },
    [showError],
  );

  const markAllRead = useCallback(async () => {
    if (markingAllRef.current) return false;
    markingAllRef.current = true;
    setMarkingAll(true);
    try {
      await markAllNotificationsRead();
      controller.current?.abort();
      setNotifications((items) =>
        items.map((item) => ({ ...item, is_read: true })),
      );
      setCount(0);
      notifyNotificationsChanged();
      return true;
    } catch {
      showError('Could not mark notifications as read', 'Please try again.');
      return false;
    } finally {
      markingAllRef.current = false;
      setMarkingAll(false);
    }
  }, [showError]);

  const value = useMemo(
    () => ({
      notifications,
      count,
      loading,
      error,
      markingAll,
      pendingIds,
      refetch,
      markRead,
      markAllRead,
    }),
    [
      notifications,
      count,
      loading,
      error,
      markingAll,
      pendingIds,
      refetch,
      markRead,
      markAllRead,
    ],
  );
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  // Changing accounts destroys all prior inbox state and in-flight requests.
  return (
    <NotificationSession key={user?.id ?? 'signed-out'} enabled={!!user}>
      {children}
    </NotificationSession>
  );
};

const useNotificationsContext = () => {
  const value = useContext(NotificationsContext);
  if (!value)
    throw new Error('Notifications must be used inside NotificationsProvider');
  return value;
};

export { NotificationsProvider, useNotificationsContext };
