'use client';

import { useState } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { PageContainer } from '../../../layout/PageContainer';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import { STATUS_FILTER_OPTIONS } from '../constants';
import { useFinanceRecords, useVerifyReimburse } from '../hooks';
import type { FinanceStatus } from '../types';
import { FinanceRecordTable } from './FinanceRecordTable';

/** Accounting/admin's full table (every driver, filterable); the same
 * component also renders on the driver's own route, where the backend
 * already scopes the queryset to that driver's own records — only the
 * bulk Verify & Reimburse affordance is hidden there, since a driver
 * can't act on it anyway (403 on the backend). */
const FinanceRecordsView = () => {
  const { user } = useAuth();
  const canManage = user?.role === 'accounting' || user?.role === 'admin';

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<FinanceStatus | ''>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { records, count, loading, error, refetch } = useFinanceRecords({
    page,
    status: statusFilter,
  });
  const { execute: verifyReimburse, loading: verifying } = useVerifyReimburse();

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

  const handleVerifyReimburse = async (ids: string[]) => {
    await verifyReimburse(ids);
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
              disabled={verifying}
              onClick={() => handleVerifyReimburse(Array.from(selectedIds))}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {verifying
                ? 'Saving…'
                : `Verify & Reimburse selected (${selectedIds.size})`}
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
        onVerifyReimburse={handleVerifyReimburse}
        verifying={verifying}
        canManage={canManage}
      />
    </PageContainer>
  );
};

export { FinanceRecordsView };
