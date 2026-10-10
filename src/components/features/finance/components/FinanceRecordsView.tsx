'use client';

import { useState } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { PageContainer } from '../../../layout/PageContainer';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import { STATUS_FILTER_OPTIONS } from '../constants';
import { useFinanceRecords } from '../hooks';
import type { FinanceStatus } from '../types';
import { FinanceRecordTable } from './FinanceRecordTable';
import { ReimburseModal } from './ReimburseModal';

/** Accounting/admin/staff's full table (every driver, filterable); the
 * same component also renders on the driver's own route, where the
 * backend already scopes the queryset to that driver's own records —
 * only the bulk Verify & Reimburse affordance is hidden there, since a
 * driver can't act on it anyway (403 on the backend). */
const FinanceRecordsView = () => {
  const { user } = useAuth();
  const canManage =
    user?.role === 'accounting' ||
    user?.role === 'admin' ||
    user?.role === 'staff';
  // Every role's finance route is `/${role}/finance` — see the app's
  // four identical (admin/staff/accounting/driver) finance/page.tsx
  // files, each rendering this same component with no props.
  const basePath = `/${user?.role}/finance`;

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FinanceStatus | ''>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reimburseIds, setReimburseIds] = useState<string[] | null>(null);
  const { records, count, loading, error, refetch } = useFinanceRecords({
    page,
    status: statusFilter,
  });

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as FinanceStatus | '');
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const claimedIds = records
    .filter((r) => r.status === 'claimed')
    .map((r) => r.id);

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const allSelected = claimedIds.every((id) => prev.has(id));
      return allSelected ? new Set() : new Set(claimedIds);
    });
  };

  const handleReimbursed = () => {
    setSelectedIds(new Set());
    refetch();
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Finance Records"
        subtitle="Priced pickup requests — claim, verify, and reimburse driver payments."
        actions={
          canManage && selectedIds.size > 0 ? (
            <button
              type="button"
              onClick={() => setReimburseIds(Array.from(selectedIds))}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {`Verify & Reimburse selected (${selectedIds.size})`}
            </button>
          ) : undefined
        }
      />

      {canManage && (
        <div className="mb-4 flex justify-end">
          <FilterSelect
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={STATUS_FILTER_OPTIONS}
          />
        </div>
      )}

      <FinanceRecordTable
        basePath={basePath}
        records={records}
        count={count}
        page={page}
        onPageChange={setPage}
        loading={loading}
        error={error}
        onRetry={refetch}
        selectedIds={canManage ? selectedIds : new Set()}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onRequestReimburse={setReimburseIds}
        canManage={canManage}
      />

      <ReimburseModal
        ids={reimburseIds ?? []}
        open={reimburseIds !== null}
        onClose={() => setReimburseIds(null)}
        onReimbursed={handleReimbursed}
      />
    </PageContainer>
  );
};

export { FinanceRecordsView };
