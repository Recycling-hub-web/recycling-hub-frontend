'use client';

import { useState } from 'react';

import { PageContainer } from '../../../layout/PageContainer';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import { STATUS_FILTER_OPTIONS } from '../constants';
import { usePickupRequests } from '../hooks';
import type { PickupStatus } from '../types';
import { PickupRequestTable } from './PickupRequestTable';

type PickupRequestsViewProps = {
  basePath: '/admin/pickups' | '/staff/pickups';
};

/** One list view shared by /admin/pickups and /staff/pickups — admin and
 * staff have identical permissions on this module (see
 * CollectionRequestViewSet.get_permissions on the backend), so unlike
 * the contact feature there's no canDelete split to parametrize. */
const PickupRequestsView = ({ basePath }: PickupRequestsViewProps) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PickupStatus | ''>('');

  const { requests, count, loading, error, refetch } = usePickupRequests({
    page,
    status: statusFilter || undefined,
  });

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as PickupStatus | '');
    setPage(1);
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Pickup Requests"
        subtitle="Collection requests submitted from the public site."
      />

      <div className="mb-4 flex justify-end">
        <FilterSelect
          value={statusFilter}
          onChange={handleStatusFilterChange}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <PickupRequestTable
        requests={requests}
        count={count}
        page={page}
        onPageChange={setPage}
        statusFilter={statusFilter}
        loading={loading}
        error={error}
        onRetry={refetch}
        basePath={basePath}
      />
    </PageContainer>
  );
};

export { PickupRequestsView };
