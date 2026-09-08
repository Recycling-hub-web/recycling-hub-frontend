'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuBuilding2, LuEye, LuPencil, LuTrash2 } from 'react-icons/lu';

import { StatusBadge } from '../../../ui/badges/StatusBadge';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../ui/table';
import { PARTNERSHIP_TYPE_LABELS, STATUS_BADGE_VARIANT } from '../constants';
import type { Partner } from '../types';

const PAGE_SIZE = 12;

type PartnerTableProps = {
  partners: Partner[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  typeFilter: string;
  statusFilter: string;
  search?: string;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** /admin/partnerships or /staff/partnerships — one component serves
   * both role areas, same as every other table this session. */
  basePath: string;
  onDeleteRequest: (partner: Partner) => void;
};

/** Pure presentational — every value it renders is a prop. Admin and
 * staff have identical permissions here (PartnerViewSet +
 * IsStaffOrReadOnly, both is_staff=True), same shape as Categories, so
 * no canDelete gate. */
const PartnerTable = ({
  partners,
  count,
  page,
  onPageChange,
  typeFilter,
  statusFilter,
  search,
  loading,
  error,
  onRetry,
  basePath,
  onDeleteRequest,
}: PartnerTableProps) => {
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
    if (partners.length === 0) {
      let emptySubtitle: string | undefined;
      if (search) {
        emptySubtitle = `No matches for "${search}".`;
      } else if (typeFilter || statusFilter) {
        emptySubtitle = 'Try a different filter.';
      }
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No partners found"
          subtitle={emptySubtitle}
        />
      );
    }
    return partners.map((p) => (
      <tr
        key={p.id}
        onClick={() => router.push(`${basePath}/${p.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[240px] px-6 py-4 font-medium text-slate-900">
          <div className="flex items-center gap-2.5">
            {p.logo.public_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
              <img
                src={p.logo.public_url}
                alt=""
                className="size-8 shrink-0 rounded-lg border border-slate-100 object-contain p-0.5"
              />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <LuBuilding2 className="size-4" />
              </span>
            )}
            <span className="truncate">{p.name}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-slate-500">
          {PARTNERSHIP_TYPE_LABELS[p.partnership_type]}
        </td>
        <td className="max-w-[200px] truncate px-6 py-4 text-slate-500">
          {p.website_url}
        </td>
        <td className="px-6 py-4">
          <StatusBadge
            variant={STATUS_BADGE_VARIANT[p.is_active ? 'active' : 'inactive']}
          >
            {p.is_active ? 'Active' : 'Inactive'}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <div
            className="flex items-center justify-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={`${basePath}/${p.id}`}
              aria-label={`View partner ${p.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuEye className="size-4" />
            </Link>
            <Link
              href={`${basePath}/${p.id}/edit`}
              aria-label={`Edit partner ${p.name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <LuPencil className="size-4" />
            </Link>
            <button
              type="button"
              onClick={() => onDeleteRequest(p)}
              aria-label={`Delete partner ${p.name}`}
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
          itemCount={partners.length}
          totalCount={count}
          itemLabel="partners"
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
              Type
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Website
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

export { PAGE_SIZE, PartnerTable };
