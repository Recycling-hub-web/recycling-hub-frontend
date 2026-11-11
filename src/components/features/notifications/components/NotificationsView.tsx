'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuBell, LuCheckCheck } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { PageContainer } from '../../../layout/PageContainer';
import { AppDate } from '../../../ui/date/AppDate';
import { EmptyState } from '../../../ui/empty/EmptyState';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { TablePagination } from '../../../ui/table';
import { Tabs } from '../../../ui/tabs';
import { useNotifications, useNotificationsList } from '../hooks';
import { NOTIFICATION_MODULE_LABELS, type NotificationItem } from '../types';
import { notificationLink } from '../utils/notificationLinks';

const PAGE_SIZE = 12;

/** Every role's own full Notifications page — same data as
 * NotificationsButton's dropdown, just paginated and persistent rather
 * than a transient panel. One shared component, mounted at each role's
 * own route (/admin/notifications, /staff/notifications, …) same
 * pattern as every other cross-role feature in this app. */
const NotificationsView = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [module, setModule] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { user } = useAuth();
  const { count: unreadCount, markingAll, pendingIds } = useNotifications();
  const {
    notifications,
    count,
    loading,
    error,
    refetch,
    markRead,
    markAllRead,
  } = useNotificationsList({
    page,
    module: module || undefined,
    unreadOnly: filter === 'unread',
    onPageReset: setPage,
  });

  const handleClick = async (item: NotificationItem) => {
    if (!item.is_read) await markRead(item.id);
    const link = notificationLink(item, user?.role);
    if (link) router.push(link);
  };

  const renderBody = () => {
    if (loading) return <Loading text="Loading notifications…" />;
    if (error) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}{' '}
          <button
            type="button"
            onClick={refetch}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      );
    }
    if (notifications.length === 0) {
      return (
        <EmptyState
          icon={<LuBell className="size-6" />}
          title={
            filter === 'unread'
              ? 'No unread notifications'
              : 'No notifications yet'
          }
          description="You're all caught up — new activity will show up here."
        />
      );
    }
    return (
      <div className="space-y-2">
        {notifications.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item)}
            disabled={pendingIds.has(item.id)}
            className={`block w-full rounded-xl px-4 py-3.5 text-left transition hover:bg-slate-100 ${
              item.is_read ? 'bg-slate-50' : 'bg-brand-50'
            }`}
          >
            {item.module && (
              <p className="mb-1 text-xs font-medium text-brand-700">
                {NOTIFICATION_MODULE_LABELS[item.module] || item.module}
              </p>
            )}
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            {item.body && (
              <p className="mt-0.5 text-sm text-slate-500">{item.body}</p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              <AppDate value={item.created_at} format="relative" />
            </p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Notifications"
        subtitle="Everything that's happened that needs your attention."
        actions={
          unreadCount > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              disabled={markingAll}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <LuCheckCheck className="size-4" />
              {markingAll ? 'Saving…' : 'Mark all read'}
            </button>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Tabs
          tabs={[
            { key: 'all', label: 'All' },
            { key: 'unread', label: `Unread (${unreadCount})` },
          ]}
          active={filter}
          onChange={(value) => {
            setFilter(value);
            setPage(1);
          }}
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Module
          <select
            aria-label="Notification module"
            value={module}
            onChange={(event) => {
              setModule(event.target.value);
              setPage(1);
            }}
            className="min-h-11 rounded-lg border border-slate-200 bg-white px-3"
          >
            <option value="">All modules</option>
            {Object.entries(NOTIFICATION_MODULE_LABELS).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </label>
        <button
          type="button"
          onClick={refetch}
          disabled={loading}
          className="text-sm font-medium text-brand-600 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>
      {renderBody()}

      {!loading && !error && count > PAGE_SIZE && (
        <TablePagination
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={PAGE_SIZE}
          itemCount={notifications.length}
          totalCount={count}
          itemLabel="notifications"
          loading={loading}
        />
      )}
    </PageContainer>
  );
};

export { NotificationsView };
