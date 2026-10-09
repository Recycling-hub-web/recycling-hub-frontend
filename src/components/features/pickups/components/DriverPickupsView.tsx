'use client';

import { useState } from 'react';
import {
  LuMapPin,
  LuNavigation,
  LuPackage,
  LuRoute,
  LuWallet,
} from 'react-icons/lu';

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
import {
  googleMapsDirectionsUrl,
  wazeNavigateUrl,
} from '../utils/navigationLinks';
import { CollectModal } from './CollectModal';
import { OptimizeRouteModal } from './OptimizeRouteModal';

type Tab = 'available' | 'mine';

// A larger batch stops being "a driver's one trip" and starts being a
// planning problem of its own — kept small and frontend-only since
// nothing about the backend's optimize-route call actually requires a
// cap (see apps.pickups.services.optimize_route).
const MAX_OPTIMIZE_STOPS = 10;

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
  // A scheduled request's route can end up closed (dropped_off) or
  // unset without the request itself having moved off `scheduled` —
  // drop_off_route only transitions the specific items it was handed,
  // so a sibling stop that wasn't part of that batch is left stranded
  // on the now-closed route. Optimizing only ever makes sense for
  // stops still on the driver's current *open* route — a stranded one
  // has nowhere to attach a resolved destination to, and isn't part of
  // the trip actually being planned.
  const optimizableMine = mine.filter((r) => r.route?.status === 'open');

  const { execute: claim } = useClaimPickupRequest();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [collectTarget, setCollectTarget] =
    useState<PickupRequestListItem | null>(null);

  // Route optimization — only meaningful on the "mine" tab, where every
  // row is already this driver's own claimed, scheduled stop.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [optimizedOrder, setOptimizedOrder] = useState<Record<string, number>>(
    {},
  );

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

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSelectedIds(new Set());
    setOptimizedOrder({});
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.has(id)) {
        const next = new Set(prev);
        next.delete(id);
        return next;
      }
      if (prev.size >= MAX_OPTIMIZE_STOPS) {
        toast.error(
          `You can optimize at most ${MAX_OPTIMIZE_STOPS} stops at once.`,
        );
        return prev;
      }
      return new Set(prev).add(id);
    });
  };

  const maxSelectable = Math.min(optimizableMine.length, MAX_OPTIMIZE_STOPS);

  const toggleSelectAll = () => {
    setSelectedIds((prev) =>
      prev.size > 0
        ? new Set()
        : new Set(
            optimizableMine.slice(0, MAX_OPTIMIZE_STOPS).map((r) => r.id),
          ),
    );
  };

  const handleWazeOrderChosen = (orderedRequestIds: string[]) => {
    setOptimizedOrder(
      Object.fromEntries(orderedRequestIds.map((id, i) => [id, i + 1])),
    );
    setSelectedIds(new Set());
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
  // One extra leading column for the selection checkbox — only on
  // "mine," where route optimization is meaningful.
  const columnCount = activeTab === 'mine' ? 6 : 5;
  const selectedRequests = mine.filter((r) => selectedIds.has(r.id));

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
    return requests.map((r) => {
      const offRoute = r.route?.status !== 'open';
      const atCap =
        !selectedIds.has(r.id) && selectedIds.size >= MAX_OPTIMIZE_STOPS;
      let checkboxTitle: string | undefined;
      if (offRoute) {
        checkboxTitle =
          "Not on your current route — can't be included in route optimization.";
      } else if (atCap) {
        checkboxTitle = `You can optimize at most ${MAX_OPTIMIZE_STOPS} stops at once.`;
      }

      return (
        <tr key={r.id} className="transition-colors hover:bg-slate-50">
          {activeTab === 'mine' && (
            <td className="p-4">
              <input
                type="checkbox"
                checked={selectedIds.has(r.id)}
                onChange={() => toggleSelect(r.id)}
                disabled={offRoute || atCap}
                title={checkboxTitle}
                className="size-4 rounded border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Select pickup for ${r.full_name}`}
              />
            </td>
          )}
          <td className="px-6 py-4 font-medium text-slate-900">
            {r.category.name}
          </td>
          <td className="px-6 py-4 text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              {optimizedOrder[r.id] ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-semibold text-brand-700">
                  {optimizedOrder[r.id]}
                </span>
              ) : (
                <LuMapPin className="size-4 shrink-0" />
              )}
              {r.full_name}
            </span>
          </td>
          <td className="px-6 py-4 text-slate-700">{r.price ?? '—'}</td>
          <td className="px-6 py-4 text-slate-500">
            {r.requested_date ?? '—'}
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  window.open(
                    googleMapsDirectionsUrl(r.pickup_address),
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                aria-label={`Navigate to ${r.full_name} with Google Maps`}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
              >
                <LuMapPin className="size-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open(
                    wazeNavigateUrl(r.pickup_address),
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                aria-label={`Navigate to ${r.full_name} with Waze`}
                className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
              >
                <LuNavigation className="size-4" />
              </button>
              {activeTab === 'available' ? (
                <button
                  type="button"
                  onClick={() => handleClaim(r)}
                  disabled={claimingId === r.id}
                  aria-label={`Claim pickup for ${r.full_name}`}
                  className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LuPackage className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCollectTarget(r)}
                  aria-label={`Mark pickup for ${r.full_name} as collected`}
                  className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-brand-50 hover:text-brand-600"
                >
                  <LuPackage className="size-4" />
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    });
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
        onChange={handleTabChange}
        className="-mt-2 mb-4 px-0"
      />

      {activeTab === 'mine' && selectedIds.size > 0 && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="text-sm font-medium text-slate-700">
            {selectedIds.size}/{MAX_OPTIMIZE_STOPS} selected
          </span>
          <button
            type="button"
            onClick={() => setOptimizeModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <LuRoute className="size-4" />
            Optimize Route
          </button>
        </div>
      )}

      <TableWrapper>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {activeTab === 'mine' && (
                <th className="w-10 p-4">
                  {optimizableMine.length > 0 && (
                    <input
                      type="checkbox"
                      checked={selectedIds.size === maxSelectable}
                      onChange={toggleSelectAll}
                      title={
                        optimizableMine.length > MAX_OPTIMIZE_STOPS
                          ? `Selects the first ${MAX_OPTIMIZE_STOPS} — the most you can optimize at once.`
                          : undefined
                      }
                      className="size-4 rounded border-slate-300"
                      aria-label="Select all"
                    />
                  )}
                </th>
              )}
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
        open={Boolean(collectTarget)}
        onClose={() => setCollectTarget(null)}
        onCollected={handleCollected}
        // Every row on this driver's own "mine" tab is, by definition,
        // one they're the assigned_driver for (server-scoped — see
        // CollectionRequestViewSet.get_queryset) — always a driver
        // collection, never the staff-collector path.
        showPaymentFields
      />

      <OptimizeRouteModal
        open={optimizeModalOpen}
        onClose={() => setOptimizeModalOpen(false)}
        selectedRequests={selectedRequests}
        onWazeOrderChosen={handleWazeOrderChosen}
      />
    </PageContainer>
  );
};

export { DriverPickupsView };
