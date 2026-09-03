'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuTrash2 } from 'react-icons/lu';

import {
  CONTACT_STATUS_LABELS,
  type ContactMessage,
} from '../../../../types/contact';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { AppDate } from '../../../ui/date/AppDate';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import { STATUS_BADGE_VARIANT } from '../constants';

const PAGE_SIZE = 12;

type ContactMessageTableProps = {
  messages: ContactMessage[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  statusFilter: string;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** Base route this table's links point into — /admin/contact or
   * /staff/contact — so one component serves both role areas. */
  basePath: string;
  /** Admin only, per ContactMessageViewSet.get_permissions on the
   * backend — staff genuinely can't delete, this isn't just a hidden
   * button, so the column itself only renders when true. */
  canDelete: boolean;
  onDeleteRequest?: (message: ContactMessage) => void;
};

/** Pure presentational — every value it renders is a prop. Data fetching
 * and mutation calls live in the hooks (useContactMessages/
 * useDeleteContactMessage), not here. Same shape as UserTable. */
const ContactMessageTable = ({
  messages,
  count,
  page,
  onPageChange,
  statusFilter,
  search,
  loading,
  error,
  onRetry,
  basePath,
  canDelete,
  onDeleteRequest,
}: ContactMessageTableProps) => {
  const router = useRouter();
  const columnCount = canDelete ? 6 : 5;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={onRetry}
        />
      );
    if (messages.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (statusFilter) {
        emptySubtitle = 'Try a different status filter.';
      }
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No messages found"
          subtitle={emptySubtitle}
        />
      );
    }
    return messages.map((m) => (
      <tr
        key={m.id}
        onClick={() => router.push(`${basePath}/${m.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="px-6 py-4 font-medium text-slate-900">
          <Link
            href={`${basePath}/${m.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:text-brand-600 hover:underline"
          >
            {m.full_name}
          </Link>
        </td>
        <td className="px-6 py-4 text-slate-500">{m.email}</td>
        <td className="max-w-xs truncate px-6 py-4 text-slate-700">
          {m.subject}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[m.status]}>
            {CONTACT_STATUS_LABELS[m.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={m.submitted_at} format="short" />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`${basePath}/${m.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View message from ${m.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            {canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRequest?.(m);
                }}
                aria-label={`Delete message from ${m.full_name}`}
                className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              >
                <LuTrash2 className="size-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <TableWrapper
      footer={
        <TablePagination
          currentPage={page}
          onPageChange={onPageChange}
          itemsPerPage={PAGE_SIZE}
          itemCount={messages.length}
          totalCount={count}
          itemLabel="messages"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Email
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Subject
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Submitted
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { ContactMessageTable, PAGE_SIZE };
