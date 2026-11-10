import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../../../../lib/api';
import { NOTIFICATIONS_CHANGED_EVENT } from '../events';
import { listNotifications } from '../services/notificationService';
import type { NotificationItem } from '../types';
import { useNotifications } from './useNotifications';

type UseNotificationsListParams = {
  page: number;
  unreadOnly?: boolean;
  onPageReset: (page: number) => void;
};

const useNotificationsList = ({
  page,
  unreadOnly = false,
  onPageReset,
}: UseNotificationsListParams) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);
  const { markRead, markAllRead, notifications: feed } = useNotifications();
  const feedRevision = feed
    .map((item) => `${item.id}:${item.is_read}`)
    .join(',');

  const refetch = useCallback(async () => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setLoading(true);
    setError('');
    try {
      const data = await listNotifications({
        page,
        isRead: unreadOnly ? false : undefined,
        signal: request.signal,
      });
      if (request.signal.aborted) return;
      setNotifications(data.results);
      setCount(data.count);
    } catch (err) {
      if (request.signal.aborted) return;
      if (err instanceof ApiError && err.status === 404 && page > 1) {
        onPageReset(1);
        return;
      }
      setError(
        err instanceof ApiError ? err.message : 'Could not load notifications.',
      );
    } finally {
      if (!request.signal.aborted) setLoading(false);
    }
  }, [page, unreadOnly, onPageReset]);

  useEffect(() => {
    refetch();
    return () => controller.current?.abort();
  }, [refetch, feedRevision]);

  useEffect(() => {
    const refreshVisible = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) refetch();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === NOTIFICATIONS_CHANGED_EVENT) refreshVisible();
    };
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshVisible);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refreshVisible);
    window.addEventListener('online', refreshVisible);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshVisible);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refreshVisible);
      window.removeEventListener('online', refreshVisible);
    };
  }, [refetch]);

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
