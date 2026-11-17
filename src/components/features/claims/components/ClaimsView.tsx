'use client';

import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { useAuth } from '../../../../contexts/AuthContext';
import { isAdminRole } from '../../../../types/auth';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { CATEGORY_FILTER_OPTIONS, STATUS_FILTER_OPTIONS } from '../constants';
import { useClaims } from '../hooks';
import { claimPaymentTotal } from '../payment';
import type { ClaimCategory, ClaimListItem, ClaimStatus } from '../types';
import { BulkPayClaimsModal } from './BulkPayClaimsModal';
import { ClaimTable } from './ClaimTable';

/** Shared claims list with same-driver bulk payments for admin/accounting;
 * staff can read all claims, while drivers see and submit their own. */
const ClaimsView = () => {
  const { user } = useAuth();
  const isDriver = user?.role === 'driver';
  const canPay = isAdminRole(user?.role) || user?.role === 'accounting';
  const toast = useToast();
  const [selection, setSelection] = useState<Record<string, ClaimListItem>>({});
  const [payOpen, setPayOpen] = useState(false);
  const selected = Object.values(selection);
  const selectedIds = new Set(Object.keys(selection));
  const selectedDriver = selected[0]?.driver;
  const toggleClaim = (claim: ClaimListItem) => {
    setSelection((previous) => {
      const next = { ...previous };
      const driverId = Object.values(previous)[0]?.driver.id;
      if (next[claim.id]) delete next[claim.id];
      else if (
        Object.keys(next).length < 100 &&
        (!driverId || driverId === claim.driver.id)
      )
        next[claim.id] = claim;
      return next;
    });
  };
  const togglePage = (pageClaims: ClaimListItem[]) => {
    setSelection((previous) => {
      const next = { ...previous };
      const allSelected = pageClaims.every((claim) => previous[claim.id]);
      pageClaims.forEach((claim) => {
        if (allSelected) delete next[claim.id];
        else if (Object.keys(next).length < 100) next[claim.id] = claim;
      });
      return next;
    });
  };
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
    setSelection({});
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value as ClaimCategory | '');
    setPage(1);
    setSelection({});
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

      {canPay && selected.length === 0 && (
        <p className="mb-3 text-sm text-slate-500">
          Select up to 100 pending claims for one driver to record a combined
          payment.
        </p>
      )}
      {canPay && selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {selectedDriver?.full_name} · {selected.length}{' '}
              {selected.length === 1 ? 'claim' : 'claims'} selected
            </p>
            <p className="mt-1 text-sm text-brand-800">
              Total RM {claimPaymentTotal(selected)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setSelection({})}>
              Clear selection
            </Button>
            <Button onClick={() => setPayOpen(true)}>
              Pay selected claims
            </Button>
          </div>
        </div>
      )}
      <ClaimTable
        basePath={basePath}
        claims={claims}
        count={count}
        page={page}
        onPageChange={setPage}
        loading={loading}
        error={error}
        onRetry={refetch}
        selectedIds={selectedIds}
        selectedDriverId={selectedDriver?.id}
        onSelect={canPay ? toggleClaim : undefined}
        onSelectPage={canPay ? togglePage : undefined}
      />
      {payOpen && canPay && selected.length > 0 && (
        <BulkPayClaimsModal
          claims={selected}
          onClose={() => setPayOpen(false)}
          onPaid={() => {
            setPayOpen(false);
            setSelection({});
            if (page === 1) refetch();
            else setPage(1);
            toast.success('Expense claims paid');
          }}
        />
      )}
    </PageContainer>
  );
};

export { ClaimsView };
