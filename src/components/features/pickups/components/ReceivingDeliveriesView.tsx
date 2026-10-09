'use client';

import { useState } from 'react';
import { LuCheckCheck } from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { FilterSelect } from '../../../ui/FilterSelect';
import { PageHeader } from '../../../ui/PageHeader';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TableWrapper,
} from '../../../ui/table';
import { useToast } from '../../../ui/toast/ToastContext';
import { STATUS_BADGE_VARIANT } from '../constants';
import { useCloseDelivery, usePickupRequests } from '../hooks';
import { PICKUP_STATUS_LABELS, type PickupStatus } from '../types';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'delivered', label: 'Delivered — awaiting verification' },
  { value: 'closed', label: 'Closed' },
];

/** Receiving Officer's own queue — the backend already scopes `list`
 * to `delivered`/`closed` only for this role (see
 * CollectionRequestViewSet.get_queryset), so there's nothing before a
 * driver's route has been dropped off to show here. */
const ReceivingDeliveriesView = () => {
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<PickupStatus | ''>(
    'delivered',
  );
  const { requests, loading, error, refetch } = usePickupRequests({
    page: 1,
    status: statusFilter || undefined,
  });
  const { execute: close, loading: closing } = useCloseDelivery();
  const [closingId, setClosingId] = useState<string | null>(null);

  const handleClose = async (id: string) => {
    setClosingId(id);
    try {
      await close(id);
      toast.success('Verified and closed');
      refetch();
    } catch {
      toast.error('Could not close this request. Please try again.');
    } finally {
      setClosingId(null);
    }
  };

  const columnCount = 4;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error) {
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={error}
          onRetry={refetch}
        />
      );
    }
    if (requests.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          title="Nothing to verify yet"
          subtitle="Delivered requests will show up here once a driver drops off their route."
        />
      );
    }
    return requests.map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">{r.full_name}</td>
        <td className="px-6 py-4 text-slate-700">
          {r.category.name} —{' '}
          {r.delivered_quantity ?? r.collected_quantity ?? '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[r.status]}>
            {PICKUP_STATUS_LABELS[r.status]}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          {r.status === 'delivered' && (
            <button
              type="button"
              disabled={closing && closingId === r.id}
              onClick={() => handleClose(r.id)}
              aria-label={`Verify and close delivery from ${r.full_name}`}
              className="inline-flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuCheckCheck className="size-4" />
            </button>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <PageContainer variant="table">
      <PageHeader
        title="Deliveries"
        subtitle="Verify and close requests once a driver's route has been dropped off."
      />

      <div className="mb-4 flex justify-end">
        <FilterSelect
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as PickupStatus | '')}
          options={STATUS_FILTER_OPTIONS}
        />
      </div>

      <TableWrapper>
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Requester
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Category / quantity
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Status
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
        </table>
      </TableWrapper>
    </PageContainer>
  );
};

export { ReceivingDeliveriesView };
