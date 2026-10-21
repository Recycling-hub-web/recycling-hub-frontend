'use client';

import { useEffect, useState } from 'react';
import { LuClipboardList } from 'react-icons/lu';

import { SearchInput } from '../../../../form/filter/SearchInput';
import { PageContainer } from '../../../../layout/PageContainer';
import { Button } from '../../../../ui/buttons/Button';
import { FilterToggle } from '../../../../ui/filters/FilterToggle';
import { FilterSelect } from '../../../../ui/FilterSelect';
import { ConfirmModal } from '../../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../../ui/PageHeader';
import { Tabs } from '../../../../ui/tabs';
import { useToast } from '../../../../ui/toast/ToastContext';
import {
  EVALUATION_STATUS_FILTER_OPTIONS,
  REQUEST_TYPE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '../../constants';
import {
  useDeleteOrder,
  useEvaluatePickup,
  useMarkQuickPickupRequestContacted,
  useOrders,
  useQuickPickupRequests,
} from '../../hooks';
import type {
  CollectionRequestListItem,
  PickupEvaluationStatus,
  PickupQuickRequestListItem,
  PickupRequestType,
  PickupStatus,
} from '../../types';
import { EvaluateModal } from './EvaluateModal';
import { OrderTable } from './OrderTable';
import { QuickLeadTable } from './QuickLeadTable';

const SEARCH_DEBOUNCE_MS = 350;

type OrdersViewProps = {
  basePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
  /** The matching Pickup Requests list's base path — where new work
   * now originates (an Order can't be created without a parent
   * request, so this view's old "New request" action now points
   * there instead). */
  requestsBasePath: string;
};

type Tab = 'orders' | 'quick';

const TAB_ITEMS: { key: Tab; label: string }[] = [
  { key: 'orders', label: 'All Orders' },
  { key: 'quick', label: 'Quick Leads' },
];

/** One list view shared by /super-admin/pickups and /staff/pickups — admin and
 * staff have identical permissions on this module (see
 * CollectionRequestViewSet.get_permissions on the backend), so unlike
 * the contact feature there's no canDelete split to parametrize.
 * Renamed from PickupRequestsView now that this lists Orders, not the
 * higher-level PickupRequest. */
const OrdersView = ({ basePath, requestsBasePath }: OrdersViewProps) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PickupStatus | ''>('');
  const [requestTypeFilter, setRequestTypeFilter] = useState<
    PickupRequestType | ''
  >('');
  const [evaluationStatusFilter, setEvaluationStatusFilter] = useState<
    PickupEvaluationStatus | ''
  >('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  // Debounced so search doesn't fire the real backend query on every
  // keystroke — same pattern as AdminUsersView.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const { requests, count, loading, error, refetch } = useOrders({
    page,
    status: statusFilter || undefined,
    search: search || undefined,
    requestType: requestTypeFilter || undefined,
    evaluationStatus: evaluationStatusFilter || undefined,
  });
  const { execute: deleteRequest, loading: deleting } = useDeleteOrder();
  const [pendingDelete, setPendingDelete] =
    useState<CollectionRequestListItem | null>(null);
  const { execute: evaluateRequest } = useEvaluatePickup();
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  // Approving always requires a price (see EvaluateModal) — unlike
  // rejecting, a table-row Approve click can't just call the API
  // directly, so it opens this same modal the details page uses instead.
  const [pendingApprove, setPendingApprove] =
    useState<CollectionRequestListItem | null>(null);
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

  // Converted leads already show up as a real Order on the All Orders
  // tab — see useQuickPickupRequests' own docstring for why this
  // filters client-side instead of asking the backend for one exact
  // status.
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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as PickupStatus | '');
    setPage(1);
  };

  const handleRequestTypeFilterChange = (value: string) => {
    setRequestTypeFilter(value as PickupRequestType | '');
    setPage(1);
  };

  const handleEvaluationStatusFilterChange = (value: string) => {
    setEvaluationStatusFilter(value as PickupEvaluationStatus | '');
    setPage(1);
  };

  const handleEvaluate = async (
    request: CollectionRequestListItem,
    decision: 'approved' | 'rejected',
  ) => {
    setEvaluatingId(request.id);
    try {
      await evaluateRequest(request.id, { decision });
      toast.success(
        decision === 'approved' ? 'Order approved' : 'Order rejected',
      );
      refetch();
    } catch {
      toast.error('Could not evaluate this order');
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteRequest(pendingDelete.id);
      toast.success(
        'Order deleted',
        `Order ${pendingDelete.code} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch {
      toast.error('Could not delete this order');
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Orders"
        subtitle="Materials/items staff have created under a pickup request."
        actions={
          <Button href={requestsBasePath} variant="secondary">
            <LuClipboardList className="mr-1.5 size-4" />
            View Pickup Requests
          </Button>
        }
      />

      <Tabs
        tabs={TAB_ITEMS}
        active={activeTab}
        onChange={setActiveTab}
        className="-mt-2 mb-4 px-0"
      />

      {activeTab === 'orders' ? (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <SearchInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, phone, or code…"
              className="sm:max-w-xs"
            />
            <FilterToggle
              activeCount={
                [
                  requestTypeFilter,
                  evaluationStatusFilter,
                  statusFilter,
                ].filter(Boolean).length
              }
            >
              <FilterSelect
                value={requestTypeFilter}
                onChange={handleRequestTypeFilterChange}
                options={REQUEST_TYPE_FILTER_OPTIONS}
              />
              <FilterSelect
                value={evaluationStatusFilter}
                onChange={handleEvaluationStatusFilterChange}
                options={EVALUATION_STATUS_FILTER_OPTIONS}
              />
              <FilterSelect
                value={statusFilter}
                onChange={handleStatusFilterChange}
                options={STATUS_FILTER_OPTIONS}
              />
            </FilterToggle>
          </div>

          <OrderTable
            requests={requests}
            count={count}
            search={search}
            page={page}
            onPageChange={setPage}
            statusFilter={statusFilter}
            loading={loading}
            error={error}
            onRetry={refetch}
            basePath={basePath}
            onDeleteRequest={setPendingDelete}
            onApprove={setPendingApprove}
            onReject={(request) => handleEvaluate(request, 'rejected')}
            evaluatingId={evaluatingId}
          />
        </>
      ) : (
        <QuickLeadTable
          leads={activeQuickLeads}
          loading={loadingQuickLeads}
          error={quickLeadsError}
          onRetry={refetchQuickLeads}
          basePath={basePath}
          onMarkContacted={handleMarkContacted}
          markingContactedId={markingContactedId}
        />
      )}

      <ConfirmModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete order"
        message={`Are you sure you want to delete order ${pendingDelete?.code}? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />

      <EvaluateModal
        requestId={pendingApprove?.id ?? ''}
        open={Boolean(pendingApprove)}
        onClose={() => setPendingApprove(null)}
        onEvaluated={() => {
          setPendingApprove(null);
          toast.success('Evaluation saved');
          refetch();
        }}
        items={pendingApprove?.items}
      />
    </PageContainer>
  );
};

export { OrdersView };
