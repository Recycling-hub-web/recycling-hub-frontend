'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  LuArrowLeft,
  LuCalendar,
  LuCalendarCheck,
  LuClipboardCheck,
  LuImage,
  LuMail,
  LuMapPin,
  LuNavigation,
  LuPackage,
  LuPhone,
  LuUser,
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
import { WhatsAppLink } from '../../../../ui/WhatsAppLink';
import {
  EVALUATION_STATUS_BADGE_VARIANT,
  STATUS_BADGE_VARIANT,
} from '../../constants';
import { useOrder } from '../../hooks';
import {
  itemsSummary,
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_STATUS_LABELS,
} from '../../types';
import { formatQuantity } from '../../units';
import {
  googleMapsDirectionsUrl,
  wazeNavigateUrl,
} from '../../utils/navigationLinks';
import { ConfirmScheduleModal } from './ConfirmScheduleModal';

type DriverPickupDetailsViewProps = {
  requestId: string;
};

// Not yet collected — there's still somewhere to physically go, so
// still worth offering a navigation link. Once collected (or further
// along: delivered/closed), the trip's over.
const NAVIGABLE_STATUSES = ['pending', 'scheduled'];

/** A driver's own read-only "order profile" — no edit/schedule/evaluate
 * actions like the admin/staff details page has (OrderDetailsView),
 * just the information a driver needs about one stop, plus the one
 * driver-only action this page does have: confirming the pickup time
 * once scheduled (see ConfirmScheduleModal). Claiming/collecting stays
 * on the list (DriverPickupsView). */
const DriverPickupDetailsView = ({
  requestId,
}: DriverPickupDetailsViewProps) => {
  const { request, loading, error, refetch } = useOrder(requestId);
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (loading) return <Loading text="Loading order…" />;

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

  const canNavigate = NAVIGABLE_STATUSES.includes(request.status);
  const canConfirmSchedule =
    request.status === 'scheduled' && !request.pickup_confirmed_at;

  const handleConfirmed = () => {
    refetch();
    toast.success('Pickup time confirmed');
  };

  return (
    <PageContainer variant="form">
      <Link
        href="/driver/pickups"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickups
      </Link>

      <PageHeader
        title={request.code}
        subtitle={`${request.pickup_request.full_name} — ${itemsSummary(request.items)}`}
        actions={
          canConfirmSchedule ? (
            <Button onClick={() => setConfirmOpen(true)}>
              <LuClipboardCheck className="mr-1.5 size-4" />
              Confirm pickup time
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
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
            value={
              <WhatsAppLink phoneNumber={request.pickup_request.phone_number} />
            }
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
          <div className="sm:col-span-2">
            <InfoRow
              icon={<LuMapPin className="size-4" />}
              label="Pickup address"
              value={request.pickup_request.pickup_address}
            />
          </div>
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
          {request.price && (
            <InfoRow
              icon={<LuPackage className="size-4" />}
              label="Price"
              value={request.price}
            />
          )}
          {request.scheduled_at &&
            (request.pickup_confirmed_at ? (
              <InfoRow
                icon={<LuCalendarCheck className="size-4" />}
                label="Confirmed pickup"
                value={
                  <span>
                    <AppDate value={request.scheduled_at} format="datetime" />
                    <span className="block text-xs text-slate-400">
                      Confirmed{' '}
                      <AppDate
                        value={request.pickup_confirmed_at}
                        format="relative"
                      />
                    </span>
                  </span>
                }
              />
            ) : (
              <InfoRow
                icon={<LuCalendar className="size-4" />}
                label="Scheduled for (not confirmed yet)"
                value={
                  <AppDate value={request.scheduled_at} format="datetime" />
                }
              />
            ))}
        </div>

        {canNavigate && (
          <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              href={googleMapsDirectionsUrl(
                request.pickup_request.pickup_address,
              )}
            >
              <LuMapPin className="size-4" />
              Google Maps
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5"
              href={wazeNavigateUrl(request.pickup_request.pickup_address)}
            >
              <LuNavigation className="size-4" />
              Waze
            </Button>
          </div>
        )}

        {request.photos.length > 0 && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Photos
            </p>
            <div className="flex flex-wrap gap-2">
              {request.photos.map((photo) =>
                photo.file_key.public_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset
                  <img
                    key={photo.id}
                    src={photo.file_key.public_url}
                    alt=""
                    className="size-24 rounded-xl border border-slate-200 object-cover"
                  />
                ) : (
                  <span
                    key={photo.id}
                    className="flex size-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400"
                  >
                    <LuImage className="size-6" />
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {request.pickup_request.note && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Requester&apos;s note
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
              {request.pickup_request.note}
            </p>
          </div>
        )}

        {request.pickup_request.collection_point && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Drop-off collection point
            </p>
            <p className="text-sm text-slate-700">
              {request.pickup_request.collection_point.name} —{' '}
              {request.pickup_request.collection_point.address}
            </p>
          </div>
        )}
      </Card>

      <ConfirmScheduleModal
        requestId={request.id}
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirmed={handleConfirmed}
        initialScheduledAt={request.scheduled_at}
      />
    </PageContainer>
  );
};

export { DriverPickupDetailsView };
