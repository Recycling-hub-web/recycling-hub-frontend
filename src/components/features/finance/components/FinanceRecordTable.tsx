'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuWallet, LuWalletCards } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { usePortalLocale } from '../../../../contexts/PortalLocaleContext';
import { formatMYR } from '../../../../lib/money';
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
import { reimbursementBlocker } from '../eligibility';
import type { FinanceRecordListItem } from '../types';
import {
  DRIVER_FINANCE_STATUS_LABELS,
  FINANCE_PAYMENT_METHOD_LABELS,
  FINANCE_STATUS_LABELS,
} from '../types';

const PAGE_SIZE = 12;

type FinanceRecordTableProps = {
  /** Role-scoped base route (`/super-admin/finance`, `/staff/finance`,
   * `/accounting/finance`, `/driver/finance`) — rows link into
   * `${basePath}/${id}`. */
  basePath: string;
  records: FinanceRecordListItem[];
  count: number;
  page: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  error: string;
  onRetry?: () => void;
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
   * required reimbursement proof. */
  onRequestReimburse: (ids: string[]) => void;
  /** False on the driver's own read-only view — no checkboxes or
   * per-row action, since a driver can't Verify & Reimburse anyway
   * (403 on the backend). */
  canManage: boolean;
  hasFilters?: boolean;
  onClearFilters?: () => void;
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
  hasFilters = false,
  onClearFilters,
}: FinanceRecordTableProps) => {
  const { t, locale } = usePortalLocale();
  const router = useRouter();
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';
  const columnCount = canManage ? 9 : 7;
  const claimedRecords = records.filter((r) => !reimbursementBlocker(r));
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
          icon={<LuWallet className="size-6" />}
          title={
            hasFilters
              ? t('No matching finance records')
              : t('No finance records yet')
          }
          subtitle={
            hasFilters
              ? t('Try a different search, status or date range.')
              : t('Priced, approved pickup requests will show up here.')
          }
          action={
            hasFilters && onClearFilters ? (
              <button
                type="button"
                onClick={onClearFilters}
                className="min-h-11 rounded-full border border-slate-300 px-4 text-sm font-semibold text-brand-800"
              >
                {t('Clear filters')}
              </button>
            ) : undefined
          }
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
          <td
            data-card-role="select"
            className="p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {!reimbursementBlocker(r) && (
              <input
                type="checkbox"
                checked={selectedIds.has(r.id)}
                onChange={() => onToggleSelect(r.id)}
                className="size-4 rounded border-slate-300"
                aria-label={t('Select {name}', {
                  name: r.collection_request.full_name,
                })}
              />
            )}
          </td>
        )}
        <td
          data-card-role="title"
          className="max-w-[180px] truncate px-6 py-4 font-medium text-slate-900"
        >
          <Link
            href={`${basePath}/${r.id}`}
            onClick={(event) => event.stopPropagation()}
            aria-label={t('View finance record for {name}', {
              name: r.collection_request.full_name,
            })}
            className="rounded underline decoration-slate-300 underline-offset-4 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-700"
          >
            {r.collection_request.full_name}
          </Link>
        </td>
        <td className="max-w-[160px] truncate px-6 py-4 text-slate-700">
          {r.driver ? r.driver.full_name : '—'}
        </td>
        <td className="px-6 py-4 text-right font-medium tabular-nums text-slate-900">
          {formatMYR(r.price)}
        </td>
        <td className="px-6 py-4 text-right tabular-nums text-slate-700">
          {formatMYR(r.actual_amount)}
        </td>
        <td className="px-6 py-4 text-slate-700">
          {r.payment_method
            ? t(FINANCE_PAYMENT_METHOD_LABELS[r.payment_method])
            : '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge
            variant={
              isDriver && (r.status === 'claimed' || r.status === 'verified')
                ? 'success'
                : STATUS_BADGE_VARIANT[r.status]
            }
          >
            {isDriver
              ? t(DRIVER_FINANCE_STATUS_LABELS[r.status])
              : t(FINANCE_STATUS_LABELS[r.status])}
          </StatusBadge>
          {canManage &&
            r.driver &&
            r.status !== 'reimbursed' &&
            reimbursementBlocker(r) && (
              <p className="mt-1 max-w-48 text-xs text-amber-700">
                {t(reimbursementBlocker(r))}
              </p>
            )}
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate
            value={r.created_at}
            format="short"
            locale={locale === 'bm' ? 'ms-MY' : 'en-GB'}
          />
        </td>
        {canManage && (
          <td
            data-card-role="actions"
            className="px-6 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {!reimbursementBlocker(r) && (
              <button
                type="button"
                title={t('Verify & Reimburse')}
                aria-label={t('Verify and reimburse {name}', {
                  name: r.collection_request.full_name,
                })}
                onClick={() => onRequestReimburse([r.id])}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
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
                    aria-label={t('Select all records awaiting review')}
                  />
                )}
              </th>
            )}
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              {t('Requester')}
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              {t('Driver')}
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              {t('Agreed price (MYR)')}
            </th>
            <th className="px-6 py-3 text-right font-semibold text-slate-500">
              {t('Actual paid (MYR)')}
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              {t('Method')}
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              {t('Status')}
            </th>
            <th className="px-6 py-3 text-left font-semibold text-slate-500">
              {t('Date')}
            </th>
            {canManage && (
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Action')}
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
