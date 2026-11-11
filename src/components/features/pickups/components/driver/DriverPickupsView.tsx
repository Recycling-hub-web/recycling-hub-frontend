'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  LuCalendarCheck,
  LuEye,
  LuMapPin,
  LuNavigation,
  LuPackage,
  LuRoute,
  LuTruck,
  LuWallet,
} from 'react-icons/lu';

import { PageContainer } from '../../../../layout/PageContainer';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import { Button } from '../../../../ui/buttons/Button';
import { IconButton } from '../../../../ui/buttons/IconButton';
import { AppDate } from '../../../../ui/date/AppDate';
import { PageHeader } from '../../../../ui/PageHeader';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../../ui/table';
import { Tabs } from '../../../../ui/tabs';
import { useToast } from '../../../../ui/toast/ToastContext';
import { WhatsAppLink } from '../../../../ui/WhatsAppLink';
import { usePendingReimbursementSummary } from '../../../finance/hooks';
import { STATUS_BADGE_VARIANT } from '../../constants';
import { useClaimOrder, useOrders } from '../../hooks';
import { listOrders } from '../../services/pickupService';
import {
  type CollectionRequestListItem,
  itemsSummary,
  type LatLng,
  type OptimizeRouteResult,
  PICKUP_STATUS_LABELS,
  type PickupStatus,
} from '../../types';
import {
  googleMapsDirectionsUrl,
  wazeNavigateUrl,
} from '../../utils/navigationLinks';
import { CollectModal } from '../shared/CollectModal';
import { ConfirmedPickupCell } from '../shared/ConfirmedPickupCell';
import { ConfirmScheduleModal } from './ConfirmScheduleModal';
import { OptimizedRoutePreview } from './OptimizedRoutePreview';
import { OptimizeRouteModal } from './OptimizeRouteModal';

type Tab = 'available' | 'mine' | 'history';

const HISTORY_STATUSES: PickupStatus[] = ['collected', 'delivered', 'closed'];
const PAGE_SIZE = 7;

// Match OptimizeRouteRequestSerializer: at most seven pickup stops per trip.
const MAX_OPTIMIZE_STOPS = 7;

// Once a pickup is collected (or further along: delivered/closed)
// there's nowhere left to navigate to — matches
// DriverPickupDetailsView's own NAVIGABLE_STATUSES.
const NAVIGABLE_STATUSES = ['pending', 'scheduled'];

/** Driver-scoped available, active, and collected orders. History is
 * filtered and paginated by the API, so older orders stay accessible. */
const DriverPickupsView = () => {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('mine');
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 575.98px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const [minePage, setMinePage] = useState(1);
  const [availablePage, setAvailablePage] = useState(1);
  const selectedOrders = useRef(new Map<string, CollectionRequestListItem>());
  const [historyPage, setHistoryPage] = useState(1);
  const {
    requests: history,
    count: historyCount,
    loading: loadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useOrders({
    page: historyPage,
    pageSize: PAGE_SIZE,
    status: HISTORY_STATUSES,
  });
  const {
    requests: available,
    count: availableCount,
    loading: loadingAvailable,
    error: availableError,
    refetch: refetchAvailable,
  } = useOrders({
    page: availablePage,
    pageSize: PAGE_SIZE,
    status: 'pending',
  });
  const {
    requests: mine,
    count: mineCount,
    loading: loadingMine,
    error: mineError,
    refetch: refetchMine,
  } = useOrders({ page: minePage, pageSize: PAGE_SIZE, status: 'scheduled' });
  // A scheduled request's route can end up closed (dropped_off) or
  // unset without the request itself having moved off `scheduled` —
  // drop_off_route only transitions the specific items it was handed,
  // so a sibling stop that wasn't part of that batch is left stranded
  // on the now-closed route. Optimizing only ever makes sense for
  // stops still on the driver's current *open* route — a stranded one
  // has nowhere to attach a resolved destination to, and isn't part of
  // the trip actually being planned.
  const optimizableMine = mine.filter((r) => r.route?.status === 'open');

  const { execute: claim } = useClaimOrder();
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [collectTarget, setCollectTarget] =
    useState<CollectionRequestListItem | null>(null);
  // The assigned driver confirms the pickup day and time (POST
  // /pickups/{id}/confirm-schedule/) straight from the table.
  const [confirmTarget, setConfirmTarget] =
    useState<CollectionRequestListItem | null>(null);

  const handleScheduleConfirmed = () => {
    setConfirmTarget(null);
    toast.success('Pickup time confirmed');
    refetchMine();
  };

  // Route optimization — only meaningful on the "mine" tab, where every
  // row is already this driver's own claimed, scheduled stop.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);

  const [routePreview, setRoutePreview] = useState<{
    result: OptimizeRouteResult;
    origin: LatLng;
    orders: CollectionRequestListItem[];
  } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isMobile && routePreview)
      previewRef.current?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      });
  }, [isMobile, routePreview]);
  const [selectingAll, setSelectingAll] = useState(false);
  const selectionRun = useRef(0);
  const [optimizedOrder, setOptimizedOrder] = useState<Record<string, number>>(
    {},
  );

  const {
    count: pendingCount,
    total: pendingTotal,
    refetch: refetchPayments,
  } = usePendingReimbursementSummary();
  const handleClaim = async (request: CollectionRequestListItem) => {
    setClaimingId(request.id);
    try {
      await claim(request.id);
      toast.success('Pickup claimed');
      if (available.length === 1 && availablePage > 1)
        setAvailablePage(availablePage - 1);
      else refetchAvailable();
      refetchMine();
    } catch {
      toast.error('Could not claim this pickup — it may already be taken.');
    } finally {
      setClaimingId(null);
    }
  };

  const handleCollected = () => {
    selectionRun.current += 1;
    setSelectingAll(false);
    setRoutePreview(null);
    toast.success('Marked as collected');
    setSelectedIds(new Set());
    selectedOrders.current.clear();
    if (mine.length === 1 && minePage > 1) setMinePage(minePage - 1);
    else refetchMine();
    refetchHistory();
    refetchPayments();
  };

  const handleTabChange = (tab: Tab) => {
    selectionRun.current += 1;
    setSelectingAll(false);
    setRoutePreview(null);
    setActiveTab(tab);
    selectedOrders.current.clear();
    setSelectedIds(new Set());
    setOptimizedOrder({});
  };

  const toggleSelect = (id: string) => {
    setRoutePreview(null);
    const order = mine.find((item) => item.id === id);
    if (order) selectedOrders.current.set(id, order);
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

  const allPageSelected =
    optimizableMine.length > 0 &&
    optimizableMine.every((order) => selectedIds.has(order.id));
  const toggleSelectAll = () => {
    setRoutePreview(null);
    optimizableMine.forEach((order) =>
      selectedOrders.current.set(order.id, order),
    );
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (allPageSelected)
        optimizableMine.forEach((order) => next.delete(order.id));
      else
        optimizableMine.forEach((order) => {
          if (next.size < MAX_OPTIMIZE_STOPS) next.add(order.id);
        });
      return next;
    });
  };

  const selectAllPickups = async () => {
    selectionRun.current += 1;
    const run = selectionRun.current;
    setRoutePreview(null);
    setSelectingAll(true);
    try {
      const eligible: CollectionRequestListItem[] = [];
      let nextPage = 1;
      let hasMore = true;
      while (hasMore && eligible.length < MAX_OPTIMIZE_STOPS) {
        // eslint-disable-next-line no-await-in-loop -- fetch another page only if eligible stops are still needed
        const response = await listOrders({
          page: nextPage,
          pageSize: 200,
          status: 'scheduled',
        });
        if (selectionRun.current !== run) return;
        eligible.push(
          ...response.results.filter((order) => order.route?.status === 'open'),
        );
        hasMore = Boolean(response.next);
        nextPage += 1;
      }
      const chosen = eligible.slice(0, MAX_OPTIMIZE_STOPS);
      chosen.forEach((order) => selectedOrders.current.set(order.id, order));
      setSelectedIds(new Set(chosen.map((order) => order.id)));
      if (!chosen.length)
        toast.error('No pickups on your open route are available to select.');
    } catch {
      if (selectionRun.current === run)
        toast.error('Could not select pickups. Please try again.');
    } finally {
      if (selectionRun.current === run) setSelectingAll(false);
    }
  };

  // A passive count, not a push notification — every driver getting
  // pinged for every newly-approved request would be noisy for no real
  // benefit; this badge is enough to surface that there's something to
  // claim.
  // My Pickups first (and the default) — a driver's own route is what
  // they open this page for most of the time.
  const tabItems: { key: Tab; label: string }[] = [
    { key: 'mine', label: 'My Pickups' },
    { key: 'history', label: 'History' },
    {
      key: 'available',
      label: availableCount > 0 ? `Available (${availableCount})` : 'Available',
    },
  ];

  const tabs = {
    available: {
      requests: available,
      count: availableCount,
      page: availablePage,
      onPageChange: setAvailablePage,
      loading: loadingAvailable,
      error: availableError,
      onRetry: refetchAvailable,
    },
    mine: {
      requests: mine,
      count: mineCount,
      page: minePage,
      onPageChange: setMinePage,
      loading: loadingMine,
      error: mineError,
      onRetry: refetchMine,
    },
    history: {
      requests: history,
      count: historyCount,
      page: historyPage,
      onPageChange: setHistoryPage,
      loading: loadingHistory,
      error: historyError,
      onRetry: refetchHistory,
    },
  };
  const { requests, loading, error, onRetry, count, page, onPageChange } =
    tabs[activeTab];
  const emptyMessages = {
    available: {
      title: 'No pickups available to claim right now',
      subtitle: 'Approved requests open for drivers will show up here.',
    },
    mine: {
      title: "You haven't claimed any pickups yet",
      subtitle:
        'Claim one from the Available tab, or wait for one to be assigned to you.',
    },
    history: {
      title: 'No pickup history yet',
      subtitle:
        'Your collected, delivered, and closed orders will appear here.',
    },
  };
  const columnCount = activeTab === 'available' ? 8 : 9;
  const selectionButtonLabel = selectedIds.size
    ? 'Clear selection'
    : 'Select all (up to 7)';
  const selectedRequests = Array.from(selectedIds)
    .map((id) => selectedOrders.current.get(id))
    .filter((order): order is CollectionRequestListItem => Boolean(order));

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
          icon={<LuTruck className="size-6" />}
          title={emptyMessages[activeTab].title}
          subtitle={emptyMessages[activeTab].subtitle}
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

      const canNavigate = NAVIGABLE_STATUSES.includes(r.status);

      return (
        <tr
          key={r.id}
          onClick={() => router.push(`/driver/pickups/${r.id}`)}
          className="cursor-pointer transition-colors hover:bg-slate-50"
        >
          {activeTab === 'mine' && (
            <td className="p-4" onClick={(e) => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={selectedIds.has(r.id)}
                onChange={() => toggleSelect(r.id)}
                disabled={offRoute || atCap || selectingAll}
                title={checkboxTitle}
                className="size-4 rounded border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Select pickup for ${r.pickup_request.full_name}`}
              />
            </td>
          )}
          <td className="p-3 font-medium text-slate-900">{r.code}</td>
          <td data-pickup-field="materials" className="p-3 text-slate-700">
            <span
              className="block max-w-48 truncate"
              title={itemsSummary(r.items)}
            >
              {itemsSummary(r.items)}
            </span>
          </td>
          <td data-pickup-field="requester" className="p-3 text-slate-500">
            <span className="inline-flex max-w-full items-center gap-1.5">
              {optimizedOrder[r.id] ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                  {optimizedOrder[r.id]}
                </span>
              ) : (
                <LuMapPin className="size-4 shrink-0" />
              )}
              <span
                className="block max-w-44 truncate"
                title={r.pickup_request.full_name}
              >
                {r.pickup_request.full_name}
              </span>
            </span>
          </td>
          <td data-pickup-field="contact" className="p-3">
            <WhatsAppLink phoneNumber={r.pickup_request.phone_number} />
          </td>
          <td data-pickup-field="price" className="p-3 text-slate-700">
            {r.price ?? '—'}
          </td>
          <td data-pickup-field="requested" className="p-3 text-slate-500">
            <AppDate value={r.pickup_request.requested_at} format="short" />
          </td>
          <td data-pickup-field="confirmed" className="p-3">
            <ConfirmedPickupCell order={r} />
          </td>
          {activeTab === 'history' && (
            <td data-pickup-field="status" className="p-3">
              <StatusBadge variant={STATUS_BADGE_VARIANT[r.status]}>
                {PICKUP_STATUS_LABELS[r.status]}
              </StatusBadge>
            </td>
          )}
          <td className="p-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-end gap-2">
              {canNavigate && (
                <>
                  <IconButton
                    variant="ghost"
                    onClick={() =>
                      window.open(
                        googleMapsDirectionsUrl(
                          r.pickup_request.pickup_address,
                        ),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    aria-label={`Navigate to ${r.pickup_request.full_name} with Google Maps`}
                    icon={<LuMapPin className="size-4" />}
                  />
                  <IconButton
                    variant="ghost"
                    onClick={() =>
                      window.open(
                        wazeNavigateUrl(r.pickup_request.pickup_address),
                        '_blank',
                        'noopener,noreferrer',
                      )
                    }
                    aria-label={`Navigate to ${r.pickup_request.full_name} with Waze`}
                    icon={<LuNavigation className="size-4" />}
                  />
                </>
              )}
              {activeTab === 'available' ? (
                <IconButton
                  variant="ghost"
                  onClick={() => handleClaim(r)}
                  disabled={claimingId === r.id}
                  aria-label={`Claim pickup for ${r.pickup_request.full_name}`}
                  icon={<LuPackage className="size-4" />}
                />
              ) : (
                <>
                  {activeTab === 'history' && (
                    <IconButton
                      variant="ghost"
                      onClick={() => router.push(`/driver/pickups/${r.id}`)}
                      aria-label={`View order ${r.code}`}
                      icon={<LuEye className="size-4" />}
                    />
                  )}
                  {r.status === 'scheduled' && !r.pickup_confirmed_at && (
                    <IconButton
                      variant="ghost"
                      onClick={() => setConfirmTarget(r)}
                      aria-label={`Confirm pickup date and time for ${r.pickup_request.full_name}`}
                      title="Confirm pickup date and time"
                      icon={<LuCalendarCheck className="size-4" />}
                    />
                  )}
                  {r.status === 'scheduled' && (
                    <IconButton
                      variant="ghost"
                      onClick={() => setCollectTarget(r)}
                      aria-label={`Mark pickup for ${r.pickup_request.full_name} as collected`}
                      icon={<LuPackage className="size-4" />}
                    />
                  )}
                </>
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
            Paid to customers: RM{pendingTotal.toFixed(2)} across {pendingCount}{' '}
            order{pendingCount === 1 ? '' : 's'}.
          </span>
          <Button size="sm" href="/driver/finance">
            View payments
          </Button>
        </div>
      )}

      <Tabs
        tabs={tabItems}
        active={activeTab}
        onChange={handleTabChange}
        className="-mt-2 mb-4 px-0"
      />

      {activeTab === 'mine' && mineCount > 0 && (
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-slate-700">
            {selectedIds.size}/{MAX_OPTIMIZE_STOPS} selected
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              disabled={selectingAll || loadingMine}
              onClick={() => {
                if (selectedIds.size) {
                  setRoutePreview(null);
                  setSelectedIds(new Set());
                  selectedOrders.current.clear();
                } else selectAllPickups();
              }}
            >
              {selectingAll ? 'Selecting…' : selectionButtonLabel}
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!selectedIds.size || selectingAll}
              onClick={() => {
                setOptimizeModalOpen(true);
              }}
            >
              <LuRoute className="size-4" />
              Optimize Route
            </Button>
          </div>
        </div>
      )}

      <TableWrapper
        footer={
          <TablePagination
            currentPage={page}
            onPageChange={onPageChange}
            itemsPerPage={PAGE_SIZE}
            itemCount={requests.length}
            totalCount={count}
            itemLabel="orders"
            loading={loading}
          />
        }
      >
        <table className="driver-pickups-table min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {activeTab === 'mine' && (
                <th className="w-10 p-4">
                  {optimizableMine.length > 0 && (
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      disabled={selectingAll}
                      onChange={toggleSelectAll}
                      title={
                        optimizableMine.length > MAX_OPTIMIZE_STOPS
                          ? `Selects the first ${MAX_OPTIMIZE_STOPS} — the most you can optimize at once.`
                          : undefined
                      }
                      className="size-4 rounded border-slate-300"
                      aria-label="Select all on this page"
                    />
                  )}
                </th>
              )}
              <th className="p-3 text-left font-semibold text-slate-500">
                Order
              </th>
              <th className="p-3 text-left font-semibold text-slate-500">
                Category
              </th>
              <th className="p-3 text-left font-semibold text-slate-500">
                Requester
              </th>
              <th className="p-3 text-left font-semibold text-slate-500">
                Contact
              </th>
              <th className="p-3 text-left font-semibold text-slate-500">
                Price
              </th>
              <th className="p-3 text-left font-semibold text-slate-500">
                Requested
              </th>
              <th className="p-3 text-left font-semibold text-slate-500">
                Confirmed pickup
              </th>
              {activeTab === 'history' && (
                <th className="p-3 text-left font-semibold text-slate-500">
                  Status
                </th>
              )}
              <th className="p-3 text-right font-semibold text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
        </table>
      </TableWrapper>
      {isMobile && activeTab === 'mine' && routePreview && (
        <div ref={previewRef} className="scroll-mt-6">
          <OptimizedRoutePreview
            result={routePreview.result}
            origin={routePreview.origin}
            selectedRequests={routePreview.orders}
          />
        </div>
      )}

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
        items={collectTarget?.items ?? []}
      />

      <ConfirmScheduleModal
        requestId={confirmTarget?.id ?? ''}
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirmed={handleScheduleConfirmed}
        initialScheduledAt={confirmTarget?.scheduled_at}
      />

      <OptimizeRouteModal
        inlinePreview={isMobile}
        open={optimizeModalOpen}
        onClose={() => setOptimizeModalOpen(false)}
        selectedRequests={selectedRequests}
        onOptimized={(result, origin) => {
          setOptimizedOrder(
            Object.fromEntries(
              result.stops.map((stop, index) => [stop.request_id, index + 1]),
            ),
          );
          setRoutePreview({ result, origin, orders: [...selectedRequests] });
        }}
      />
    </PageContainer>
  );
};

export { DriverPickupsView };
