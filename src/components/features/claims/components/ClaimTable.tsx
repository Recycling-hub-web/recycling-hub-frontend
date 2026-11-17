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
  /** Role-scoped details route. Payment-capable roles also get selection
   * controls; staff and drivers retain a read-only table. */
  basePath: string;
  claims: ClaimListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  selectedIds?: Set<string>;
  selectedDriverId?: string;
  onSelect?: (claim: ClaimListItem) => void;
  onSelectPage?: (claims: ClaimListItem[]) => void;
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
  selectedIds = new Set(),
  selectedDriverId,
  onSelect,
  onSelectPage,
}: ClaimTableProps) => {
  const router = useRouter();
  const columnCount = onSelect ? 7 : 6;
  const eligibleOnPage = claims.filter(
    (claim) =>
      claim.status === 'pending' && claim.driver.id === selectedDriverId,
  );
  const pageSelected =
    eligibleOnPage.length > 0 &&
    eligibleOnPage.every((claim) => selectedIds.has(claim.id));

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
        data-claim-id={c.id}
        onClick={() => router.push(`${basePath}/${c.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        {onSelect && (
          <td className="w-12 p-4" onClick={(event) => event.stopPropagation()}>
            <input
              type="checkbox"
              className="size-4 accent-brand-600"
              checked={selectedIds.has(c.id)}
              disabled={
                c.status !== 'pending' ||
                Boolean(selectedDriverId && selectedDriverId !== c.driver.id) ||
                (selectedIds.size >= 100 && !selectedIds.has(c.id))
              }
              aria-label={`Select claim for ${c.driver.full_name}: ${CLAIM_CATEGORY_LABELS[c.category]}, RM ${c.amount_approved ?? c.amount_claimed}, ${c.date}`}
              onChange={() => onSelect(c)}
            />
          </td>
        )}
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
            {onSelect && (
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select this driver's pending claims on this page"
                  className="size-4 accent-brand-600"
                  checked={pageSelected}
                  disabled={
                    !selectedDriverId ||
                    eligibleOnPage.length === 0 ||
                    loading ||
                    Boolean(error)
                  }
                  onChange={() => onSelectPage?.(eligibleOnPage)}
                />
              </th>
            )}
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
