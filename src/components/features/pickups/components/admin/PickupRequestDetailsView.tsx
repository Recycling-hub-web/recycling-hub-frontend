'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuClipboardCheck,
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
import {
  ActionsDropdown,
  type DropdownItem,
} from '../../../../ui/buttons/ActionsDropdown';
import { Button } from '../../../../ui/buttons/Button';
import { Card } from '../../../../ui/card/Card';
import { AppDate } from '../../../../ui/date/AppDate';
import { EmptyState } from '../../../../ui/empty/EmptyState';
import { InfoRow } from '../../../../ui/InfoRow';
import { Loading } from '../../../../ui/loading/Loading';
import { PageHeader } from '../../../../ui/PageHeader';
import { Tabs } from '../../../../ui/tabs';
import { useToast } from '../../../../ui/toast/ToastContext';
import { WhatsAppLink } from '../../../../ui/WhatsAppLink';
import {
  MAX_ORDERS_PER_PICKUP_REQUEST,
  PICKUP_REQUEST_STATUS_BADGE_VARIANT,
  REQUEST_TYPE_BADGE_VARIANT,
} from '../../constants';
import { usePickupRequest } from '../../hooks';
import {
  PICKUP_REQUEST_STATUS_LABELS,
  PICKUP_REQUEST_TYPE_LABELS,
} from '../../types';
import { CollectModal } from '../shared/CollectModal';
import {
  documentsFor,
  OrderActivity,
  OrderDocuments,
} from '../shared/OrderRecordTabs';
import { AssignDriverModal } from './AssignDriverModal';
import { CancelModal } from './CancelModal';
import { CancelPickupRequestModal } from './CancelPickupRequestModal';
import {
  evaluableOrders,
  isReevaluation,
  RequestEvaluateModal,
} from './RequestEvaluateModal';
import { type OrderAction, RequestOrderCard } from './RequestOrderCard';

type PickupRequestDetailsViewProps = {
  requestId: string;
  basePath:
    | '/admin/pickup-requests'
    | '/staff/pickup-requests'
    | '/super-admin/pickup-requests';
};

/** The customer's ask — its own contact/address/date fields plus the
 * Orders created under it, each handled right here (RequestOrderCard:
 * details, payment, schedule/collect/cancel) — there's no separate order
 * page; old order links land here with ?order=<id>. "Create order" starts
 * CreateOrderView, scoped to this request; "Cancel request" cascades
 * to every non-terminal Order (see CancelPickupRequestModal). Admin
 * and staff share identical permissions on this module. */
const PickupRequestDetailsView = ({
  requestId,
  basePath,
}: PickupRequestDetailsViewProps) => {
  const router = useRouter();
  const { request, loading, error, refetch } = usePickupRequest(requestId);
  const toast = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [evaluateOpen, setEvaluateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'documents' | 'activity'
  >('overview');
  // Orders open on this page (there's no separate order page); a link
  // with ?order=<id> opens that one on the Orders tab.
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orderAction, setOrderAction] = useState<{
    id: string;
    action: OrderAction;
  } | null>(null);

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get('order');
    if (!orderId) return;
    setActiveTab('orders');
    setExpandedOrders(new Set([orderId]));
  }, [requestId]);

  useEffect(() => {
    if (activeTab !== 'orders' || !request) return;
    const orderId = new URLSearchParams(window.location.search).get('order');
    if (orderId) {
      document
        .getElementById(`order-${orderId}`)
        ?.scrollIntoView({ block: 'start' });
    }
  }, [activeTab, request]);

  const toggleOrder = (id: string) =>
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const closeOrderAction = () => setOrderAction(null);
  const orderDone = (message: string) => {
    setOrderAction(null);
    refetch();
    toast.success(message);
  };

  const handleCancelled = () => {
    refetch();
    toast.success('Pickup request cancelled');
  };

  if (loading && !request) return <Loading text="Loading pickup request…" />;

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

  const actionOrder = request.orders.find((o) => o.id === orderAction?.id);

  // Admin and staff can always correct a request's details (no delete —
  // a request is cancelled instead). New orders and cancelling only make
  // sense while it's still open; the backend enforces both.
  const allDocuments = [
    ...request.photos.map((photo, index) => ({
      title: `Customer attachment ${index + 1}`,
      source: 'Pickup request',
      file: photo.file_key,
    })),
    ...request.orders.flatMap(documentsFor),
  ];
  const documents = allDocuments.filter(
    (entry, index) =>
      allDocuments.findIndex(
        (other) =>
          other.file.file_key === entry.file.file_key &&
          other.title === entry.title,
      ) === index,
  );

  const canCancel = request.status === 'open';
  const canCreateOrder =
    request.status === 'open' &&
    request.orders.length < MAX_ORDERS_PER_PICKUP_REQUEST;

  const actionItems: DropdownItem[] = [
    {
      label: 'Edit',
      icon: LuPencil,
      onClick: () => router.push(`${basePath}/${request.id}/edit`),
      color: 'neutral',
    },
    ...(canCreateOrder
      ? [
          {
            label: 'Create order',
            icon: LuPlus,
            onClick: () =>
              router.push(`${basePath}/${request.id}/orders/create`),
            color: 'neutral' as const,
          },
        ]
      : []),
    // The whole request is evaluated at once — every order still open
    // to it (see RequestEvaluateModal).
    ...(evaluableOrders(request.orders).length
      ? [
          {
            label: isReevaluation(request.orders) ? 'Re-evaluate' : 'Evaluate',
            icon: LuClipboardCheck,
            onClick: () => setEvaluateOpen(true),
            color: 'neutral' as const,
          },
        ]
      : []),
    ...(canCancel
      ? [
          {
            label: 'Cancel request',
            icon: LuX,
            onClick: () => setCancelOpen(true),
            color: 'danger' as const,
          },
        ]
      : []),
  ];

  return (
    <PageContainer variant="form">
      <Link
        href={basePath}
        className="mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600 lg:mb-4 lg:min-h-0"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup requests
      </Link>

      <PageHeader
        title={request.code}
        subtitle={`${request.full_name} · ${request.orders.length} order${request.orders.length === 1 ? '' : 's'}`}
        actions={
          // More than one action → one Actions dropdown (project rule);
          // a lone action stays a plain button.
          actionItems.length > 1 ? (
            <ActionsDropdown items={actionItems} />
          ) : (
            <Button variant="secondary" href={`${basePath}/${request.id}/edit`}>
              <LuPencil className="mr-1.5 size-4" />
              Edit
            </Button>
          )
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

      <div className="mb-5 overflow-x-auto">
        <Tabs
          tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'orders', label: `Orders (${request.orders.length})` },
            { key: 'documents', label: `Documents (${documents.length})` },
            { key: 'activity', label: 'Activity' },
          ]}
          active={activeTab}
          onChange={setActiveTab}
          className="px-0"
        />
      </div>
      {activeTab === 'overview' && (
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
              value={<WhatsAppLink phoneNumber={request.phone_number} />}
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Note
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {request.note}
              </p>
            </div>
          )}

          {request.status === 'cancelled' && (
            <div className="mt-5 border-t border-slate-100 pt-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
                    value={
                      <AppDate value={request.cancelled_at} format="long" />
                    }
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
      )}
      {activeTab === 'orders' &&
        (request.orders.length === 0 ? (
          <Card className="p-5">
            <EmptyState
              icon={<LuPackage className="size-6" />}
              title="No orders yet"
              description="Create one to start the materials, pricing and driver workflow."
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {request.orders.map((order) => (
              <RequestOrderCard
                key={order.id}
                order={order}
                expanded={expandedOrders.has(order.id)}
                onToggle={() => toggleOrder(order.id)}
                onAction={(action) => setOrderAction({ id: order.id, action })}
                onChanged={refetch}
              />
            ))}
          </div>
        ))}
      {activeTab === 'documents' && <OrderDocuments documents={documents} />}
      {activeTab === 'activity' && (
        <OrderActivity orderId={request.id} requestLevel />
      )}

      <RequestEvaluateModal
        pickupRequestId={request.id}
        orders={request.orders}
        open={evaluateOpen}
        onClose={() => setEvaluateOpen(false)}
        onEvaluated={() => {
          toast.success('Pickup request evaluated', 'Its orders were updated.');
          refetch();
        }}
      />
      <AssignDriverModal
        requestId={orderAction?.id ?? ''}
        open={orderAction?.action === 'schedule'}
        onClose={closeOrderAction}
        onAssigned={() => orderDone('Pickup scheduled')}
      />
      <CollectModal
        requestId={orderAction?.id ?? ''}
        open={orderAction?.action === 'collect'}
        onClose={closeOrderAction}
        onCollected={() => orderDone('Marked as collected')}
        showPaymentFields={Boolean(actionOrder?.assigned_driver)}
        items={actionOrder?.items ?? []}
      />
      <CancelModal
        requestId={orderAction?.id ?? ''}
        open={orderAction?.action === 'cancel'}
        onClose={closeOrderAction}
        onCancelled={() => orderDone('Order cancelled')}
      />
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
