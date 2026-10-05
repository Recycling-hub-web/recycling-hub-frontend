'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuClipboardCheck,
  LuMail,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuTruck,
  LuUser,
  LuUserCheck,
  LuX,
} from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { Button } from '../../../ui/buttons/Button';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import { useToast } from '../../../ui/toast/ToastContext';
import { ActivityLog } from '../../activity/components';
import {
  EVALUATION_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
  STATUS_BADGE_VARIANT,
} from '../constants';
import { usePickupRequest } from '../hooks';
import {
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STATUS_LABELS,
} from '../types';
import { AssignDriverModal } from './AssignDriverModal';
import { CancelModal } from './CancelModal';
import { CollectModal } from './CollectModal';
import { EvaluateModal } from './EvaluateModal';
import { ScheduleModal } from './ScheduleModal';

type PickupRequestDetailsViewProps = {
  requestId: string;
  basePath: '/admin/pickups' | '/staff/pickups';
};

/** Admin and staff have identical permissions on this module — every
 * action below is available to both (see
 * CollectionRequestViewSet.get_permissions). What's actually gated is
 * status: evaluate only from `pending`, schedule only from `pending` +
 * `evaluation_status=approved`, collect only from `scheduled`, cancel
 * from either — see CollectionRequestDecisionService on the backend,
 * mirrored here so an invalid action never even renders. */
const PickupRequestDetailsView = ({
  requestId,
  basePath,
}: PickupRequestDetailsViewProps) => {
  const { request, loading, error, refetch } = usePickupRequest(requestId);
  const toast = useToast();
  const [evaluateOpen, setEvaluateOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [assignDriverOpen, setAssignDriverOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Secondary/internal actions on a record — stay on this page (no
  // navigation) and refresh it, but always pair that with an explicit
  // toast: landing back on the same page a modal action was triggered
  // from can't otherwise be distinguished from nothing having happened.
  const handleEvaluated = () => {
    refetch();
    toast.success('Evaluation saved');
  };
  const handleScheduled = () => {
    refetch();
    toast.success('Pickup scheduled');
  };
  const handleDriverAssigned = () => {
    refetch();
    toast.success('Driver assigned');
  };
  const handleCollected = () => {
    refetch();
    toast.success('Marked as collected');
  };
  const handleCancelled = () => {
    refetch();
    toast.success('Pickup cancelled');
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

  const canEvaluate = request.status === 'pending';
  const canSchedule =
    request.status === 'pending' && request.evaluation_status === 'approved';
  // Two independent ways to reach `scheduled` — assigning a driver here
  // doesn't require the collector+time Schedule flow, and vice versa;
  // both disappear together once either succeeds (status moves off
  // `pending`).
  const canAssignDriver = canSchedule;
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
            {canEvaluate && (
              <Button variant="secondary" onClick={() => setEvaluateOpen(true)}>
                <LuClipboardCheck className="mr-1.5 size-4" />
                Evaluate
              </Button>
            )}
            {canSchedule && (
              <Button onClick={() => setScheduleOpen(true)}>
                <LuUserCheck className="mr-1.5 size-4" />
                Schedule pickup
              </Button>
            )}
            {canAssignDriver && (
              <Button
                variant="secondary"
                onClick={() => setAssignDriverOpen(true)}
              >
                <LuTruck className="mr-1.5 size-4" />
                Assign driver
              </Button>
            )}
            {canCollect && (
              <Button onClick={() => setCollectOpen(true)}>
                <LuPackage className="mr-1.5 size-4" />
                Mark as collected
              </Button>
            )}
            {canCancel && (
              <Button
                variant="danger-outline"
                onClick={() => setCancelOpen(true)}
              >
                <LuX className="mr-1.5 size-4" />
                Cancel
              </Button>
            )}
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <StatusBadge variant={REQUEST_TYPE_BADGE_VARIANT[request.request_type]}>
          {PICKUP_REQUEST_TYPE_LABELS[request.request_type]}
        </StatusBadge>
        <StatusBadge variant={STATUS_BADGE_VARIANT[request.status]}>
          {PICKUP_STATUS_LABELS[request.status]}
        </StatusBadge>
        <StatusBadge
          variant={EVALUATION_STATUS_BADGE_VARIANT[request.evaluation_status]}
        >
          {PICKUP_EVALUATION_STATUS_LABELS[request.evaluation_status]}
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

        {request.evaluation_status !== 'pending' && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Evaluation
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {request.price && (
                <InfoRow
                  icon={<LuPackage className="size-4" />}
                  label="Price"
                  value={request.price}
                />
              )}
              {request.evaluated_by && (
                <InfoRow
                  icon={<LuUser className="size-4" />}
                  label="Evaluated by"
                  value={request.evaluated_by}
                />
              )}
              {request.evaluated_at && (
                <InfoRow
                  icon={<LuCalendar className="size-4" />}
                  label="Evaluated at"
                  value={<AppDate value={request.evaluated_at} format="long" />}
                />
              )}
            </div>
            {request.evaluation_note && (
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {request.evaluation_note}
              </p>
            )}
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
            {request.assigned_driver && (
              <InfoRow
                icon={<LuTruck className="size-4" />}
                label="Assigned driver"
                value={request.assigned_driver}
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

      <Card className="mt-4 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-900">Activity</p>
        <ActivityLog entityType="collectionrequest" entityId={request.id} />
      </Card>

      <EvaluateModal
        requestId={request.id}
        open={evaluateOpen}
        onClose={() => setEvaluateOpen(false)}
        onEvaluated={handleEvaluated}
      />
      <ScheduleModal
        requestId={request.id}
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onScheduled={handleScheduled}
      />
      <AssignDriverModal
        requestId={request.id}
        open={assignDriverOpen}
        onClose={() => setAssignDriverOpen(false)}
        onAssigned={handleDriverAssigned}
      />
      <CollectModal
        requestId={request.id}
        quantityUnit={request.quantity_unit}
        open={collectOpen}
        onClose={() => setCollectOpen(false)}
        onCollected={handleCollected}
      />
      <CancelModal
        requestId={request.id}
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onCancelled={handleCancelled}
      />
    </PageContainer>
  );
};

export { PickupRequestDetailsView };
