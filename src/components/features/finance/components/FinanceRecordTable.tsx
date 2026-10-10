'use client';

import { useRouter } from 'next/navigation';
import { LuWalletCards } from 'react-icons/lu';

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
import type { FinanceRecordListItem } from '../types';
import { FINANCE_PAYMENT_METHOD_LABELS, FINANCE_STATUS_LABELS } from '../types';

const PAGE_SIZE = 12;

type FinanceRecordTableProps = {
  /** Role-scoped base route (`/admin/finance`, `/staff/finance`,
   * `/accounting/finance`, `/driver/finance`) — rows link into
   * `${basePath}/${id}`. */
  basePath: string;
  records: FinanceRecordListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry: () => void;
  /** Bulk multi-select, scoped to this table only — no other table in
   * this project needs it yet, so this isn't a shared/generic
   * capability (see features/finance's Verify & Reimburse flow). Only
   * `claimed` rows are selectable; everything else has nothing to
   * verify yet. */
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  /** Opens the Verify & Reimburse modal for these ids — the table
   * never calls the API directly, since the modal also collects an
   * optional reimbursement proof. */
  onRequestReimburse: (ids: string[]) => void;
  /** False on the driver's own read-only view — no checkboxes or
   * per-row action, since a driver can't Verify & Reimburse anyway
   * (403 on the backend). */
  canManage: boolean;
};

/** One row per approved, priced pickup request (see FinanceRecord on
 * the backend). Driver-collected rows carry payout info; staff-collected
 * ones never move past `pending` (see collect() — nothing to claim or
 * reimburse there). Icon-only row action with a tooltip, never a text
 * button inside the table (standing convention) — clicking the row
 * itself opens the details page; the checkbox and action icon stop
 * that from firing. */
const FinanceRecordTable = ({
  basePath,
  records,
  count,
  page,
  onPageChange,
  loading,
  error,
  onRetry,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onRequestReimburse,
  canManage,
}: FinanceRecordTableProps) => {
  const router = useRouter();
  const columnCount = canManage ? 9 : 7;
  const claimedRecords = records.filter((r) => r.status === 'claimed');
  const allClaimedSelected =
    claimedRecords.length > 0 &&
    claimedRecords.every((r) => selectedIds.has(r.id));

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
    if (records.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="No finance records yet"
          subtitle="Priced, approved pickup requests will show up here."
        />
      );
    }
    return records.map((r) => (
      <tr
        key={r.id}
        onClick={() => router.push(`${basePath}/${r.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        {canManage && (
          <td className="p-4" onClick={(e) => e.stopPropagation()}>
            {r.status === 'claimed' && (
              <input
                type="checkbox"
                checked={selectedIds.has(r.id)}
                onChange={() => onToggleSelect(r.id)}
                className="size-4 rounded border-slate-300"
                aria-label={`Select ${r.collection_request.full_name}`}
              />
            )}
          </td>
        )}
        <td className="px-6 py-4 font-medium text-slate-900">
          {r.collection_request.full_name}
        </td>
        <td className="px-6 py-4 text-slate-700">
          {r.driver ? r.driver.full_name : '—'}
        </td>
        <td className="px-6 py-4 font-medium text-slate-900">{r.price}</td>
        <td className="px-6 py-4 text-slate-700">{r.actual_amount ?? '—'}</td>
        <td className="px-6 py-4 text-slate-700">
          {r.payment_method
            ? FINANCE_PAYMENT_METHOD_LABELS[r.payment_method]
            : '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[r.status]}>
            {FINANCE_STATUS_LABELS[r.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={r.created_at} format="short" />
        </td>
        {canManage && (
          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
            {r.status === 'claimed' && (
              <button
                type="button"
                title="Verify & Reimburse"
                aria-label={`Verify and reimburse ${r.collection_request.full_name}`}
                onClick={() => onRequestReimburse([r.id])}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
              >
                <LuWalletCards className="size-4" />
              </button>
            )}
          </td>
        )}
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
          itemCount={records.length}
          totalCount={count}
          itemLabel="finance records"
          loading={loading}
        />
      }
    >
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {canManage && (
              <th className="px-4 py-3">
                {claimedRecords.length > 0 && (
                  <input
                    type="checkbox"
                    checked={allClaimedSelected}
                    onChange={onToggleSelectAll}
                    className="size-4 rounded border-slate-300"
                    aria-label="Select all claimed records"
                  />
                )}
              </th>
            )}
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Requester
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Driver
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Agreed price
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Actual paid
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Method
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              Date
            </th>
            {canManage && (
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
      </table>
    </TableWrapper>
  );
};

export { FinanceRecordTable, PAGE_SIZE };
