'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuMail,
  LuMapPin,
  LuPackage,
  LuPencil,
  LuPhone,
  LuPlus,
  LuUser,
  LuX,
} from 'react-icons/lu';

import { PageContainer } from '../../../../layout/PageContainer';
import { StatusBadge } from '../../../../ui/badges/StatusBadge';
import { Button } from '../../../../ui/buttons/Button';
import { Card } from '../../../../ui/card/Card';
import { AppDate } from '../../../../ui/date/AppDate';
import { InfoRow } from '../../../../ui/InfoRow';
import { Loading } from '../../../../ui/loading/Loading';
import { PageHeader } from '../../../../ui/PageHeader';
import { TableEmptyRow, TableWrapper } from '../../../../ui/table';
import { useToast } from '../../../../ui/toast/ToastContext';
import {
  PICKUP_REQUEST_STATUS_BADGE_VARIANT,
  PICKUP_STAGE_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
} from '../../constants';
import { usePickupRequest } from '../../hooks';
import {
  derivePickupStage,
  itemsSummary,
  PICKUP_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STAGE_LABELS,
} from '../../types';
import { CancelPickupRequestModal } from './CancelPickupRequestModal';

const MAX_ORDERS_PER_PICKUP_REQUEST = 7;

type PickupRequestDetailsViewProps = {
  requestId: string;
  basePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
  /** The matching Orders basePath (e.g. /admin/pickups) — where each
   * nested order's row links to. */
  ordersBasePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
};

/** The customer's ask — its own contact/address/date fields plus a
 * table of the Orders created under it. "Create order" starts
 * CreateOrderView, scoped to this request; "Cancel request" cascades
 * to every non-terminal Order (see CancelPickupRequestModal). Admin
 * and staff share identical permissions on this module. */
const PickupRequestDetailsView = ({
  requestId,
  basePath,
  ordersBasePath,
}: PickupRequestDetailsViewProps) => {
  const { request, loading, error, refetch } = usePickupRequest(requestId);
  const toast = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleCancelled = () => {
    refetch();
    toast.success('Pickup request cancelled');
  };

  if (loading) return <Loading text="Loading pickup request…" />;

  if (error || !request) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Pickup request not found.'}{' '}
        <button
          type="button"
          onClick={refetch}
          className="font-semibold underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const canEdit = request.status === 'open';
  const canCancel = request.status === 'open';
  const canCreateOrder =
    request.status === 'open' &&
    request.orders.length < MAX_ORDERS_PER_PICKUP_REQUEST;

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup requests
      </Link>

      <PageHeader
        title={request.full_name}
        subtitle={`${request.orders.length} order${request.orders.length === 1 ? '' : 's'}`}
        actions={
          <>
            {canEdit && (
              <Button
                variant="secondary"
                href={`${basePath}/${request.id}/edit`}
              >
                <LuPencil className="mr-1.5 size-4" />
                Edit
              </Button>
            )}
            {canCreateOrder && (
              <Button href={`${basePath}/${request.id}/orders/create`}>
                <LuPlus className="mr-1.5 size-4" />
                Create order
              </Button>
            )}
            {canCancel && (
              <Button
                variant="danger-outline"
                onClick={() => setCancelOpen(true)}
              >
                <LuX className="mr-1.5 size-4" />
                Cancel request
              </Button>
            )}
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <StatusBadge variant={REQUEST_TYPE_BADGE_VARIANT[request.request_type]}>
          {PICKUP_REQUEST_TYPE_LABELS[request.request_type]}
        </StatusBadge>
        <StatusBadge
          variant={PICKUP_REQUEST_STATUS_BADGE_VARIANT[request.status]}
        >
          {PICKUP_REQUEST_STATUS_LABELS[request.status]}
        </StatusBadge>
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow
            icon={<LuUser className="size-4" />}
            label="Requester"
            value={request.full_name}
          />
          <InfoRow
            icon={<LuMail className="size-4" />}
            label="Email"
            value={request.email || '—'}
          />
          <InfoRow
            icon={<LuPhone className="size-4" />}
            label="Phone"
            value={request.phone_number || '—'}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Requested for"
            value={<AppDate value={request.requested_at} format="long" />}
          />
          <div className="sm:col-span-2">
            <InfoRow
              icon={<LuMapPin className="size-4" />}
              label="Pickup address"
              value={request.pickup_address}
            />
          </div>
        </div>

        {request.collection_point && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Drop-off collection point
            </p>
            <p className="text-sm text-slate-700">
              {request.collection_point.name} —{' '}
              {request.collection_point.address}
            </p>
          </div>
        )}

        {request.note && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Note
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {request.note}
            </p>
          </div>
        )}

        {request.status === 'cancelled' && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Cancellation
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {request.cancelled_by && (
                <InfoRow
                  icon={<LuUser className="size-4" />}
                  label="Cancelled by"
                  value={request.cancelled_by}
                />
              )}
              {request.cancelled_at && (
                <InfoRow
                  icon={<LuCalendar className="size-4" />}
                  label="Cancelled at"
                  value={<AppDate value={request.cancelled_at} format="long" />}
                />
              )}
            </div>
            {request.cancellation_reason && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {request.cancellation_reason}
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="mt-4 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">Orders</p>
        {request.orders.length === 0 ? (
          <TableWrapper>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <tbody>
                <TableEmptyRow
                  colSpan={1}
                  icon={<LuPackage className="size-6" />}
                  title="No orders yet"
                  subtitle="Create one to start the materials/pricing/driver workflow."
                />
              </tbody>
            </table>
          </TableWrapper>
        ) : (
          <TableWrapper>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-500">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {request.orders.map((order) => {
                  const stage = derivePickupStage(
                    order.status,
                    order.evaluation_status,
                  );
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <Link
                          href={`${ordersBasePath}/${order.id}`}
                          className="hover:text-brand-600"
                        >
                          {order.code}
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-6 py-4 text-slate-700">
                        {itemsSummary(order.items)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          variant={PICKUP_STAGE_BADGE_VARIANT[stage]}
                        >
                          {PICKUP_STAGE_LABELS[stage]}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {order.price ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <AppDate
                          value={order.requested_date ?? request.created_at}
                          format="short"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableWrapper>
        )}
      </Card>

      <CancelPickupRequestModal
        pickupRequestId={request.id}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onCancelled={handleCancelled}
      />
    </PageContainer>
  );
};

export { PickupRequestDetailsView };
