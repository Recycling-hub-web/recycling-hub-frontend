'use client';

import Link from 'next/link';
import { LuBuilding2, LuEye, LuMapPin, LuStar } from 'react-icons/lu';

import { useAuth } from '../../../../../contexts/AuthContext';
import { Button } from '../../../../ui/buttons/Button';
import type {
  CollectionRequestListItem,
  LatLng,
  OptimizeRouteResult,
} from '../../types';
import {
  googleMapsEmbedUrl,
  googleMapsMultiStopUrl,
  wazeNavigateUrl,
} from '../../utils/navigationLinks';

export const OptimizedRoutePreview = ({
  result,
  origin,
  selectedRequests,
  showMap = true,
  showWaze = true,
}: {
  showMap?: boolean;
  showWaze?: boolean;
  result: OptimizeRouteResult;
  origin: LatLng;
  selectedRequests: CollectionRequestListItem[];
}) => {
  const { user } = useAuth();
  const firstStop = selectedRequests.find(
    (order) => order.id === result.stops[0]?.request_id,
  );
  const embedUrl = googleMapsEmbedUrl(origin, result.stops, result.destination);
  const mapsUrl = googleMapsMultiStopUrl(
    origin,
    result.stops,
    result.collection_point.address || result.destination,
  );
  return (
    <section
      aria-label="Optimized route"
      className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Optimized route
      </h2>
      {showMap &&
        (embedUrl ? (
          <iframe
            title="Google Maps optimized route"
            src={embedUrl}
            className="mb-5 h-64 w-full rounded-xl border-0 sm:h-80"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <p className="mb-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
            Map preview unavailable. You can open the full route in Google Maps
            below.
          </p>
        ))}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Route order
        </h3>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          {result.stops.length} stops
        </span>
      </div>
      <ol className="rounded-xl border border-slate-200 px-4 py-2">
        <li className="relative flex gap-3 py-3">
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-4 top-10 w-px bg-slate-200"
          />
          <span className="bg-violet-100 text-violet-600 relative flex size-8 shrink-0 items-center justify-center rounded-full">
            <LuStar className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {user?.full_name || 'Your location'}
            </p>
            <p className="text-xs text-slate-500">Start · current location</p>
          </div>
        </li>
        {result.stops.map((stop, i) => {
          const req = selectedRequests.find((r) => r.id === stop.request_id);
          return (
            <li
              key={stop.request_id}
              className="relative flex items-start gap-3 py-3"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-4 w-px bg-slate-200"
              />
              <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">
                  {req?.code || 'Order code unavailable'}
                </p>
                <p
                  className="mt-0.5 truncate text-xs text-slate-500"
                  title={req?.pickup_request.pickup_address}
                >
                  {req?.pickup_request.pickup_address || 'Address unavailable'}
                </p>
              </div>
              {req && (
                <Link
                  href={`/driver/pickups/${req.id}`}
                  aria-label={`View order ${req.code}`}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-brand-600 hover:text-brand-600"
                >
                  <LuEye className="size-4" aria-hidden="true" />
                </Link>
              )}
            </li>
          );
        })}
        <li className="relative flex gap-3 py-3">
          <span
            aria-hidden="true"
            className="absolute left-4 top-0 h-4 w-px bg-slate-200"
          />
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <LuBuilding2 className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {result.collection_point.name} — Drop-off
            </p>
            <p className="mt-0.5 break-words text-xs text-slate-500">
              {result.collection_point.address}
            </p>
          </div>
        </li>
      </ol>
      <div
        className={`mt-4 grid gap-2 ${showWaze && firstStop ? 'grid-cols-2' : 'grid-cols-1'}`}
      >
        {showWaze && firstStop && (
          <Button
            href={wazeNavigateUrl(firstStop.pickup_request.pickup_address)}
            variant="secondary"
            size="sm"
            className="min-h-11 min-w-0 whitespace-nowrap"
          >
            Waze
          </Button>
        )}
        <Button
          href={mapsUrl}
          size="sm"
          className="min-h-11 min-w-0 gap-1.5 whitespace-nowrap"
        >
          <LuMapPin className="size-4" />
          Google Maps
        </Button>
      </div>
      {showWaze && firstStop && (
        <p className="mt-2 text-xs text-slate-500">
          Waze opens the first stop. Follow the list above for the remaining
          stops.
        </p>
      )}
    </section>
  );
};
