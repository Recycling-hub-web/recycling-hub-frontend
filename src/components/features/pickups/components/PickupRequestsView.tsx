'use client';

import { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import { SearchInput } from '../../../form/filter/SearchInput';
import { PageContainer } from '../../../layout/PageContainer';
import { Button } from '../../../ui/buttons/Button';
import { FilterSelect } from '../../../ui/FilterSelect';
import { ConfirmModal } from '../../../ui/modal/ConfirmModal';
import { PageHeader } from '../../../ui/PageHeader';
import { Tabs } from '../../../ui/tabs';
import { useToast } from '../../../ui/toast/ToastContext';
import {
  REQUEST_TYPE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from '../constants';
import {
  useDeletePickupRequest,
  useMarkQuickPickupRequestContacted,
  usePickupRequests,
  useQuickPickupRequests,
} from '../hooks';
import type {
  PickupQuickRequestListItem,
  PickupRequestListItem,
  PickupRequestType,
  PickupStatus,
} from '../types';
import { PickupRequestTable } from './PickupRequestTable';
import { QuickLeadTable } from './QuickLeadTable';

const SEARCH_DEBOUNCE_MS = 350;

type PickupRequestsViewProps = {
  basePath: '/admin/pickups' | '/staff/pickups';
};

type Tab = 'requests' | 'quick';

const TAB_ITEMS: { key: Tab; label: string }[] = [
  { key: 'requests', label: 'All Requests' },
  { key: 'quick', label: 'Quick Leads' },
];

/** One list view shared by /admin/pickups and /staff/pickups — admin and
 * staff have identical permissions on this module (see
 * CollectionRequestViewSet.get_permissions on the backend), so unlike
 * the contact feature there's no canDelete split to parametrize. */
const PickupRequestsView = ({ basePath }: PickupRequestsViewProps) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('requests');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PickupStatus | ''>('');
  const [requestTypeFilter, setRequestTypeFilter] = useState<
    PickupRequestType | ''
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

  const { requests, count, loading, error, refetch } = usePickupRequests({
    page,
    status: statusFilter || undefined,
    search: search || undefined,
    requestType: requestTypeFilter || undefined,
  });
  const { execute: deleteRequest, loading: deleting } =
    useDeletePickupRequest();
  const [pendingDelete, setPendingDelete] =
    useState<PickupRequestListItem | null>(null);
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

  // Converted leads already show up as a real request on the All
  // Requests tab — see useQuickPickupRequests' own docstring for why
  // this filters client-side instead of asking the backend for one
  // exact status.
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

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteRequest(pendingDelete.id);
      toast.success(
        'Pickup request deleted',
        `The request from ${pendingDelete.full_name} has been removed.`,
      );
      setPendingDelete(null);
      refetch();
    } catch {
      toast.error('Could not delete this pickup request');
    }
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Pickup Requests"
        subtitle="Collection requests submitted from the public site."
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
        onChange={setActiveTab}
        className="-mt-2 mb-4 px-0"
      />

      {activeTab === 'requests' ? (
        <>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <SearchInput
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="sm:max-w-xs"
            />
            <div className="flex gap-2">
              <FilterSelect
                value={requestTypeFilter}
                onChange={handleRequestTypeFilterChange}
                options={REQUEST_TYPE_FILTER_OPTIONS}
              />
              <FilterSelect
                value={statusFilter}
                onChange={handleStatusFilterChange}
                options={STATUS_FILTER_OPTIONS}
              />
            </div>
          </div>

          <PickupRequestTable
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
        title="Delete pickup request"
        message={`Are you sure you want to delete the pickup request from ${pendingDelete?.full_name}? This cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
        loading={deleting}
      />
    </PageContainer>
  );
};

export { PickupRequestsView };
