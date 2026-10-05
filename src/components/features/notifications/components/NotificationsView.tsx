'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LuBell, LuCheckCheck } from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { AppDate } from '../../../ui/date/AppDate';
import { EmptyState } from '../../../ui/empty/EmptyState';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { TablePagination } from '../../../ui/table';
import { useNotificationsList } from '../hooks';
import type { NotificationItem } from '../types';

const PAGE_SIZE = 12;

/** Every role's own full Notifications page — same data as
 * NotificationsButton's dropdown, just paginated and persistent rather
 * than a transient panel. One shared component, mounted at each role's
 * own route (/admin/notifications, /staff/notifications, …) same
 * pattern as every other cross-role feature in this app. */
const NotificationsView = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const {
    notifications,
    count,
    loading,
    error,
    refetch,
    markRead,
    markAllRead,
  } = useNotificationsList({ page });

  const handleClick = (item: NotificationItem) => {
    if (!item.is_read) markRead(item.id);
    if (item.link) router.push(item.link);
  };

  const hasUnread = notifications.some((item) => !item.is_read);

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
          title="No notifications yet"
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
            className={`block w-full rounded-xl px-4 py-3.5 text-left transition hover:bg-slate-100 ${
              item.is_read ? 'bg-slate-50' : 'bg-brand-50'
            }`}
          >
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
          hasUnread ? (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <LuCheckCheck className="size-4" />
              Mark all read
            </button>
          ) : undefined
        }
      />

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
