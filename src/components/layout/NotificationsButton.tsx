'use client';

import { useRouter } from 'next/navigation';
import { LuBell, LuCheckCheck } from 'react-icons/lu';

import { useNotifications } from '../features/notifications/hooks';
import type { NotificationItem } from '../features/notifications/types';
import { AppDate } from '../ui/date/AppDate';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { EmptyState } from '../ui/empty/EmptyState';

// Was a real shell with nothing to show (no backend existed yet) — now
// backed by useNotifications (polling, see its own docstring for why
// not websockets). Still the same Dropdown/bell shell, just a real
// body instead of a hardcoded EmptyState.
const NotificationsButton = () => {
  const router = useRouter();
  const { notifications, count, markRead, markAllRead } = useNotifications();

  const handleClick = (item: NotificationItem) => {
    if (!item.is_read) markRead(item.id);
    if (item.link) router.push(item.link);
  };

  return (
    <Dropdown
      panelClassName="top-12 end-0 w-80 rounded-2xl border border-slate-200 bg-white shadow-lg"
      button={
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        >
          <LuBell className="size-5" />
          {count > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-red-500" />
          )}
        </button>
      }
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-semibold text-slate-900">Notifications</p>
        {count > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-brand-600"
          >
            <LuCheckCheck className="size-3.5" />
            Mark all read
          </button>
        )}
      </div>
      {notifications.length === 0 ? (
        <EmptyState
          icon={<LuBell className="size-6" />}
          title="No notifications yet"
          description="You're all caught up — new activity will show up here."
        />
      ) : (
        <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
          {notifications.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleClick(item)}
              className={`block w-full px-4 py-3 text-left transition hover:bg-slate-50 ${
                item.is_read ? '' : 'bg-brand-50/50'
              }`}
            >
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
    </Dropdown>
  );
};

export { NotificationsButton };
