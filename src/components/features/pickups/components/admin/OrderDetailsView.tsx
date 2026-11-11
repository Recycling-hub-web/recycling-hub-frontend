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
import { useToast } from '../../../../ui/toast/ToastContext';
import {
  EVALUATION_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
  STATUS_BADGE_VARIANT,
} from '../../constants';
import { useOrder } from '../../hooks';
import {
  itemsSummary,
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
  PICKUP_STATUS_LABELS,
} from '../../types';
import { formatQuantity } from '../../units';
import { CollectModal } from '../shared/CollectModal';
import { OrderRecordTabs } from '../shared/OrderRecordTabs';
import { AssignDriverModal } from './AssignDriverModal';
import { CancelModal } from './CancelModal';
import { EvaluateModal } from './EvaluateModal';

type OrderDetailsViewProps = {
  requestId: string;
  basePath: '/admin/pickups' | '/staff/pickups' | '/super-admin/pickups';
  /** The matching Pickup Requests base path (e.g. /admin/pickup-requests)
   * — for the link back to the parent request. */
  requestsBasePath: string;
};

/** Admin and staff have identical permissions on this module — every
 * action below is available to both (see
 * CollectionRequestViewSet.get_permissions). What's actually gated is
 * status: evaluate only from `pending`, schedule only from `pending` +
 * `evaluation_status=approved`, collect only from `scheduled`, cancel
 * from either — see CollectionRequestDecisionService on the backend,
 * mirrored here so an invalid action never even renders. */
const OrderDetailsView = ({
  requestId,
  basePath,
  requestsBasePath,
}: OrderDetailsViewProps) => {
  const { request, loading, error, refetch } = useOrder(requestId);
  const toast = useToast();
  const [evaluateOpen, setEvaluateOpen] = useState(false);
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
  const handleDriverAssigned = () => {
    refetch();
    toast.success('Pickup scheduled');
  };
  const handleCollected = () => {
    refetch();
    toast.success('Marked as collected');
  };
  const handleCancelled = () => {
    refetch();
    toast.success('Pickup cancelled');
  };

  if (loading && !request) return <Loading text="Loading order…" />;

  if (error || !request) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error || 'Order not found.'}{' '}
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

  // Pending, or scheduled: re-pricing keeps the driver, rejecting takes
  // the order back off them (see CollectionRequestDecisionService.evaluate).
  const canEvaluate =
    request.status === 'pending' || request.status === 'scheduled';
  const isReevaluation = request.evaluation_status !== 'pending';
  // Scheduling only ever assigns a driver — see AssignDriverModal.
  const canAssignDriver =
    request.status === 'pending' && request.evaluation_status === 'approved';
  const canCollect = request.status === 'scheduled';
  const canCancel =
    request.status === 'pending' || request.status === 'scheduled';

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        Back to orders
      </Link>

      <PageHeader
        title={request.code}
        subtitle={`${request.pickup_request.full_name} — ${itemsSummary(request.items)}`}
        actions={
          <>
            <Button
              variant="secondary"
              href={`${requestsBasePath}/${request.pickup_request.id}`}
            >
              View pickup request
            </Button>
            {canEvaluate && (
              <Button variant="secondary" onClick={() => setEvaluateOpen(true)}>
                <LuClipboardCheck className="mr-1.5 size-4" />
                {isReevaluation ? 'Re-evaluate' : 'Evaluate'}
              </Button>
            )}
            {canAssignDriver && (
              <Button onClick={() => setAssignDriverOpen(true)}>
                <LuTruck className="mr-1.5 size-4" />
                Schedule pickup
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
        <StatusBadge
          variant={
            REQUEST_TYPE_BADGE_VARIANT[request.pickup_request.request_type]
          }
        >
          {PICKUP_REQUEST_TYPE_LABELS[request.pickup_request.request_type]}
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

      <OrderRecordTabs
        order={request}
        onChanged={refetch}
        overview={
          <>
            <Card className="p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow
                  icon={<LuUser className="size-4" />}
                  label="Requester"
                  value={request.pickup_request.full_name}
                />
                <InfoRow
                  icon={<LuMail className="size-4" />}
                  label="Email"
                  value={request.pickup_request.email || '—'}
                />
                <InfoRow
                  icon={<LuPhone className="size-4" />}
                  label="Phone"
                  value={request.pickup_request.phone_number || '—'}
                />
                <InfoRow
                  icon={<LuCalendar className="size-4" />}
                  label="Requested for"
                  value={
                    <AppDate
                      value={request.pickup_request.requested_at}
                      format="long"
                    />
                  }
                />
                <InfoRow
                  icon={<LuMapPin className="size-4" />}
                  label="Pickup address"
                  value={request.pickup_request.pickup_address}
                />
                <div className="sm:col-span-2">
                  <InfoRow
                    icon={<LuPackage className="size-4" />}
                    label="Materials"
                    value={
                      request.items.length === 0 ? (
                        '—'
                      ) : (
                        <ul className="space-y-0.5">
                          {request.items.map((item) => (
                            <li key={item.id}>
                              {item.category.name}
                              {item.estimated_quantity
                                ? ` — ${formatQuantity(item.estimated_quantity, item.quantity_unit)}`
                                : ''}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                  />
                </div>
              </div>

              {request.pickup_request.collection_point && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Drop-off collection point
                  </p>
                  <p className="text-sm text-slate-700">
                    {request.pickup_request.collection_point.name} —{' '}
                    {request.pickup_request.collection_point.address}
                  </p>
                </div>
              )}

              {request.pickup_request.note && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Requester&apos;s note
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {request.pickup_request.note}
                  </p>
                </div>
              )}

              {request.note && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Note
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {request.note}
                  </p>
                </div>
              )}

              {request.evaluation_status !== 'pending' && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                        value={
                          <AppDate value={request.evaluated_at} format="long" />
                        }
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
          </>
        }
      />

      <EvaluateModal
        requestId={request.id}
        open={evaluateOpen}
        onClose={() => setEvaluateOpen(false)}
        onEvaluated={handleEvaluated}
        items={request.items}
        isReevaluation={isReevaluation}
        scheduled={request.status === 'scheduled'}
      />
      <AssignDriverModal
        requestId={request.id}
        open={assignDriverOpen}
        onClose={() => setAssignDriverOpen(false)}
        onAssigned={handleDriverAssigned}
      />
      <CollectModal
        requestId={request.id}
        open={collectOpen}
        onClose={() => setCollectOpen(false)}
        onCollected={handleCollected}
        showPaymentFields={request.assigned_driver !== null}
        items={request.items}
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

export { OrderDetailsView };
