'use client';

import { useState } from 'react';
import { LuMapPin, LuPackage, LuWallet } from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { PageHeader } from '../../../ui/PageHeader';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import { Tabs } from '../../../ui/tabs';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  useClaimReimbursements,
  usePendingReimbursementSummary,
} from '../../finance/hooks';
import { useClaimPickupRequest, usePickupRequests } from '../hooks';
import type { PickupRequestListItem } from '../types';
import { CollectModal } from './CollectModal';

type Tab = 'available' | 'mine';

const columnCount = 5;

/** Driver's own scoped pickups view — not PickupRequestTable reused
 * (that's the full admin/staff CRUD view). A driver only ever sees two
 * slices of the same GET /pickups/ endpoint (server-scoped — see
 * CollectionRequestViewSet.get_queryset's driver branch): the open,
 * unclaimed pool (passing status=pending narrows to just that, since a
 * driver's own assignments are never pending — claiming/being assigned
 * immediately flips status to scheduled) and their own active
 * assignments (status=scheduled). No pagination UI (low expected
 * volume) — same choice QuickLeadTable already made for the Quick
 * Leads queue. */
const DriverPickupsView = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('available');
  const {
    requests: available,
    count: availableCount,
    loading: loadingAvailable,
    error: availableError,
    refetch: refetchAvailable,
  } = usePickupRequests({ page: 1, status: 'pending' });
  const {
    requests: mine,
    loading: loadingMine,
    error: mineError,
    refetch: refetchMine,
  } = usePickupRequests({ page: 1, status: 'scheduled' });

  const { execute: claim } = useClaimPickupRequest();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [collectTarget, setCollectTarget] =
    useState<PickupRequestListItem | null>(null);

  const {
    count: pendingCount,
    total: pendingTotal,
    refetch: refetchPendingSummary,
  } = usePendingReimbursementSummary();
  const { execute: claimReimbursements, loading: claimingReimbursement } =
    useClaimReimbursements();

  const handleClaimReimbursements = async () => {
    try {
      await claimReimbursements();
      toast.success('Reimbursement claimed');
      refetchPendingSummary();
    } catch {
      toast.error('Could not claim reimbursement. Please try again.');
    }
  };

  const handleClaim = async (request: PickupRequestListItem) => {
    setClaimingId(request.id);
    try {
      await claim(request.id);
      toast.success('Pickup claimed');
      refetchAvailable();
      refetchMine();
    } catch {
      toast.error('Could not claim this pickup — it may already be taken.');
    } finally {
      setClaimingId(null);
    }
  };

  const handleCollected = () => {
    toast.success('Marked as collected');
    refetchMine();
  };

  // A passive count, not a push notification — every driver getting
  // pinged for every newly-approved request would be noisy for no real
  // benefit; this badge is enough to surface that there's something to
  // claim.
  const tabItems: { key: Tab; label: string }[] = [
    {
      key: 'available',
      label: availableCount > 0 ? `Available (${availableCount})` : 'Available',
    },
    { key: 'mine', label: 'My Pickups' },
  ];

  const requests = activeTab === 'available' ? available : mine;
  const loading = activeTab === 'available' ? loadingAvailable : loadingMine;
  const error = activeTab === 'available' ? availableError : mineError;
  const onRetry = activeTab === 'available' ? refetchAvailable : refetchMine;

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
    if (requests.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title={
            activeTab === 'available'
              ? 'No pickups available to claim right now'
              : "You haven't claimed any pickups yet"
          }
        />
      );
    }
    return requests.map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">
          {r.category.name}
        </td>
        <td className="px-6 py-4 text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <LuMapPin className="size-4 shrink-0" />
            {r.full_name}
          </span>
        </td>
        <td className="px-6 py-4 text-slate-700">{r.price ?? '—'}</td>
        <td className="px-6 py-4 text-slate-500">{r.requested_date ?? '—'}</td>
        <td className="px-6 py-4">
          <div className="flex justify-end">
            {activeTab === 'available' ? (
              <button
                type="button"
                onClick={() => handleClaim(r)}
                disabled={claimingId === r.id}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LuPackage className="size-4" />
                Claim
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCollectTarget(r)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50"
              >
                <LuPackage className="size-4" />
                Mark collected
              </button>
            )}
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Pickup Requests"
        subtitle="Claim an available pickup, or manage your own."
      />

      {pendingCount > 0 && (
        <div className="mb-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:flex-row sm:items-center">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-brand-900">
            <LuWallet className="size-4 shrink-0" />
            You have {pendingCount} pending payment
            {pendingCount === 1 ? '' : 's'} totaling RM
            {pendingTotal.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={handleClaimReimbursements}
            disabled={claimingReimbursement}
            className="inline-flex items-center justify-center rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {claimingReimbursement ? 'Claiming…' : 'Claim Reimbursement'}
          </button>
        </div>
      )}

      <Tabs
        tabs={tabItems}
        active={activeTab}
        onChange={setActiveTab}
        className="-mt-2 mb-4 px-0"
      />

      <TableWrapper>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Category
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Requester
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Price
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Requested
              </th>
              <th className="px-6 py-3 text-right font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
        </table>
      </TableWrapper>

      <CollectModal
        requestId={collectTarget?.id ?? ''}
        quantityUnit="kg"
        open={Boolean(collectTarget)}
        onClose={() => setCollectTarget(null)}
        onCollected={handleCollected}
        // Every row on this driver's own "mine" tab is, by definition,
        // one they're the assigned_driver for (server-scoped — see
        // CollectionRequestViewSet.get_queryset) — always a driver
        // collection, never the staff-collector path.
        showPaymentFields
        price={collectTarget?.price ?? null}
      />
    </PageContainer>
  );
};

export { DriverPickupsView };
