'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuMail,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuUser,
  LuUserCheck,
  LuX,
} from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { STATUS_BADGE_VARIANT } from '../constants';
import { usePickupRequest } from '../hooks';
import { PICKUP_STATUS_LABELS } from '../types';
import { CancelModal } from './CancelModal';
import { CollectModal } from './CollectModal';
import { ScheduleModal } from './ScheduleModal';

type PickupRequestDetailsViewProps = {
  requestId: string;
  basePath: '/admin/pickups' | '/staff/pickups';
};

/** Admin and staff have identical permissions on this module — every
 * action below is available to both (see
 * CollectionRequestViewSet.get_permissions). What's actually gated is
 * status: schedule only from `pending`, collect only from `scheduled`,
 * cancel from either — see CollectionRequestDecisionService on the
 * backend, mirrored here so an invalid action never even renders. */
const PickupRequestDetailsView = ({
  requestId,
  basePath,
}: PickupRequestDetailsViewProps) => {
  const { request, loading, error, refetch } = usePickupRequest(requestId);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

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

  const canSchedule = request.status === 'pending';
  const canCollect = request.status === 'scheduled';
  const canCancel =
    request.status === 'pending' || request.status === 'scheduled';

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
        subtitle={`${request.category.name} pickup request`}
        actions={
          <>
            {canSchedule && (
              <button
                type="button"
                onClick={() => setScheduleOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <LuUserCheck className="size-4" />
                Schedule pickup
              </button>
            )}
            {canCollect && (
              <button
                type="button"
                onClick={() => setCollectOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                <LuPackage className="size-4" />
                Mark as collected
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LuX className="size-4" />
                Cancel
              </button>
            )}
          </>
        }
      />

      <div className="mb-5">
        <StatusBadge variant={STATUS_BADGE_VARIANT[request.status]}>
          {PICKUP_STATUS_LABELS[request.status]}
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
            value={request.email}
          />
          <InfoRow
            icon={<LuPhone className="size-4" />}
            label="Phone"
            value={request.phone_number || '—'}
          />
          <InfoRow
            icon={<LuCalendar className="size-4" />}
            label="Requested date"
            value={
              request.requested_date ? (
                <AppDate value={request.requested_date} format="long" />
              ) : (
                '—'
              )
            }
          />
          <InfoRow
            icon={<LuMapPin className="size-4" />}
            label="Pickup address"
            value={request.pickup_address}
          />
          <InfoRow
            icon={<LuPackage className="size-4" />}
            label="Estimated quantity"
            value={
              request.estimated_quantity
                ? `${request.estimated_quantity} ${request.quantity_unit}`
                : '—'
            }
          />
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
      </Card>

      {(request.status === 'scheduled' ||
        request.status === 'collected' ||
        request.status === 'cancelled') && (
        <Card className="mt-4 p-5">
          <p className="mb-3 text-sm font-semibold text-slate-900">
            {request.status === 'cancelled' ? 'Cancellation' : 'Progress'}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {request.assigned_collector && (
              <InfoRow
                icon={<LuUserCheck className="size-4" />}
                label="Assigned collector"
                value={request.assigned_collector}
              />
            )}
            {request.scheduled_at && (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Scheduled for"
                value={<AppDate value={request.scheduled_at} format="long" />}
              />
            )}
            {request.collected_at && (
              <InfoRow
                icon={<LuPackage className="size-4" />}
                label="Collected at"
                value={<AppDate value={request.collected_at} format="long" />}
              />
            )}
            {request.collected_quantity && (
              <InfoRow
                icon={<LuPackage className="size-4" />}
                label="Collected quantity"
                value={`${request.collected_quantity} ${request.quantity_unit}`}
              />
            )}
            {request.cancelled_by && (
              <InfoRow
                icon={<LuUser className="size-4" />}
                label="Cancelled by"
                value={request.cancelled_by}
              />
            )}
          </div>
          {request.cancellation_reason && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {request.cancellation_reason}
            </p>
          )}
        </Card>
      )}

      <ScheduleModal
        requestId={request.id}
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onScheduled={refetch}
      />
      <CollectModal
        requestId={request.id}
        quantityUnit={request.quantity_unit}
        open={collectOpen}
        onClose={() => setCollectOpen(false)}
        onCollected={refetch}
      />
      <CancelModal
        requestId={request.id}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onCancelled={refetch}
      />
    </PageContainer>
  );
};

export { PickupRequestDetailsView };
