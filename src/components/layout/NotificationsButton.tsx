'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuBell, LuCheckCheck } from 'react-icons/lu';

import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../features/notifications/hooks';
import {
  NOTIFICATION_MODULE_LABELS,
  type NotificationItem,
} from '../features/notifications/types';
import {
  notificationInboxPath,
  notificationLink,
} from '../features/notifications/utils/notificationLinks';
import { AppDate } from '../ui/date/AppDate';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { EmptyState } from '../ui/empty/EmptyState';
import { Loading } from '../ui/loading/Loading';

// Was a real shell with nothing to show (no backend existed yet) — now
// backed by useNotifications (polling, see its own docstring for why
// not websockets). Still the same Dropdown/bell shell, just a real
// body instead of a hardcoded EmptyState.
const NotificationsButton = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    notifications,
    count,
    loading,
    error,
    refetch,
    markingAll,
    pendingIds,
    markRead,
    markAllRead,
  } = useNotifications();

  const handleClick = async (item: NotificationItem) => {
    if (!item.is_read) await markRead(item.id);
    const link = notificationLink(item, user?.role);
    if (link) router.push(link);
  };

  return (
    <Dropdown
      closeOnSelect
      // The bell isn't the rightmost header item (the account menu sits
      // to its right — see Topbar), so a fixed-width panel anchored to
      // it with `end-0` can run off the left edge of a narrow viewport
      // (see Dropdown's own panelClassName doc). Fixed to the viewport
      // with equal side margins below `sm`; the normal button-anchored
      // popover from `sm` up, where there's enough room.
      panelClassName="fixed inset-x-4 top-16 sm:absolute sm:inset-x-auto sm:end-0 sm:top-12 sm:w-80 rounded-2xl border border-slate-200 bg-white shadow-lg"
      button={
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-11 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:size-9"
        >
          <LuBell className="size-5" />
          <span className="sr-only">{count} unread</span>
          {count > 0 && (
            <span className="system-notification-dot absolute right-2.5 top-2.5 flex size-2 rounded-full bg-red-500 lg:right-1.5 lg:top-1.5" />
          )}
        </button>
      }
    >
      <div data-testid="notifications-panel">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <p className="text-sm font-semibold text-slate-900">Notifications</p>
          {count > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-brand-600"
            >
              <LuCheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>
        {loading && <Loading text="Loading notifications…" />}
        {error && (
          <div className="p-4 text-sm text-red-700" role="status">
            {error}{' '}
            <button
              type="button"
              onClick={refetch}
              className="font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && notifications.length === 0 && (
          <EmptyState
            icon={<LuBell className="size-6" />}
            title="No notifications yet"
            description="You're all caught up — new activity will show up here."
          />
        )}
        {notifications.length > 0 && (
          <div
            data-lenis-prevent
            className="max-h-96 divide-y divide-slate-100 overflow-y-auto overscroll-contain"
          >
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item)}
                disabled={pendingIds.has(item.id)}
                className={`block w-full px-4 py-3 text-left transition hover:bg-slate-50 ${
                  item.is_read ? '' : 'bg-brand-50/50'
                }`}
              >
                {item.module && (
                  <p className="mb-1 text-xs font-medium text-brand-700">
                    {NOTIFICATION_MODULE_LABELS[item.module] || item.module}
                  </p>
                )}
                <p className="text-sm font-semibold text-slate-900">
                  {item.title}
                </p>
                {item.body && (
                  <p className="mt-0.5 text-xs text-slate-500">{item.body}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  <AppDate value={item.created_at} format="relative" />
                </p>
              </button>
            ))}
          </div>
        )}
        <Link
          href={notificationInboxPath(user?.role)}
          className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-semibold text-brand-600"
        >
          View all notifications
        </Link>
      </div>
    </Dropdown>
  );
};

export { NotificationsButton };
