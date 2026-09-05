'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';

import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import type { ClassificationListItem } from '../types';

const PAGE_SIZE = 12;

type ClassificationTableProps = {
  classifications: ClassificationListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/classifications or /staff/classifications — one component
   * serves both role areas, same as CategoryTable. */
  basePath: string;
  onDeleteRequest: (classification: ClassificationListItem) => void;
};

/** Pure presentational — every value it renders is a prop. Same shape as
 * CategoryTable/ContactMessageTable. Admin and staff have identical
 * permissions here (IsAdminOrStaffUser), so no canDelete gate. */
const ClassificationTable = ({
  classifications,
  count,
  page,
  onPageChange,
  search,
  loading,
  error,
  onRetry,
  basePath,
  onDeleteRequest,
}: ClassificationTableProps) => {
  const router = useRouter();
  const columnCount = 3;

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
    if (classifications.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No classifications found"
          subtitle={search ? `No matches for "${search}".` : undefined}
        />
      );
    }
    return classifications.map((c) => (
      <tr
        key={c.id}
        onClick={() => router.push(`${basePath}/${c.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[220px] px-6 py-4 font-medium text-slate-900">
          <Link
            href={`${basePath}/${c.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block truncate hover:text-brand-600 hover:underline"
          >
            {c.name}
          </Link>
        </td>
        <td className="max-w-md truncate px-6 py-4 text-slate-500">
          {c.description || '—'}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`${basePath}/${c.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View classification ${c.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${c.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Edit classification ${c.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(c);
              }}
              aria-label={`Delete classification ${c.name}`}
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
          itemCount={classifications.length}
          totalCount={count}
          itemLabel="classifications"
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
              Description
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

export { ClassificationTable, PAGE_SIZE };
