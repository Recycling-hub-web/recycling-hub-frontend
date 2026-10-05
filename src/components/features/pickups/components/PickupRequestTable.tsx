'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';

import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { AppDate } from '../../../ui/date/AppDate';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import { REQUEST_TYPE_BADGE_VARIANT, STATUS_BADGE_VARIANT } from '../constants';
import {
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STATUS_LABELS,
  type PickupRequestListItem,
} from '../types';

const PAGE_SIZE = 12;

type PickupRequestTableProps = {
  requests: PickupRequestListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  statusFilter: string;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** Base route this table's links point into — /admin/pickups or
   * /staff/pickups — so one component serves both role areas. Unlike
   * the contact table, there's no canDelete split here: admin and
   * staff have identical permissions on this module (see
   * CollectionRequestViewSet.get_permissions on the backend). */
  basePath: string;
  onDeleteRequest: (request: PickupRequestListItem) => void;
};

const columnCount = 7;

/** Pure presentational — every value it renders is a prop. */
const PickupRequestTable = ({
  requests,
  count,
  page,
  onPageChange,
  statusFilter,
  search,
  loading,
  error,
  onRetry,
  basePath,
  onDeleteRequest,
}: PickupRequestTableProps) => {
  const router = useRouter();

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
    if (requests.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (statusFilter) {
        emptySubtitle = 'Try a different status filter.';
      }
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No pickup requests found"
          subtitle={emptySubtitle}
        />
      );
    }
    return requests.map((r) => (
      <tr
        key={r.id}
        onClick={() => router.push(`${basePath}/${r.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="px-6 py-4 font-medium text-slate-900">{r.full_name}</td>
        <td className="px-6 py-4 text-slate-500">{r.email}</td>
        <td className="px-6 py-4 text-slate-700">{r.category.name}</td>
        <td className="px-6 py-4">
          <StatusBadge variant={REQUEST_TYPE_BADGE_VARIANT[r.request_type]}>
            {PICKUP_REQUEST_TYPE_LABELS[r.request_type]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[r.status]}>
            {PICKUP_STATUS_LABELS[r.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4 text-slate-500">
          {r.requested_date ? (
            <AppDate value={r.requested_date} format="short" />
          ) : (
            '—'
          )}
        </td>
        <td className="px-6 py-4">
          <div
            className="flex items-center justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`${basePath}/${r.id}`}
              aria-label={`View pickup request from ${r.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${r.id}/edit`}
              aria-label={`Edit pickup request from ${r.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDeleteRequest(r)}
              aria-label={`Delete pickup request from ${r.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >
              <LuTrash2 className="size-4" />
            </button>
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
          itemCount={requests.length}
          totalCount={count}
          itemLabel="pickup requests"
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
              Category
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Type
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Requested
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

export { PAGE_SIZE, PickupRequestTable };
