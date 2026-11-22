'use client';

import { useEffect, useState } from 'react';

import { useAuth } from '../../../../contexts/AuthContext';
import { isAdminRole } from '../../../../types/auth';
import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import { STATUS_FILTER_OPTIONS } from '../constants';
import { reimbursementBlocker } from '../eligibility';
import { useFinanceRecords } from '../hooks';
import type { FinanceStatus } from '../types';
import { FinanceRecordTable } from './FinanceRecordTable';
import { ReimburseModal } from './ReimburseModal';

/** Accounting/admin/staff/super admin's full table (every driver,
 * filterable); the same component also renders on the driver's own
 * route, where the backend already scopes the queryset to that
 * driver's own records — only the bulk Verify & Reimburse affordance
 * is hidden there, since a driver can't act on it anyway (403 on the
 * backend). */
const FinanceRecordsView = () => {
  const { user } = useAuth();
  const canManage =
    user?.role === 'accounting' ||
    isAdminRole(user?.role) ||
    user?.role === 'staff';
  // Every other role's finance route is `/${role}/finance` — see the
  // app's three identical (staff/accounting/driver) finance/page.tsx
  // files, each rendering this same component with no props. Admin no
  // longer has a Finance Records route of its own (moved to Super
  // Admin's own section); Super Admin's literal role value also can't
  // feed the `/${role}/finance` pattern directly (`/super_admin/finance`
  // isn't a real route — the underscore, and no such role-named segment
  // exists), so it's special-cased to its real route instead.
  const basePath =
    user?.role === 'super_admin'
      ? '/super-admin/finance'
      : `/${user?.role}/finance`;

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);
  const searching = searchInput.trim() !== search;
  const dateError =
    createdFrom && createdTo && createdFrom > createdTo
      ? 'The start date must be on or before the end date.'
      : '';

  const [statusFilter, setStatusFilter] = useState<FinanceStatus | ''>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reimburseIds, setReimburseIds] = useState<string[] | null>(null);
  const { records, count, loading, error, refetch, outOfRange } =
    useFinanceRecords({
      page,
      status: statusFilter,
      search,
      createdFrom,
      createdTo,
      ordering,
      enabled: !dateError,
    });

  useEffect(() => {
    if (outOfRange) {
      setPage(1);
      setSelectedIds(new Set());
    }
  }, [outOfRange]);

  let resultsLabel = `${count.toLocaleString()} finance records`;
  if (dateError || error) resultsLabel = 'Results unavailable';
  if (loading || searching || outOfRange)
    resultsLabel = 'Loading finance records…';

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as FinanceStatus | '');
    setPage(1);
    setSelectedIds(new Set());
  };

  const resetPage = () => {
    setPage(1);
    setSelectedIds(new Set());
  };
  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setCreatedFrom('');
    setCreatedTo('');
    setStatusFilter('');
    setOrdering('-created_at');
    resetPage();
  };
  const hasFilters = Boolean(
    searchInput.trim() || statusFilter || createdFrom || createdTo,
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const claimedIds = records
    .filter((r) => !reimbursementBlocker(r))
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
        subtitle={
          user?.role === 'driver'
            ? 'Payments you have made to customers for collected orders.'
            : 'Driver payments are recorded automatically — review and reimburse them here.'
        }
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

      <section
        aria-label="Finance record filters"
        className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          <SearchInput
            value={searchInput}
            ariaLabel="Search finance records"
            placeholder="Requester, driver or reference"
            onChange={(event) => {
              setSearchInput(event.target.value);
              resetPage();
            }}
          />
          {canManage && (
            <FilterSelect
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={STATUS_FILTER_OPTIONS}
              ariaLabel="Filter finance records by status"
            />
          )}
          <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
              Created from (MYT)
              <input
                type="date"
                value={createdFrom}
                max={createdTo || undefined}
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? 'finance-date-error' : undefined}
                onChange={(event) => {
                  setCreatedFrom(event.target.value);
                  resetPage();
                }}
                className="min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              />
            </label>
            <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
              Created to (MYT)
              <input
                type="date"
                value={createdTo}
                min={createdFrom || undefined}
                aria-invalid={Boolean(dateError)}
                aria-describedby={dateError ? 'finance-date-error' : undefined}
                onChange={(event) => {
                  setCreatedTo(event.target.value);
                  resetPage();
                }}
                className="min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              />
            </label>
          </div>
          <FilterSelect
            ariaLabel="Sort finance records"
            value={ordering}
            onChange={(value) => {
              setOrdering(value);
              resetPage();
            }}
            options={[
              { value: '-created_at', label: 'Newest first' },
              { value: 'created_at', label: 'Oldest first' },
              { value: '-price', label: 'Highest agreed price' },
              { value: 'price', label: 'Lowest agreed price' },
            ]}
          />
        </div>
        {dateError && (
          <p
            id="finance-date-error"
            role="alert"
            className="text-sm text-red-700"
          >
            {dateError}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p role="status" className="text-sm text-slate-600">
            {resultsLabel}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="min-h-11 rounded-lg px-3 text-sm font-semibold text-brand-800 underline underline-offset-4"
            >
              Clear all filters
            </button>
          )}
        </div>
        {hasFilters && (
          <div
            className="flex flex-wrap gap-2"
            aria-label="Active finance filters"
          >
            {searchInput.trim() && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setSearch('');
                  resetPage();
                }}
                className="min-h-11 rounded-full bg-brand-50 px-3 text-sm text-brand-800"
                aria-label="Remove search filter"
              >
                Search: {searchInput.trim()} ×
              </button>
            )}
            {statusFilter && (
              <button
                type="button"
                onClick={() => handleStatusFilterChange('')}
                className="min-h-11 rounded-full bg-brand-50 px-3 text-sm text-brand-800"
                aria-label="Remove status filter"
              >
                {
                  STATUS_FILTER_OPTIONS.find(
                    (option) => option.value === statusFilter,
                  )?.label
                }{' '}
                ×
              </button>
            )}
            {(createdFrom || createdTo) && (
              <button
                type="button"
                onClick={() => {
                  setCreatedFrom('');
                  setCreatedTo('');
                  resetPage();
                }}
                className="min-h-11 rounded-full bg-brand-50 px-3 text-sm text-brand-800"
                aria-label="Remove date filter"
              >
                {createdFrom || 'Any date'} – {createdTo || 'Today and later'} ×
              </button>
            )}
          </div>
        )}
      </section>

      <FinanceRecordTable
        basePath={basePath}
        records={records}
        count={count}
        page={page}
        onPageChange={(value) => {
          setPage(value);
          setSelectedIds(new Set());
        }}
        loading={loading || searching || outOfRange}
        error={dateError || error}
        onRetry={dateError ? undefined : refetch}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
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
