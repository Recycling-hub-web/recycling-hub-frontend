'use client';

import Link from 'next/link';
import {
  LuArrowLeft,
  LuCalendar,
  LuMail,
  LuMapPin,
  LuNavigation,
  LuPackage,
  LuPhone,
  LuUser,
} from 'react-icons/lu';

import { PageContainer } from '../../../layout/PageContainer';
import { StatusBadge } from '../../../ui/badges/StatusBadge';
import { Card } from '../../../ui/card/Card';
import { AppDate } from '../../../ui/date/AppDate';
import { InfoRow } from '../../../ui/InfoRow';
import { Loading } from '../../../ui/loading/Loading';
import { PageHeader } from '../../../ui/PageHeader';
import {
  EVALUATION_STATUS_BADGE_VARIANT,
  STATUS_BADGE_VARIANT,
} from '../constants';
import { usePickupRequest } from '../hooks';
import {
  PICKUP_EVALUATION_STATUS_LABELS,
  PICKUP_STATUS_LABELS,
} from '../types';
import {
  googleMapsDirectionsUrl,
  wazeNavigateUrl,
} from '../utils/navigationLinks';

type DriverPickupDetailsViewProps = {
  requestId: string;
};

// Not yet collected — there's still somewhere to physically go, so
// still worth offering a navigation link. Once collected (or further
// along: delivered/closed), the trip's over.
const NAVIGABLE_STATUSES = ['pending', 'scheduled'];

/** A driver's own read-only "pickup profile" — no edit/schedule/evaluate
 * actions like the admin/staff details page has (PickupRequestDetailsView),
 * just the information a driver needs about one stop. Collecting/claiming
 * stays on the list (DriverPickupsView) — this is purely informational. */
const DriverPickupDetailsView = ({
  requestId,
}: DriverPickupDetailsViewProps) => {
  const { request, loading, error, refetch } = usePickupRequest(requestId);

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

  const canNavigate = NAVIGABLE_STATUSES.includes(request.status);

  return (
    <PageContainer variant="form">
      <Link
        href="/driver/pickups"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <LuArrowLeft className="size-4" />
        Back to pickup requests
      </Link>

      <PageHeader
        title={request.full_name}
        subtitle={`${request.category.name} pickup request`}
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
            label="Requested date"
            value={
              request.requested_date ? (
                <AppDate value={request.requested_date} format="long" />
              ) : (
                '—'
              )
            }
          />
          <div className="sm:col-span-2">
            <InfoRow
              icon={<LuMapPin className="size-4" />}
              label="Pickup address"
              value={request.pickup_address}
            />
          </div>
          <InfoRow
            icon={<LuPackage className="size-4" />}
            label="Estimated quantity"
            value={
              request.estimated_quantity
                ? `${request.estimated_quantity} ${request.quantity_unit}`
                : '—'
            }
          />
          {request.price && (
            <InfoRow
              icon={<LuPackage className="size-4" />}
              label="Price"
              value={request.price}
            />
          )}
        </div>

        {canNavigate && (
          <div className="mt-5 flex gap-2 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() =>
                window.open(
                  googleMapsDirectionsUrl(request.pickup_address),
                  '_blank',
                  'noopener,noreferrer',
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LuMapPin className="size-4" />
              Google Maps
            </button>
            <button
              type="button"
              onClick={() =>
                window.open(
                  wazeNavigateUrl(request.pickup_address),
                  '_blank',
                  'noopener,noreferrer',
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LuNavigation className="size-4" />
              Waze
            </button>
          </div>
        )}

        {request.photo?.public_url && (
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Photo
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element -- remote/presigned URL, not a static asset */}
            <img
              src={request.photo.public_url}
              alt=""
              className="size-32 rounded-xl border border-slate-200 object-cover"
            />
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
      </Card>
    </PageContainer>
  );
};

export { DriverPickupDetailsView };
