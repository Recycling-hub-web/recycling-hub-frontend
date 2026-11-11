'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  LuClipboardCheck,
  LuClipboardList,
  LuPlus,
  LuTruck,
} from 'react-icons/lu';

import { SearchInput } from '../../../../form/filter/SearchInput';
import { PageContainer } from '../../../../layout/PageContainer';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import { Button } from '../../../../ui/buttons/Button';
import { IconButton } from '../../../../ui/buttons/IconButton';
import { AppDate } from '../../../../ui/date/AppDate';
import { FilterToggle } from '../../../../ui/filters/FilterToggle';
import { FilterSelect } from '../../../../ui/FilterSelect';
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
import {
  PICKUP_REQUEST_STATUS_BADGE_VARIANT,
  PICKUP_REQUEST_STATUS_FILTER_OPTIONS,
  REQUEST_TYPE_BADGE_VARIANT,
  REQUEST_TYPE_FILTER_OPTIONS,
} from '../../constants';
import {
  useMarkQuickPickupRequestContacted,
  usePickupRequests,
  useQuickPickupRequests,
} from '../../hooks';
import {
  PICKUP_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  type PickupQuickRequestListItem,
  type PickupRequestStatus,
  type PickupRequestType,
} from '../../types';
import { BulkAssignDriverModal } from './BulkAssignDriverModal';
import { QuickLeadTable } from './QuickLeadTable';
import {
  evaluableOrders,
  isReevaluation,
  RequestEvaluateModal,
} from './RequestEvaluateModal';

const SEARCH_DEBOUNCE_MS = 350;
const PAGE_SIZE = 12;
const columnCount = 8;

type Tab = 'requests' | 'quick';

const TAB_ITEMS: { key: Tab; label: string }[] = [
  { key: 'requests', label: 'All Requests' },
  { key: 'quick', label: 'Quick Leads' },
];

type PickupRequestsListViewProps = {
  basePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

/** Admin/staff list of the customer's own asks — shows contact/status/
 * order-count, with a "New request" action that starts the two-step
 * flow (create the request here, then an Order under it from its
 * details page). There's no separate Orders list — every Order is
 * only ever browsed via its parent request's own details page (its
 * nested Orders table). Admin and staff share identical permissions
 * on this module. */
const PickupRequestsListContent = ({
  basePath,
}: PickupRequestsListViewProps) => {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(
    searchParams?.get('tab') === 'quick' ? 'quick' : 'requests',
  );
  useEffect(() => {
    setActiveTab(searchParams?.get('tab') === 'quick' ? 'quick' : 'requests');
  }, [searchParams]);

  // Quick leads — a customer asking to be called back. Following one up
  // creates a Pickup Request, so they're listed here. Their links (the
  // follow-up form, a converted lead's order) live under the Orders route.
  const ordersBasePath = basePath.replace('/pickup-requests', '/pickups');
  const {
    requests: quickLeads,
    loading: loadingQuickLeads,
    error: quickLeadsError,
    refetch: refetchQuickLeads,
  } = useQuickPickupRequests();
  const { execute: markContacted } = useMarkQuickPickupRequestContacted();
  const [markingContactedId, setMarkingContactedId] = useState<string | null>(
    null,
  );
  // Converted leads already show up as a real request on All Requests.
  const activeQuickLeads = quickLeads.filter(
    (lead) => lead.status !== 'converted',
  );

  const handleMarkContacted = async (lead: PickupQuickRequestListItem) => {
    setMarkingContactedId(lead.id);
    try {
      await markContacted(lead.id);
      toast.success('Lead marked as contacted');
      refetchQuickLeads();
    } catch {
      toast.error('Could not update this lead');
    } finally {
      setMarkingContactedId(null);
    }
  };
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PickupRequestStatus | ''>(
    '',
  );
  const [requestTypeFilter, setRequestTypeFilter] = useState<
    PickupRequestType | ''
  >('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { requests, count, loading, error, refetch } = usePickupRequests({
    page,
    status: statusFilter || undefined,
    search: search || undefined,
    requestType: requestTypeFilter || undefined,
  });

  // Bulk "Assign driver" — selected per request (matching this table's
  // own grain), resolved down to each request's own eligible order ids
  // right before submit. A request with no pending+approved order of
  // its own just gets no checkbox; one with several still only sends
  // the eligible ones (same rule as the single "Schedule pickup"
  // button on an order's own details page).
  const [selectedRequestIds, setSelectedRequestIds] = useState<Set<string>>(
    new Set(),
  );
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);
  // The request being evaluated from a row's Evaluate icon, if any.
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const evaluatingRequest = requests.find((r) => r.id === evaluatingId);

  const assignableOrderIds = (request: (typeof requests)[number]) =>
    request.orders
      .filter(
        (o) => o.status === 'pending' && o.evaluation_status === 'approved',
      )
      .map((o) => o.id);

  const assignableRequests = requests.filter(
    (r) => assignableOrderIds(r).length > 0,
  );
  const allAssignableSelected =
    assignableRequests.length > 0 &&
    assignableRequests.every((r) => selectedRequestIds.has(r.id));

  const toggleRequestSelected = (id: string) => {
    setSelectedRequestIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllAssignable = () => {
    setSelectedRequestIds(
      allAssignableSelected
        ? new Set()
        : new Set(assignableRequests.map((r) => r.id)),
    );
  };

  const bulkOrderIds = requests
    .filter((r) => selectedRequestIds.has(r.id))
    .flatMap(assignableOrderIds);

  const handleBulkAssigned = () => {
    refetch();
    setSelectedRequestIds(new Set());
    toast.success(
      `${selectedRequestIds.size} request${selectedRequestIds.size === 1 ? '' : 's'} assigned to a driver`,
    );
  };

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error)
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={refetch}
        />
      );
    if (requests.length === 0) {
      let emptySubtitle =
        'Pickup requests from the website or added by staff will show up here.';
      if (search) emptySubtitle = `No matches for "${search}".`;
      else if (statusFilter) emptySubtitle = 'Try a different status filter.';
      return (
        <TableEmptyRow
          colSpan={columnCount}
          icon={<LuClipboardList className="size-6" />}
          title="No pickup requests found"
          subtitle={emptySubtitle}
        />
      );
    }
    return requests.map((r) => (
      <tr
        key={r.id}
        onClick={() => router.push(`${basePath}/${r.id}`)}
        className="cursor-pointer transition-colors hover:bg-slate-50"
      >
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          {assignableOrderIds(r).length > 0 && (
            <input
              type="checkbox"
              checked={selectedRequestIds.has(r.id)}
              onChange={() => toggleRequestSelected(r.id)}
              className="size-4 rounded border-slate-300"
              aria-label={`Select ${r.full_name}`}
            />
          )}
        </td>
        <td className="max-w-[180px] truncate px-6 py-4 font-medium text-slate-900">
          {r.full_name}
        </td>
        <td className="px-6 py-4">
          <WhatsAppLink phoneNumber={r.phone_number} />
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={REQUEST_TYPE_BADGE_VARIANT[r.request_type]}>
            {PICKUP_REQUEST_TYPE_LABELS[r.request_type]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={PICKUP_REQUEST_STATUS_BADGE_VARIANT[r.status]}>
            {PICKUP_REQUEST_STATUS_LABELS[r.status]}
          </StatusBadge>
        </td>
        <td
          className="max-w-[180px] px-6 py-4 text-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          {r.orders.length === 0 ? (
            <span className="text-slate-400">No orders yet</span>
          ) : (
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {r.orders.map((order) => (
                <Link
                  key={order.id}
                  href={`${ordersBasePath}/${order.id}`}
                  className="font-medium text-slate-900 hover:text-brand-600 hover:underline"
                >
                  {order.code}
                </Link>
              ))}
            </div>
          )}
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={r.requested_at} format="short" />
        </td>
        <td
          className="px-6 py-4 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          {evaluableOrders(r.orders).length > 0 && (
            <IconButton
              variant="ghost"
              icon={<LuClipboardCheck className="size-5" />}
              title={`${isReevaluation(r.orders) ? 'Re-evaluate' : 'Evaluate'} ${r.full_name}`}
              onClick={() => setEvaluatingId(r.id)}
            />
          )}
        </td>
      </tr>
    ));
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Pickup Requests"
        subtitle="The customer's ask — collection requests submitted from the public site or added by staff."
        actions={
          <Button href={`${basePath}/create`}>
            <LuPlus className="mr-1.5 size-4" />
            New request
          </Button>
        }
      />

      <Tabs
        tabs={TAB_ITEMS}
        active={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          const params = new URLSearchParams(searchParams?.toString());
          if (tab === 'quick') params.set('tab', 'quick');
          else params.delete('tab');
          const query = params.toString();
          router.replace(query ? `${basePath}?${query}` : basePath, {
            scroll: false,
          });
        }}
        className="-mt-2 mb-4 px-0"
      />

      {activeTab === 'quick' ? (
        <QuickLeadTable
          leads={activeQuickLeads}
          loading={loadingQuickLeads}
          error={quickLeadsError}
          onRetry={refetchQuickLeads}
          basePath={ordersBasePath}
          onMarkContacted={handleMarkContacted}
          markingContactedId={markingContactedId}
        />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <SearchInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="sm:max-w-xs"
            />
            {selectedRequestIds.size > 0 && (
              <div className="ml-auto flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">
                  {selectedRequestIds.size} selected
                </span>
                <Button size="sm" onClick={() => setBulkAssignOpen(true)}>
                  <LuTruck className="mr-1.5 size-4" />
                  Assign driver
                </Button>
              </div>
            )}
            <FilterToggle
              activeCount={
                [requestTypeFilter, statusFilter].filter(Boolean).length
              }
            >
              <FilterSelect
                value={requestTypeFilter}
                onChange={(value) => {
                  setRequestTypeFilter(value as PickupRequestType | '');
                  setPage(1);
                }}
                options={REQUEST_TYPE_FILTER_OPTIONS}
              />
              <FilterSelect
                value={statusFilter}
                onChange={(value) => {
                  setStatusFilter(value as PickupRequestStatus | '');
                  setPage(1);
                }}
                options={PICKUP_REQUEST_STATUS_FILTER_OPTIONS}
              />
            </FilterToggle>
          </div>

          <TableWrapper
            footer={
              <TablePagination
                currentPage={page}
                onPageChange={setPage}
                itemsPerPage={PAGE_SIZE}
                itemCount={requests.length}
                totalCount={count}
                itemLabel="pickup requests"
                loading={loading}
              />
            }
          >
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-10 px-6 py-3">
                    {assignableRequests.length > 0 && (
                      <input
                        type="checkbox"
                        checked={allAssignableSelected}
                        onChange={toggleSelectAllAssignable}
                        className="size-4 rounded border-slate-300"
                        aria-label="Select all assignable requests"
                      />
                    )}
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Requested for
                  </th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {renderRows()}
              </tbody>
            </table>
          </TableWrapper>
        </>
      )}

      <RequestEvaluateModal
        pickupRequestId={evaluatingRequest?.id ?? ''}
        orders={evaluatingRequest?.orders ?? []}
        open={Boolean(evaluatingRequest)}
        onClose={() => setEvaluatingId(null)}
        onEvaluated={() => {
          toast.success(
            'Pickup request evaluated',
            `${evaluatingRequest?.full_name}'s orders were updated.`,
          );
          refetch();
        }}
      />
      <BulkAssignDriverModal
        orderIds={bulkOrderIds}
        open={bulkAssignOpen}
        onClose={() => setBulkAssignOpen(false)}
        onAssigned={handleBulkAssigned}
      />
    </PageContainer>
  );
};

const PickupRequestsListView = (props: PickupRequestsListViewProps) => (
  <Suspense fallback={<p role="status">Loading pickup requests…</p>}>
    <PickupRequestsListContent {...props} />
  </Suspense>
);

export { PickupRequestsListView };
