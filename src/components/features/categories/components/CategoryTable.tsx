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
import { STATUS_BADGE_VARIANT } from '../constants';
import type { CategoryListItem } from '../types';

const PAGE_SIZE = 12;

type CategoryTableProps = {
  categories: CategoryListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  statusFilter: string;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/categories or /staff/categories — one component serves both
   * role areas, same as ContactMessageTable. */
  basePath: string;
  /** Name lookup for the Parent column — built from the currently loaded
   * page(s) of categories. A parent sitting on a page that hasn't been
   * fetched yet won't resolve; falls back to "—" (same documented
   * limitation as the edit form's Parent picker — today's ~7 real
   * categories all fit on one page). */
  parentNameById: Record<string, string>;
  onDeleteRequest: (category: CategoryListItem) => void;
};

/** Pure presentational — every value it renders is a prop. Same shape as
 * ContactMessageTable. Admin and staff have identical permissions on
 * categories (verified against CategoryViewSet), so unlike Contact's
 * table there's no canDelete gate — View/Edit/Delete always all render. */
const CategoryTable = ({
  categories,
  count,
  page,
  onPageChange,
  statusFilter,
  search,
  loading,
  error,
  onRetry,
  basePath,
  parentNameById,
  onDeleteRequest,
}: CategoryTableProps) => {
  const router = useRouter();
  const columnCount = 5;

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
    if (categories.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (statusFilter) {
        emptySubtitle = 'Try a different status filter.';
      }
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No categories found"
          subtitle={emptySubtitle}
        />
      );
    }
    return categories.map((c) => (
      <tr
        key={c.id}
        onClick={() => router.push(`${basePath}/${c.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[220px] px-6 py-4 font-medium text-slate-900">
          <Link
            href={`${basePath}/${c.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 truncate hover:text-brand-600 hover:underline"
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: c.hex_color }}
              aria-hidden
            />
            <span className="truncate">{c.name}</span>
          </Link>
        </td>
        <td className="max-w-xs truncate px-6 py-4 text-slate-500">
          {c.description || '—'}
        </td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-500">
          {c.parent ? parentNameById[c.parent] ?? '—' : '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge
            variant={STATUS_BADGE_VARIANT[c.is_active ? 'active' : 'inactive']}
          >
            {c.is_active ? 'Active' : 'Inactive'}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            <Link
              href={`${basePath}/${c.id}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View category ${c.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${c.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`Edit category ${c.name}`}
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
              aria-label={`Delete category ${c.name}`}
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
          itemCount={categories.length}
          totalCount={count}
          itemLabel="categories"
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
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Parent
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

export { CategoryTable, PAGE_SIZE };
