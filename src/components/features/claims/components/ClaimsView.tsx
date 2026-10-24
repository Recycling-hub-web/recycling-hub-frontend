'use client';

import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import { CATEGORY_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../constants';
import { useClaims } from '../hooks';
import type { ClaimCategory, ClaimStatus } from '../types';
import { ClaimTable } from './ClaimTable';

/** Every role's claims list — admin/accounting see every driver's
 * claims (writable, via the details page); staff sees the same list
 * read-only; a driver sees only their own (scoped server-side) plus a
 * "New claim" action to submit one. Mirrors FinanceRecordsView's own
 * basePath/canManage shape. */
const ClaimsView = () => {
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';
  const basePath =
    user?.role === 'super_admin'
      ? '/super-admin/claims'
      : `/${user?.role}/claims`;

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ClaimStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<ClaimCategory | ''>('');
  const { claims, count, loading, error, refetch } = useClaims({
    page,
    status: statusFilter,
    category: categoryFilter,
  });

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ClaimStatus | '');
    setPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value as ClaimCategory | '');
    setPage(1);
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Expense Claims"
        subtitle="Petrol and tool reimbursement claims submitted by drivers."
        actions={
          isDriver ? (
            <Button href={`${basePath}/new`}>
              <LuPlus className="mr-1.5 size-4" />
              New claim
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <FilterSelect
          value={categoryFilter}
          onChange={handleCategoryFilterChange}
          options={CATEGORY_FILTER_OPTIONS}
        />
        <FilterSelect
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <ClaimTable
        basePath={basePath}
        claims={claims}
        count={count}
        page={page}
        onPageChange={setPage}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </PageContainer>
  );
};

export { ClaimsView };
