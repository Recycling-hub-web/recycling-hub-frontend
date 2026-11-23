'use client';

import { useState } from 'react';
import { LuCheckCheck, LuPackageCheck } from 'react-icons/lu';

import { usePortalLocale } from '../../../../../contexts/PortalLocaleContext';
import { PageContainer } from '../../../../layout/PageContainer';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import { FilterSelect } from '../../../../ui/FilterSelect';
import { PageHeader } from '../../../../ui/PageHeader';
import {
  TableEmptyRow,
  TableErrorRow,
  TableLoadingRow,
  TablePagination,
  TableWrapper,
} from '../../../../ui/table';
import { useToast } from '../../../../ui/toast/ToastContext';
import { STATUS_BADGE_VARIANT } from '../../constants';
import { useCloseDelivery, useCollectionPoints, useOrders } from '../../hooks';
import { PICKUP_STATUS_LABELS, type PickupStatus } from '../../types';
import { formatQuantity } from '../../units';

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
  const { t } = usePortalLocale();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<PickupStatus | ''>(
    'delivered',
  );
  const [storeFilter, setStoreFilter] = useState('');
  const {
    collectionPoints,
    error: pointsError,
    refetch: retryPoints,
  } = useCollectionPoints(true);
  const storeOptions = [
    { value: '', label: t('All stores') },
    ...collectionPoints.map((p) => ({ value: p.id, label: p.name })),
  ];
  const { requests, count, loading, error, refetch } = useOrders({
    page,
    status: statusFilter || undefined,
    dropOffPoint: storeFilter || undefined,
  });
  const { execute: close, loading: closing } = useCloseDelivery();
  const [closingId, setClosingId] = useState<string | null>(null);

  const handleClose = async (id: string) => {
    if (closing) return;
    setClosingId(id);
    try {
      await close(id);
      toast.success(t('Verified and closed'));
      if (page === 1) refetch();
      else setPage(1);
    } catch {
      toast.error(t('Could not close this request. Please try again.'));
    } finally {
      setClosingId(null);
    }
  };

  const columnCount = 6;

  const renderRows = () => {
    if (loading) return <TableLoadingRow colSpan={columnCount} />;
    if (error) {
      return (
        <TableErrorRow
          colSpan={columnCount}
          message={t(error ?? '')}
          onRetry={refetch}
        />
      );
    }
    if (requests.length === 0) {
      return (
        <TableEmptyRow
          colSpan={columnCount}
          icon={<LuPackageCheck className="size-6" />}
          title={t('Nothing to verify yet')}
          subtitle={t(
            'Delivered requests will show up here once a driver drops off their route.',
          )}
        />
      );
    }
    return requests.map((r) => (
      <tr key={r.id} className="transition-colors hover:bg-slate-50">
        <td className="px-6 py-4 font-medium text-slate-900">{r.code}</td>
        <td className="px-6 py-4 text-slate-700">
          {r.pickup_request.full_name}
        </td>
        <td className="px-6 py-4 text-slate-700">
          <ul className="space-y-1">
            {r.items.map((item) => (
              <li key={item.id}>
                {item.category.name} — collected{' '}
                {formatQuantity(item.collected_quantity, item.quantity_unit)}
              </li>
            ))}
          </ul>
          {r.items.length === 0 && '—'}
          {r.delivered_quantity != null && (
            <p className="mt-1 text-xs text-slate-600">
              Delivered total:{' '}
              {new Set(r.items.map((item) => item.quantity_unit)).size === 1
                ? formatQuantity(
                    r.delivered_quantity,
                    r.items[0]?.quantity_unit,
                  )
                : `${r.delivered_quantity} (unit not specified)`}
            </p>
          )}
        </td>
        <td className="px-6 py-4 text-slate-700">
          {r.route?.collection_point?.name ?? '—'}
        </td>
        <td className="px-6 py-4">
          <StatusBadge variant={STATUS_BADGE_VARIANT[r.status]}>
            {t(PICKUP_STATUS_LABELS[r.status])}
          </StatusBadge>
        </td>
        <td className="px-6 py-4">
          {r.status === 'delivered' && (
            <button
              type="button"
              disabled={closing}
              aria-busy={closing && closingId === r.id}
              onClick={() => handleClose(r.id)}
              aria-label={`Verify and close ${r.code} from ${r.pickup_request.full_name}`}
              title={`Verify and close ${r.code}`}
              className="inline-flex size-11 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
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
        title={t('Deliveries')}
        subtitle={t(
          "Verify and close requests once a driver's route has been dropped off.",
        )}
      />

      <div className="mb-4 flex flex-wrap justify-end gap-2">
        <FilterSelect
          ariaLabel={t('Store')}
          value={storeFilter}
          onChange={(value) => {
            setStoreFilter(value);
            setPage(1);
          }}
          options={storeOptions}
        />
        <FilterSelect
          ariaLabel={t('Status')}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter(value as PickupStatus | '');
            setPage(1);
          }}
          options={STATUS_FILTER_OPTIONS.map((item) => ({
            ...item,
            label: t(item.label),
          }))}
        />
      </div>

      {pointsError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>{t(pointsError ?? '')}</p>
          <button
            type="button"
            onClick={retryPoints}
            className="min-h-11 px-3 font-semibold underline"
          >
            {t('Retry collection points')}
          </button>
        </div>
      )}
      <TableWrapper
        footer={
          !error && (
            <TablePagination
              currentPage={page}
              onPageChange={setPage}
              itemsPerPage={12}
              itemCount={requests.length}
              totalCount={count}
              itemLabel="deliveries"
              loading={loading}
            />
          )
        }
      >
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Order')}
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Requester')}
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Category / quantity')}
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Store')}
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Status')}
              </th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">
                {t('Action')}
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
