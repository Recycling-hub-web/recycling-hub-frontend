'use client';

import { useRouter } from 'next/navigation';
import { LuReceipt } from 'react-icons/lu';

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
import type { ClaimListItem } from '../types';
import { CLAIM_CATEGORY_LABELS, CLAIM_STATUS_LABELS } from '../types';

const PAGE_SIZE = 12;

type ClaimTableProps = {
  /** Role-scoped base route (`/driver/claims`, `/staff/claims`,
   * `/accounting/claims`, `/admin/claims`, `/super-admin/claims`) — rows
   * link into `${basePath}/${id}`. All review actions (Approve/Reject/
   * Mark as Paid) live on the details page's ActionsDropdown, not here —
   * so this table renders identically for every role; a driver only
   * ever sees their own rows (scoped server-side), and staff is
   * read-only the same way it's read-only everywhere else on this
   * table. */
  basePath: string;
  claims: ClaimListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
};

const ClaimTable = ({
  basePath,
  claims,
  count,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
}: ClaimTableProps) => {
  const router = useRouter();
  const columnCount = 6;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error) {
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={onRetry}
        />
      );
    }
    if (claims.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          icon={<LuReceipt className="size-6" />}
          title="No expense claims yet"
          subtitle="Petrol and tool reimbursement claims will show up here."
        />
      );
    }
    return claims.map((c) => (
      <tr
        key={c.id}
        onClick={() => router.push(`${basePath}/${c.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="max-w-[160px] truncate px-6 py-4 font-medium text-slate-900">
          {c.driver.full_name}
        </td>
        <td className="px-6 py-4 text-slate-700">
          {CLAIM_CATEGORY_LABELS[c.category]}
        </td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-700">
          {c.vehicle ? c.vehicle.plate_number : '—'}
        </td>
        <td className="px-6 py-4 font-medium text-slate-900">
          {c.amount_approved ?? c.amount_claimed}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[c.status]}>
            {CLAIM_STATUS_LABELS[c.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={c.date} format="short" />
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
          itemCount={claims.length}
          totalCount={count}
          itemLabel="claims"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Driver
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Category
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Amount
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { ClaimTable, PAGE_SIZE };
