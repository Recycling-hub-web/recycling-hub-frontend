'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { LuCalendar, LuFileText, LuUser } from 'react-icons/lu';

import { useAuth } from '../../../../../contexts/AuthContext';
import { apiFetch } from '../../../../../lib/api';
import { isAdminRole } from '../../../../../types/auth';
import { AlertBanner } from '../../../../ui/AlertBanner';
import { Button } from '../../../../ui/buttons/Button';
import { Card } from '../../../../ui/card/Card';
import { AppDate } from '../../../../ui/date/AppDate';
import { InfoRow } from '../../../../ui/InfoRow';
import { Loading } from '../../../../ui/loading/Loading';
import { TablePagination } from '../../../../ui/table';
import { Tabs } from '../../../../ui/tabs';
import { useToast } from '../../../../ui/toast/ToastContext';
import type { ActivityLogEntry } from '../../../activity/types';
import { ACTION_LABELS } from '../../../activity/types';
import { ReimburseModal } from '../../../finance/components/ReimburseModal';
import { reimbursementBlocker } from '../../../finance/eligibility';
import {
  DRIVER_FINANCE_STATUS_LABELS,
  FINANCE_PAYMENT_METHOD_LABELS,
  FINANCE_STATUS_LABELS,
} from '../../../finance/types';
import type { CollectionRequestDetails } from '../../types';

type Tab = 'overview' | 'documents' | 'payment' | 'activity';
type StoredDocument = { file_key: string; public_url: string | null };
type DocumentEntry = {
  title: string;
  file: StoredDocument;
  shared?: boolean;
  source?: string;
};

const ACTIVITY_LABELS: Record<string, string> = {
  ...ACTION_LABELS,
  delivered: 'Dropped off at collection point',
  closed: 'Delivery verified and closed',
  reimbursed: 'Driver reimbursed',
  claimed: 'Payment recorded for review',
  paid: 'Payment completed',
};

const documentsFor = (order: CollectionRequestDetails): DocumentEntry[] => {
  const entries: DocumentEntry[] = [
    ...(order.request_photos ?? []).map((photo, i) => ({
      title: `Customer attachment ${i + 1}`,
      file: photo.file_key,
    })),
    ...order.photos.map((photo, i) => ({
      title: `Order attachment ${i + 1}`,
      file: photo.file_key,
    })),
  ];
  if (order.photo)
    entries.push({ title: 'Collection proof', file: order.photo });
  if (order.route?.drop_off_proof)
    entries.push({
      title: 'Drop-off proof',
      file: order.route.drop_off_proof,
      shared: true,
    });
  if (order.finance_record?.proof_of_payment)
    entries.push({
      title: 'Customer payment proof',
      file: order.finance_record.proof_of_payment,
    });
  if (order.finance_record?.reimbursement_proof)
    entries.push({
      title: 'Driver reimbursement proof',
      file: order.finance_record.reimbursement_proof,
    });
  return entries
    .map((entry) => ({
      ...entry,
      source: entry.title.startsWith('Customer attachment')
        ? 'Pickup request'
        : order.code,
    }))
    .filter(
      (entry, index) =>
        entries.findIndex(
          (other) =>
            other.file.file_key === entry.file.file_key &&
            other.title === entry.title,
        ) === index,
    );
};

const OrderActivity = ({
  orderId,
  requestLevel = false,
}: {
  orderId: string;
  requestLevel?: boolean;
}) => {
  const [page, setPage] = useState(1);
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    apiFetch<{ results: ActivityLogEntry[]; count: number }>(
      `/${requestLevel ? 'pickup-requests' : 'pickups'}/${orderId}/activity/?page=${page}`,
      { signal: controller.signal },
    )
      .then((data) => {
        if (!controller.signal.aborted) {
          setEntries(data.results);
          setCount(data.count);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError('Could not load order activity.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [orderId, page, revision, requestLevel]);
  if (loading) return <Loading text="Loading order activity…" />;
  if (error)
    return (
      <Card className="p-5">
        <AlertBanner message={error} />
        <Button
          variant="secondary"
          onClick={() => setRevision((value) => value + 1)}
        >
          Retry
        </Button>
      </Card>
    );
  return (
    <Card className="p-5">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">
        {requestLevel ? 'Pickup request activity' : 'Order activity'}
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        {requestLevel
          ? 'Request, collection, delivery and payment events across all linked orders.'
          : 'Request, collection, delivery and payment events for this order.'}
      </p>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500">
          No activity has been recorded yet.
        </p>
      ) : (
        <ol className="space-y-4 border-l border-slate-200 pl-4">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {ACTIVITY_LABELS[entry.action] ??
                  entry.action.replace(/_/g, ' ')}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {entry.actor_name || 'System'} ·{' '}
                <AppDate value={entry.created_at} format="datetime" />
              </p>
              {['reason', 'note', 'evaluation_note'].map((key) =>
                typeof entry.details[key] === 'string' && entry.details[key] ? (
                  <p
                    key={key}
                    className="mt-2 whitespace-pre-wrap text-sm text-slate-600"
                  >
                    {String(entry.details[key])}
                  </p>
                ) : null,
              )}
            </li>
          ))}
        </ol>
      )}
      {count > 12 && (
        <TablePagination
          currentPage={page}
          onPageChange={setPage}
          itemsPerPage={12}
          itemCount={entries.length}
          totalCount={count}
          itemLabel="events"
          loading={loading}
        />
      )}
    </Card>
  );
};

const OrderLifecycle = ({ order }: { order: CollectionRequestDetails }) => (
  <Card className="mt-4 p-5">
    <h2 className="mb-4 text-sm font-semibold text-slate-900">
      Collection & delivery
    </h2>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <InfoRow
        icon={<LuUser className="size-4" />}
        label="Assigned driver"
        value={order.assigned_driver || 'Not assigned'}
      />
      {order.driver_assigned_by && (
        <InfoRow
          icon={<LuUser className="size-4" />}
          label="Assigned by"
          value={order.driver_assigned_by}
        />
      )}
      {order.driver_assigned_at && (
        <InfoRow
          icon={<LuCalendar className="size-4" />}
          label="Assigned at"
          value={<AppDate value={order.driver_assigned_at} format="datetime" />}
        />
      )}
      {order.scheduled_by && (
        <InfoRow
          icon={<LuUser className="size-4" />}
          label="Scheduled by"
          value={order.scheduled_by}
        />
      )}
      {order.assigned_collector && (
        <InfoRow
          icon={<LuUser className="size-4" />}
          label="Collector"
          value={order.assigned_collector}
        />
      )}
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Scheduled for"
        value={<AppDate value={order.scheduled_at} format="datetime" />}
      />
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Pickup confirmed"
        value={
          order.pickup_confirmed_at ? (
            <AppDate value={order.pickup_confirmed_at} format="datetime" />
          ) : (
            'Not yet confirmed'
          )
        }
      />
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Collected at"
        value={<AppDate value={order.collected_at} format="datetime" />}
      />
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Dropped off at"
        value={
          <AppDate value={order.route?.dropped_off_at} format="datetime" />
        }
      />
      {order.route?.collection_point && (
        <InfoRow
          icon={<LuUser className="size-4" />}
          label="Delivered to"
          value={`${order.route.collection_point.name} — ${order.route.collection_point.address}`}
        />
      )}
      {order.delivered_quantity !== null && (
        <InfoRow
          icon={<LuFileText className="size-4" />}
          label="Delivered quantity"
          value={order.delivered_quantity}
        />
      )}
      {order.closed_by && (
        <InfoRow
          icon={<LuUser className="size-4" />}
          label="Verified by"
          value={order.closed_by}
        />
      )}
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Closed at"
        value={<AppDate value={order.closed_at} format="datetime" />}
      />
      {order.cancelled_by && (
        <InfoRow
          icon={<LuUser className="size-4" />}
          label="Cancelled by"
          value={order.cancelled_by}
        />
      )}
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Created"
        value={<AppDate value={order.created_at} format="datetime" />}
      />
      <InfoRow
        icon={<LuCalendar className="size-4" />}
        label="Last updated"
        value={<AppDate value={order.updated_at} format="datetime" />}
      />
    </div>
    {order.items.length > 0 && (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2">Material</th>
              <th>Estimated</th>
              <th>Collected</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-slate-100">
                <td className="py-2">{item.category.name}</td>
                <td>{item.estimated_quantity ?? '—'}</td>
                <td>{item.collected_quantity ?? '—'}</td>
                <td>
                  {item.quantity_unit === 'unit' ? 'units' : item.quantity_unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {order.note && (
      <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">
        {order.note}
      </p>
    )}
    {order.cancellation_reason && (
      <AlertBanner
        message={`Cancellation reason: ${order.cancellation_reason}`}
        variant="warning"
      />
    )}
  </Card>
);

const OrderDocuments = ({ documents }: { documents: DocumentEntry[] }) => (
  <Card className="p-5">
    <h2 className="mb-2 text-sm font-semibold text-slate-900">
      Order documents
    </h2>
    <p className="mb-4 text-sm text-slate-500">
      Customer attachments, collection and delivery evidence, and payment
      receipts.
    </p>
    {documents.length === 0 ? (
      <p className="text-sm text-slate-500">
        No documents have been attached yet.
      </p>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2">
        {documents.map((doc) => (
          <div
            key={`${doc.title}-${doc.file.file_key}`}
            className="rounded-xl border border-slate-200 p-4"
          >
            <LuFileText className="mb-2 size-5 text-brand-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              {doc.title}
            </h3>
            {doc.source && (
              <p className="mt-1 text-xs font-medium text-slate-500">
                {doc.source}
              </p>
            )}
            {doc.shared && (
              <p className="mt-1 text-xs text-slate-500">
                Shared proof for this delivery route.
              </p>
            )}
            {doc.file.public_url ? (
              <a
                href={doc.file.public_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-brand-600 underline"
              >
                Open {doc.title.toLowerCase()}
              </a>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Document saved. Download link is currently unavailable.
              </p>
            )}
          </div>
        ))}
      </div>
    )}
  </Card>
);

const OrderRecordTabs = ({
  order,
  overview,
  onChanged,
}: {
  order: CollectionRequestDetails;
  overview: ReactNode;
  onChanged: () => void;
}) => {
  const [active, setActive] = useState<Tab>('overview');
  const [reimburseOpen, setReimburseOpen] = useState(false);
  const { user } = useAuth();
  const toast = useToast();
  const documents = documentsFor(order);
  const payment = order.finance_record;
  const canManagePayment =
    isAdminRole(user?.role) ||
    user?.role === 'staff' ||
    user?.role === 'accounting';
  return (
    <>
      <div className="mb-5 overflow-x-auto">
        <Tabs
          tabs={[
            { key: 'overview', label: 'Overview' },
            { key: 'documents', label: `Documents (${documents.length})` },
            { key: 'payment', label: 'Payment' },
            { key: 'activity', label: 'Activity' },
          ]}
          active={active}
          onChange={setActive}
          className="px-0"
        />
      </div>
      {active === 'overview' && (
        <>
          {overview}
          <OrderLifecycle order={order} />
        </>
      )}
      {active === 'documents' && <OrderDocuments documents={documents} />}
      {active === 'payment' && (
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">
            Customer payment & driver reimbursement
          </h2>
          {!payment ? (
            <p className="text-sm text-slate-500">
              No payment record is available for this order.
            </p>
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoRow
                  icon={<LuFileText className="size-4" />}
                  label="Agreed price"
                  value={`RM${payment.price}`}
                />
                <InfoRow
                  icon={<LuFileText className="size-4" />}
                  label="Paid to customer"
                  value={
                    payment.actual_amount === null
                      ? 'Not recorded'
                      : `RM${payment.actual_amount}`
                  }
                />
                <InfoRow
                  icon={<LuUser className="size-4" />}
                  label="Paid by driver"
                  value={payment.driver?.full_name || '—'}
                />
                <InfoRow
                  icon={<LuFileText className="size-4" />}
                  label="Payment method"
                  value={
                    payment.payment_method
                      ? FINANCE_PAYMENT_METHOD_LABELS[payment.payment_method]
                      : '—'
                  }
                />
                <InfoRow
                  icon={<LuFileText className="size-4" />}
                  label={
                    user?.role === 'driver' ? 'Payment status' : 'Reimbursement'
                  }
                  value={
                    user?.role === 'driver'
                      ? DRIVER_FINANCE_STATUS_LABELS[payment.status]
                      : FINANCE_STATUS_LABELS[payment.status]
                  }
                />
                <InfoRow
                  icon={<LuCalendar className="size-4" />}
                  label="Reimbursed at"
                  value={
                    <AppDate value={payment.reimbursed_at} format="datetime" />
                  }
                />
                {payment.reimbursed_by && (
                  <InfoRow
                    icon={<LuUser className="size-4" />}
                    label="Reimbursed by"
                    value={payment.reimbursed_by}
                  />
                )}
                {payment.driver && (
                  <InfoRow
                    icon={<LuFileText className="size-4" />}
                    label="Driver payout account"
                    value={
                      payment.driver.payout_account_details || 'Not configured'
                    }
                  />
                )}
              </div>
              {payment.items.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  {payment.items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span>{item.category}</span>
                      <span>RM{item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
              {canManagePayment && payment.status !== 'reimbursed' && (
                <div className="mt-4">
                  <AlertBanner
                    message={reimbursementBlocker(payment)}
                    variant="warning"
                  />
                  {!reimbursementBlocker(payment) && (
                    <Button onClick={() => setReimburseOpen(true)}>
                      Verify & Reimburse
                    </Button>
                  )}
                </div>
              )}
              <p className="mt-4 text-xs text-slate-500">
                Payment and reimbursement receipts are in the Documents tab.
              </p>
            </>
          )}
        </Card>
      )}
      {active === 'activity' && <OrderActivity orderId={order.id} />}
      <ReimburseModal
        ids={payment ? [payment.id] : []}
        open={reimburseOpen}
        onClose={() => setReimburseOpen(false)}
        onReimbursed={() => {
          setReimburseOpen(false);
          toast.success('Driver reimbursed');
          onChanged();
        }}
      />
    </>
  );
};

export { documentsFor, OrderActivity, OrderDocuments, OrderRecordTabs };
