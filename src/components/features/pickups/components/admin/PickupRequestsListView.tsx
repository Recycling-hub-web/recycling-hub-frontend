'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuClipboardList, LuPlus } from 'react-icons/lu';

import { SearchInput } from '../../../../form/filter/SearchInput';
import { PageContainer } from '../../../../layout/PageContainer';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import { Button } from '../../../../ui/buttons/Button';
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
import {
  PICKUP_REQUEST_STATUS_BADGE_VARIANT,
  PICKUP_REQUEST_STATUS_FILTER_OPTIONS,
  REQUEST_TYPE_BADGE_VARIANT,
  REQUEST_TYPE_FILTER_OPTIONS,
} from '../../constants';
import { usePickupRequests } from '../../hooks';
import {
  PICKUP_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  type PickupRequestStatus,
  type PickupRequestType,
} from '../../types';

const SEARCH_DEBOUNCE_MS = 350;
const PAGE_SIZE = 12;
const columnCount = 6;

type PickupRequestsListViewProps = {
  basePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

/** Admin/staff list of the customer's own asks — distinct from the
 * Orders queue (OrdersView, still at .../pickups): this shows contact/
 * status/order-count, with a "New request" action that starts the
 * two-step flow (create the request here, then an Order under it from
 * its details page). Admin and staff share identical permissions on
 * this module, same as Orders. */
const PickupRequestsListView = ({ basePath }: PickupRequestsListViewProps) => {
  const router = useRouter();
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
        <td className="max-w-[180px] truncate px-6 py-4 font-medium text-slate-900">
          {r.full_name}
        </td>
        <td className="max-w-[200px] truncate px-6 py-4 text-slate-500">
          {r.email || r.phone_number}
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
        <td className="px-6 py-4 text-slate-700">
          {r.orders.length} order{r.orders.length === 1 ? '' : 's'}
        </td>
        <td className="px-6 py-4 text-slate-500">
          <AppDate value={r.requested_at} format="short" />
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

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="sm:max-w-xs"
        />
        <FilterToggle
          activeCount={[requestTypeFilter, statusFilter].filter(Boolean).length}
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
        </table>
      </TableWrapper>
    </PageContainer>
  );
};

export { PickupRequestsListView };
