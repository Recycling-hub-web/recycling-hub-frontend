'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';

import { StatusBadge } from '../../../ui/badges/StatusBadge';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import type { CollectionPoint } from '../types';

const PAGE_SIZE = 12;

type CollectionPointTableProps = {
  collectionPoints: CollectionPoint[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/collection-points or /staff/collection-points — one
   * component serves both role areas, same as ClassificationTable. */
  basePath: string;
  onDeleteRequest: (collectionPoint: CollectionPoint) => void;
};

/** Pure presentational — every value it renders is a prop. Admin and
 * staff have identical permissions here (IsAdminOrStaffUser on every
 * write action), so no canDelete gate, same as Classifications. */
const CollectionPointTable = ({
  collectionPoints,
  count,
  page,
  onPageChange,
  search,
  loading,
  error,
  onRetry,
  basePath,
  onDeleteRequest,
}: CollectionPointTableProps) => {
  const router = useRouter();
  const columnCount = 4;

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
    if (collectionPoints.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No collection points found"
          subtitle={search ? `No matches for "${search}".` : undefined}
        />
      );
    }
    return collectionPoints.map((cp) => (
      <tr
        key={cp.id}
        onClick={() => router.push(`${basePath}/${cp.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[220px] truncate px-6 py-4 font-medium text-slate-900">
          {cp.name}
        </td>
        <td className="max-w-md truncate px-6 py-4 text-slate-500">
          {cp.address}, {cp.city}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={cp.is_active ? 'success' : 'neutral'}>
            {cp.is_active ? 'Active' : 'Inactive'}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`${basePath}/${cp.id}`}
              aria-label={`View collection point ${cp.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${cp.id}/edit`}
              aria-label={`Edit collection point ${cp.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDeleteRequest(cp)}
              aria-label={`Delete collection point ${cp.name}`}
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
          itemCount={collectionPoints.length}
          totalCount={count}
          itemLabel="collection points"
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
              Address
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
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

export { CollectionPointTable, PAGE_SIZE };
